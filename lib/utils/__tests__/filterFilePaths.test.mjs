import { describe, it } from 'node:test';

import filterFilePaths from '../filterFilePaths.mjs';
import ignore from 'ignore';

describe('filterFilePaths', () => {
	it('empty ignorefile', (t) => {
		const ignorer = ignore().add('');
		const files = ['a.css', 'b/c/d.css', 'e/f.css', '../w.css'];

		t.assert.deepStrictEqual(filterFilePaths(ignorer, files), files);
	});

	it('ignore some files', (t) => {
		const ignorer = ignore().add('*.css\n!e/f.css');
		const files = ['a.css', 'b/c/d.css', 'e/f.css', '../w.css'];

		t.assert.deepStrictEqual(filterFilePaths(ignorer, files), ['e/f.css', '../w.css']);
	});
});
