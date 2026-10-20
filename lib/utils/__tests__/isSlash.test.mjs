import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isSlash from '../isSlash.mjs';
import valueParser from 'postcss-value-parser';

describe('isSlash', () => {
	it('matches a slash div node', () => {
		assert.equal(isSlash(valueParser('a / b').nodes[1]), true);
	});

	it('ignores other div nodes', () => {
		assert.equal(isSlash(valueParser('a, b').nodes[1]), false);
	});

	it('ignores non-div nodes', () => {
		assert.equal(isSlash(valueParser('a').nodes[0]), false);
	});
});
