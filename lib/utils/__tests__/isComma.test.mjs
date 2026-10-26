import { describe, it } from 'node:test';

import isComma from '../isComma.mjs';
import valueParser from 'postcss-value-parser';

describe('isComma', () => {
	it('matches a comma div node', (t) => {
		t.assert.strictEqual(isComma(valueParser('a, b').nodes[1]), true);
	});

	it('ignores other div nodes', (t) => {
		t.assert.strictEqual(isComma(valueParser('a / b').nodes[1]), false);
	});

	it('ignores non-div nodes', (t) => {
		t.assert.strictEqual(isComma(valueParser('a').nodes[0]), false);
	});
});
