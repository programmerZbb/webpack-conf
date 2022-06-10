// 单元测试，测试配置文件
import Mocha, {describe, it} from 'mocha';
import chai, { expect } from 'chai';
import path from 'path';
import webpackConf from '../../config/webpack-config';

const config = webpackConf({}, {
    mode: 'production',
    config: [ './config/webpack-config.ts' ],
    env: {},
});
describe('webpack base test case', () => {
    // config.entry
    it('entry', () => {
        expect(config.entry['index'], 'entry error').to.equal(path.join(process.cwd(), 'src/index.tsx'));
    });
});