import glob from 'glob';
import mocha, {describe, it} from 'mocha';
import path from 'path';

describe('Checking generated html files', () => {
    it('should generate html files', done => {
        const files = glob.sync(path.join(__dirname, 'dist/index.html'));
        // console.log(files, '--999')

        if (files.length > 0) {
            done();
        } else {
            throw new Error('no html files generated');
        }
    });
});
