import assert from 'node:assert/strict';
import { test } from 'node:test';

import isFirstNodeOfRoot from '../isFirstNodeOfRoot.mjs';

import postcss from 'postcss';

test('return false when the passed node is a root', () => {
	assert.equal(isFirstNodeOfRoot(postcss.root()), false);
});

test('return false when the passed node has no parent', () => {
	assert.equal(isFirstNodeOfRoot(postcss.rule({ selector: 'a' })), false);
});
