import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isComma from '../isComma.mjs';
import valueParser from 'postcss-value-parser';

describe('isComma', () => {
	it('matches a comma div node', () => {
		assert.equal(isComma(valueParser('a, b').nodes[1]), true);
	});

	it('ignores other div nodes', () => {
		assert.equal(isComma(valueParser('a / b').nodes[1]), false);
	});

	it('ignores non-div nodes', () => {
		assert.equal(isComma(valueParser('a').nodes[0]), false);
	});
});
