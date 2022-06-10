// 使用ts配置webpack，https://webpack.docschina.org/configuration/configuration-languages/。直接参照第三种方式为webapck配置一个单独的typescript配置文件
import * as path from 'path';
import { Configuration, HotModuleReplacementPlugin, WebpackPluginInstance, Compiler } from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server'; // 就是这样配置的

// 参考：https://webpack.docschina.org/plugins/mini-css-extract-plugin/
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// css 压缩。https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// js压缩单独配置
import TerserPlugin from "terser-webpack-plugin";

import HtmlWebpackPlugin from 'html-webpack-plugin';
// 参考：https://github.com/webpack-contrib/webpack-bundle-analyzer
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// 官方已经弃用了 eslint-loader，参考：https://www.npmjs.com/package/eslint-webpack-plugin。webpack官方参考：https://webpack.docschina.org/plugins/eslint-webpack-plugin/
import ESLintPlugin from 'eslint-webpack-plugin';

// 自动清理构建物
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

// 输出日志优化
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';

const cwd = process.cwd();

// 需要发布的webpack配置。主要是路径做了优化，和构建时脚本的路径有相对关系
export function generateConfiguration(args: {
  mode: Configuration['mode'],
  entry: Configuration['entry'], // 支持定制entry
  plugins?: Configuration['plugins'], // 扩展plugins
}): Configuration {
  const { mode, entry, plugins = [] } = args;

  const devMode = mode ? mode !== 'production' : process.env.NODE_ENV !== "production";

  return {
    // entry: './src/index.ts',
    entry, // 这个入口是相对于package.json的
    output: {
      path: path.join(cwd, 'dist'),
      filename: '[name]-[chunkhash:8].js', // todo动态修改
    },
    mode,
    module: {
      rules: [
        {
          // 不能再对webpack的ts文件进行解析了。会直接读取 tsconfig 的配置，需要过滤掉 config 下的文件
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader', // ts-loader 的入口由 ts config 指定
            options: {},
          }],
          // include: [
          //   path.join(__dirname, '../src')
          // ]
        },
        // 解析文本
        {test: /\.txt$/, use: 'raw-loader'},
        // 解析es6
        {
          test: /\.js$/, // 注意：使用了ts-loader解析tsx后，就不用再解析jsx文件了
          use: [{
            loader: 'babel-loader',
          }],
        },
        // 解析css
        // {
        //   test: /\.css$/,
        //   use: [
        //     // 'style-loader',
        //     MiniCssExtractPlugin.loader, // 和style-loader冲突
        //     'css-loader',
        //   ],
        // },
        // 解析less。环境动态配置，参考：https://webpack.docschina.org/loaders/css-loader/#recommend
        {
          test: /\.(sa|sc|le|c)ss$/i,
          // type: 'asset/resource',
          // generator: {
          //   filename: 'assets/[name]_[contenthash:8].css',
          // },
          use: [
            // MiniCssExtractPlugin.loader, // 解析成单独的文件
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境用 style-loader，正式环境用单独文件
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2, // css-loader 之前有多少 loader 引用于 @import 资源
                // modules: true, // 开启css module，能够使用 import 方法
                modules: {
                  mode: 'local',
                  // auto: true, // 对象模式开启 css module，一定要用 undefined，会对所有的文件启用css模块
                  // localIdentName: "[path][name]__[local]--[hash:base64:5]", // 这种太精确了。
                  localIdentName: "[name]__[local]--[hash:base64:5]",
                },
              },
            },
            {
              loader: 'postcss-loader', // 支持css module
              options: {
                postcssOptions: {
                  plugins: () => [
                    require('autoprefixer')({
                      browsers: ['last 2 version', '>1%', 'ios 7'] // css兼容版本 最新俩版本、使用人数大于百分之1、ios 7以上的
                    })
                  ]
                },
              }
            },
            'less-loader',
          ]
        },
        // 解析图片
        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          // 静态资源配置参考：https://webpack.docschina.org/guides/asset-modules/
          type: 'asset',
          parser: {
            dataUrlCondition:{
              maxSize:8*1024  //data转成url的条件，也就是转成bas64的条件,maxSize相当于limit
            }
          },
          generator: {
            filename: 'static/imgs/[name]-[hash].[ext]',
            // publicPath: 'static/', // 这个就是公共的路径，会自动给该资源加上这个路径
          },
          // use: [
          //   // 'file-loader'
          //   { // 使用url-loader
          //     loader: 'url-loader',
          //     options: {
          //       limit: 10, // 限制10k
          //     }
          //   }
          // ]
        },
        // 解析字体
        {
          test: /\.(woff|woff2|eot|ttf|otf)/,
          use: [
            'file-loader'
          ]
        }
      ],
    },
    resolve: {
      modules: [path.join(__dirname, '../node_modules')], // 指定node_modules 路径
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.join(cwd, 'src'),
      },
    },
    plugins: ([
      // 包分析
      new BundleAnalyzerPlugin({
        // analyzerMode: 'static', // 静态的，不会启动一个服务
        analyzerMode: 'disabled', // generateStatsFile: true 生效，
        generateStatsFile: true, // 生成的配置文件会输出到output文件夹内
        analyzerPort: 'auto', // 自动以防端口被占用
        openAnalyzer: false, // 是否自动打开分析页面，设置为false，可以手动在浏览器中打开
      }),
      // es-lint
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx']
      }),
      // 输出日志优化
      new FriendlyErrorsWebpackPlugin(),
    ]).concat(
      devMode ? [
        // new HotModuleReplacementPlugin(), // 热更新，dev环境需要
      ] : [ // 动态配置插件
        new MiniCssExtractPlugin({
          filename: 'assets/[name]_[contenthash:8].css', // css 访问路径和生成路径由这个插件控制，不需要再进行设置
        }),
        // 自定义plugin
        (_this: Compiler, compiler: Compiler) => {
          _this.hooks.done.tap('done', stats => { // 编译完成之后执行
            if (stats.compilation.errors.length > 0 && !process.argv.includes('--watch')) { // 存在并且不能别监听
              console.log('build error444', stats.compilation.errors);
              process.exit(1);
            }
          })
        },
        // 清理构建物，只有正式环境能用
        (new CleanWebpackPlugin() as unknown as (this: Compiler, compiler: Compiler) => void),
      ],
      plugins,
    ),
    // devServer配置。contentBase 已经取消了，具体参考：https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
    devServer: {
      // contentBase: './'
      static: {
        directory: path.join(cwd, 'dist'),
        // publicPath: '/serve-public-path-url', // 访问路径 // todo 可以直接设置cdn
      },
      hot: true,
      liveReload: false, // 不刷新页面更新
    },
    // 测试source map，参考：https://webpack.docschina.org/configuration/devtool/
    devtool: devMode ? 'source-map' : false, // 开发环境推荐：https://webpack.docschina.org/configuration/devtool/#development
    performance: {
      hints: false, // todo
    },
    // optimization: {
    //   usedExports: true, // 其他模式打开 tree shaking
    // },
    // https://webpack.docschina.org/configuration/stats/#root
    stats: 'errors-warnings', // 如果想查看详细可以使用包分析，这个不是主要的
    optimization: {
      // 压缩配置
      minimizer: [ // 仅在生产环境启用
        new CssMinimizerPlugin(), // 开启css压缩
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 去掉console
              drop_debugger: true, // 过滤掉断点
            },
            format: {
              comments: false, // 不要注释
            },
          },
          extractComments: false, // 去除注释
        }), // js 压缩
      ],
      // minimize: true, // 在测试环境开启压缩
      // splitChunk
      splitChunks: { // 配置参考：https://zhuanlan.zhihu.com/p/152097785。外层的配置会影响整个webpack打包，注意。
        chunks: 'all',
        // minSize: 9000, // 规定被提取的模块在压缩前的大小最小值，单位为字节，默认为30000，只有超过了30000字节才会被提取。
        // minRemainingSize: 0,
        // maxSize: 0, // 选项：把提取出来的模块打包生成的文件大小不能超过maxSize值，如果超过了，要对其进行分割并打包生成新的文件。单位为字节，不能设置为0不能小于minSize。
        minChunks: 2, // 表示要被提取的模块最小被引用次数，引用次数超过或等于minChunks值，才能被提取。
        maxAsyncRequests: 5, // 最大的按需(异步)加载次数。也就是在代码中使用了动态 import 的方式的代码
        maxInitialRequests: 3, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件），默认为4
        // enforceSizeThreshold: 50000,
        // name: 'test', // 这个name就是在webpack生命周期内的name，最终输出还是依赖于 output 的配置。只是替换了 name 字段
        cacheGroups: { // 核心重点，配置提取模块的方案。里面每一项代表一个提取模块的方案。优先级高于同级配置。
          commons: { // 同步的配置
            name: 'common-chunk',
            minChunks: 2,
            priority: -20,
            chunks: 'all',
            minSize: 0,
            reuseExistingChunk: true,
          },
          venders: { // node_modules 打包
            minSize: 3000,
            name: 'chunk-venders',
            test: /[\\/]node_modules[\\/]/,
            priority: -10, // 提高优先级
            chunks: 'all',
          },
        },
      },
      // tree shaking
      // usedExports: true, // 其他模式打开 tree shaking
    },
  };
}
