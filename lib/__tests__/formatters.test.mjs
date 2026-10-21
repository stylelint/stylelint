import { test } from 'node:test';

import stylelint from '../index.mjs';

test('all built-in formatters are exposed on `stylelint` object', async (t) => {
	t.assert.strictEqual(Object.keys(stylelint.formatters).length, 6);
	t.assert.strictEqual(typeof (await stylelint.formatters.compact)([]), 'string');
	t.assert.strictEqual(typeof (await stylelint.formatters.json)([]), 'string');
	t.assert.strictEqual(typeof (await stylelint.formatters.string)([]), 'string');
	t.assert.ok((typeof (await stylelint.formatters.tap)([])).includes('string'));
	t.assert.strictEqual(typeof (await stylelint.formatters.unix)([]), 'string');
	t.assert.ok((typeof (await stylelint.formatters.verbose)([])).includes('string'));
});
