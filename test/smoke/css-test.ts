import glob from "glob";
import mocha from 'mocha';
import path from 'path';

describe('Checking generated css files', () => {
    it('should generate css files', done => {
        const files = glob.sync(path.join(__dirname, 'dist/index.html'));
        // console.log(files, '--999')

        if (files.length > 0) {
            done();
        } else {
            throw new Error('no css files generated');
        }
    });
});
