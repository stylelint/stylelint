import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isFamilyNameKeyword from '../isFamilyNameKeyword.mjs';
import valueParser from 'postcss-value-parser';

describe('isFamilyNameKeyword', () => {
	it('matches generic font-family keywords', () => {
		assert.equal(isFamilyNameKeyword(valueParser('serif').nodes[0]), true);
		assert.equal(isFamilyNameKeyword(valueParser('SANS-SERIF').nodes[0]), true);
		assert.equal(isFamilyNameKeyword(valueParser('monospace').nodes[0]), true);
	});

	it('ignores quoted strings', () => {
		assert.equal(isFamilyNameKeyword(valueParser('"serif"').nodes[0]), false);
	});

	it('ignores non-keyword family names', () => {
		assert.equal(isFamilyNameKeyword(valueParser('Arial').nodes[0]), false);
	});
});
