import { describe, it } from 'node:test';

import normalizeCombinator from '../normalizeCombinator.mjs';

describe('normalizeCombinator', () => {
	it('collapses whitespace runs to a single space', (t) => {
		t.assert.strictEqual(normalizeCombinator('   '), ' ');
		t.assert.strictEqual(normalizeCombinator('\n\t '), ' ');
		t.assert.strictEqual(normalizeCombinator('>\n'), '> ');
	});

	it('leaves single-character combinators unchanged', (t) => {
		t.assert.strictEqual(normalizeCombinator('>'), '>');
		t.assert.strictEqual(normalizeCombinator('+'), '+');
		t.assert.strictEqual(normalizeCombinator('~'), '~');
	});
});
