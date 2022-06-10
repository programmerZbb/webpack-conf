import { Configuration } from 'webpack';
import path from 'path';

import { generateConfiguration } from './webpack-utils';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * { WEBPACK_SERVE: true } --------- {
    config: [ './config/webpack-prod.ts' ],
    open: true,
    env: { WEBPACK_SERVE: true }
    }
 */
// webpack 支持函数式导出
export default (
    env: Record<string, unknown>,
    // 所有 webpack 后用 -- 连接的参数都会进来
    arg: {
        // 非 production 都是dev环境
        mode?: 'production';
        // 这个就是webpack 配置文件地址
        config: Array<string>;
        // 同上 env
        env: Record<string, unknown>;
    },
): Configuration => {
    // console.log(env, '---------', arg);

    const { mode } = arg;
    // console.log(process.cwd(), '---000')
    const cwd = process.cwd();

    return generateConfiguration({
        mode: mode as Configuration['mode'],
        entry: {
            index: path.join(cwd, 'src/index.tsx'), // 命名 name 为 index
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(cwd, 'public/index.html'), // 定义一个模板
                inject: true, // js 或者 css 会自动的注入到这个template中
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false,
                },
                // meta: {
                //   viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
                // }, // 插入一个meta
            }),
        ],
    });
};
