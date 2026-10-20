import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import filterFilePaths from '../filterFilePaths.mjs';
import ignore from 'ignore';

describe('filterFilePaths', () => {
	it('empty ignorefile', () => {
		const ignorer = ignore().add('');
		const files = ['a.css', 'b/c/d.css', 'e/f.css', '../w.css'];

		assert.deepEqual(filterFilePaths(ignorer, files), files);
	});

	it('ignore some files', () => {
		const ignorer = ignore().add('*.css\n!e/f.css');
		const files = ['a.css', 'b/c/d.css', 'e/f.css', '../w.css'];

		assert.deepEqual(filterFilePaths(ignorer, files), ['e/f.css', '../w.css']);
	});
});
