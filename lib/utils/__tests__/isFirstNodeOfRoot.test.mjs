import { test } from 'node:test';

import isFirstNodeOfRoot from '../isFirstNodeOfRoot.mjs';

import postcss from 'postcss';

test('return false when the passed node is a root', (t) => {
	t.assert.strictEqual(isFirstNodeOfRoot(postcss.root()), false);
});

test('return false when the passed node has no parent', (t) => {
	t.assert.strictEqual(isFirstNodeOfRoot(postcss.rule({ selector: 'a' })), false);
});
