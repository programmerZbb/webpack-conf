// 单元测试，测试配置文件
import Mocha, {describe, it} from 'mocha';
import chai, { expect } from 'chai';
import webpackConf from '../../config/webpack-config';

const config = webpackConf({}, {
    mode: 'production',
    config: [ './config/webpack-config.ts' ],
    env: {},
});
describe('webpack base test case', () => {
    // config.entry
    it('entry', () => {
        expect(config.entry['index'], 'entry error').to.equal('/Users/zhangbinbinb28199/workspace/code/some-practice/some-practice/project/webpack/project/test/unit/src/index.tsx');
    });
});