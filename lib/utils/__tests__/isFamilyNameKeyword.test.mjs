import { describe, it } from 'node:test';

import isFamilyNameKeyword from '../isFamilyNameKeyword.mjs';
import valueParser from 'postcss-value-parser';

describe('isFamilyNameKeyword', () => {
	it('matches generic font-family keywords', (t) => {
		t.assert.strictEqual(isFamilyNameKeyword(valueParser('serif').nodes[0]), true);
		t.assert.strictEqual(isFamilyNameKeyword(valueParser('SANS-SERIF').nodes[0]), true);
		t.assert.strictEqual(isFamilyNameKeyword(valueParser('monospace').nodes[0]), true);
	});

	it('ignores quoted strings', (t) => {
		t.assert.strictEqual(isFamilyNameKeyword(valueParser('"serif"').nodes[0]), false);
	});

	it('ignores non-keyword family names', (t) => {
		t.assert.strictEqual(isFamilyNameKeyword(valueParser('Arial').nodes[0]), false);
	});
});
