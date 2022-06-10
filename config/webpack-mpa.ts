import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import glob from 'glob';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { generateConfiguration } from './webpack-utils';

// 动态多页面入口。主要是为了产出不同的配置和出口
const setMPA = () => {
    const entry: Configuration['entry'] = {};
    const htmlWebpackPlugin: Configuration['plugins'] = [];

    const entryFiles = glob.sync(path.resolve(__dirname, '../src/*/index.tsx')); // 文件名通配符和Linux保持一致

    for (let entryFile of entryFiles) {
        const match = entryFile.match(/src\/(.*)\/index(.*)/);
        const pageName = match && match[1];

        entry[pageName!] = entryFile;

        htmlWebpackPlugin.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `../src/${pageName}/index.html`), // 定义一个模板
                filename: `${pageName}.html`,
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
        );
    }

    return {
        entry,
        htmlWebpackPlugin,
    };
};

const { entry, htmlWebpackPlugin } = setMPA();
console.log(entry, '---entry');

export function generateConfig(
    mode: Configuration['mode']
) {
    return generateConfiguration({
        mode,
        entry,
        plugins: htmlWebpackPlugin,
    });
};

export default generateConfig('production');
