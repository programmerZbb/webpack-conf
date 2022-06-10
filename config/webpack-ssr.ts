// 使用ts配置webpack，https://webpack.docschina.org/configuration/configuration-languages/。直接参照第三种方式为webapck配置一个单独的typescript配置文件
import * as path from 'path';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server'; // 就是这样配置的
// 参考：https://webpack.docschina.org/plugins/mini-css-extract-plugin/
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// 参考：https://github.com/webpack-contrib/webpack-bundle-analyzer
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// 官方已经弃用了 eslint-loader，参考：https://www.npmjs.com/package/eslint-webpack-plugin。webpack官方参考：https://webpack.docschina.org/plugins/eslint-webpack-plugin/
import ESLintPlugin from 'eslint-webpack-plugin';

// prettier-ignore
const config: Configuration = {
  // entry: './src/index.ts',
  entry: {
      'server': './src/server/index-server.tsx',
    //   'server.d': './src/server/index-server.d.ts' // todo 动态打包把ts文件打包进去
  }, // 这个入口是相对于package.json的
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]-server.js', // todo动态修改
    libraryTarget: 'umd'
  },
  mode: 'none', // 测试环境
  module: {
    rules: [
      {
        // 不能再对webpack的ts文件进行解析了。会直接读取 tsconfig 的配置，需要过滤掉 config 下的文件
        test: /\.tsx?$/,
        use: [
            {
                loader: 'babel-loader',
            },
            {
                loader: 'ts-loader',
                options: {
                    reportFiles: ['src/**/**-server.{ts,tsx}', '!src/skip.ts']
                },
            }
        ],
        // include: [
        //   path.join(__dirname, '../src')
        // ]
      },
      // 解析es6
    //   {
    //     test: /\.js$/, // 注意：使用了ts-loader解析tsx后，就不用再解析jsx文件了
    //     use: [{
    //       loader: 'babel-loader',
    //     }],
    //   },
      // 解析css
      {
        test: /\.(sa|sc|le|c)ss$/i,
        // type: 'asset/resource',
        // generator: {
        //   filename: 'assets/[name]_[contenthash:8].css',
        // },
        use: [
          // MiniCssExtractPlugin.loader, // 解析成单独的文件
          MiniCssExtractPlugin.loader, // 开发环境用 style-loader，正式环境用单独文件
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
        use: [
          // 'file-loader'
          { // 使用url-loader
            loader: 'url-loader',
            options: {
              limit: 10240, // 限制10k
            }
          }
        ]
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
    modules: [path.resolve('node_modules')],
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html', // 定义一个模板
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
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
  ],
  // 测试source map，参考：https://webpack.docschina.org/configuration/devtool/
  // devtool: 'eval',
  devtool: 'source-map',
  performance: {
    hints: false
  },
  optimization: {
    usedExports: true, // 其他模式打开 tree shaking
  },
};

export default config;
