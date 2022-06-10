/*
 * @Author: zhangbinbin zhangbinbin03@corp.netease.com
 * @Date: 2022-06-07 00:23:16
 * @LastEditors: zhangbinbin zhangbinbin03@corp.netease.com
 * @LastEditTime: 2022-06-09 13:17:35
 * @FilePath: /project/test/smoke/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 冒烟测试脚本
import path from 'path';
import webpack from 'webpack';
import rimraf from 'rimraf';
import Mocha from 'mocha';

import webpackConf from '../../config/webpack-config';

process.chdir(path.join(__dirname, 'template'));

const mocha = new Mocha({
    timeout: '10000ms'
});

rimraf('./dist', () => {

    webpack(webpackConf({}, {
        mode: 'production',
        config: [ './config/webpack-config.ts' ],
        env: {},
    }), (err, stats) => {
        if (err != null) {
            console.log(err);
            process.exit(2);
        }
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false,
        }));

        mocha.addFile(path.join(__dirname, 'html-test.ts'));
        mocha.run();
    });
});
