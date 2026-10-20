import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import normalizeCombinator from '../normalizeCombinator.mjs';

describe('normalizeCombinator', () => {
	it('collapses whitespace runs to a single space', () => {
		assert.equal(normalizeCombinator('   '), ' ');
		assert.equal(normalizeCombinator('\n\t '), ' ');
		assert.equal(normalizeCombinator('>\n'), '> ');
	});

	it('leaves single-character combinators unchanged', () => {
		assert.equal(normalizeCombinator('>'), '>');
		assert.equal(normalizeCombinator('+'), '+');
		assert.equal(normalizeCombinator('~'), '~');
	});
});
