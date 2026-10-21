import { describe, it } from 'node:test';

import isSlash from '../isSlash.mjs';
import valueParser from 'postcss-value-parser';

describe('isSlash', () => {
	it('matches a slash div node', (t) => {
		t.assert.strictEqual(isSlash(valueParser('a / b').nodes[1]), true);
	});

	it('ignores other div nodes', (t) => {
		t.assert.strictEqual(isSlash(valueParser('a, b').nodes[1]), false);
	});

	it('ignores non-div nodes', (t) => {
		t.assert.strictEqual(isSlash(valueParser('a').nodes[0]), false);
	});
});
