import assert from 'node:assert/strict';
import { test } from 'node:test';

import stylelint from '../index.mjs';

test('all built-in formatters are exposed on `stylelint` object', async () => {
	assert.equal(Object.keys(stylelint.formatters).length, 6);
	assert.equal(typeof (await stylelint.formatters.compact)([]), 'string');
	assert.equal(typeof (await stylelint.formatters.json)([]), 'string');
	assert.equal(typeof (await stylelint.formatters.string)([]), 'string');
	assert.ok((typeof (await stylelint.formatters.tap)([])).includes('string'));
	assert.equal(typeof (await stylelint.formatters.unix)([]), 'string');
	assert.ok((typeof (await stylelint.formatters.verbose)([])).includes('string'));
});
