import { test } from 'node:test';

import levenshteinDistance from '../levenshteinDistance.mjs';

test('levenshteinDistance', (t) => {
	t.assert.strictEqual(levenshteinDistance('', ''), 0);
	t.assert.strictEqual(levenshteinDistance('', 'foo'), 3);
	t.assert.strictEqual(levenshteinDistance('foo', ''), 3);
	t.assert.strictEqual(levenshteinDistance('foo', 'foo'), 0);
	t.assert.strictEqual(levenshteinDistance('foo', 'fo'), 1);
	t.assert.strictEqual(levenshteinDistance('fo', 'foo'), 1);
	t.assert.strictEqual(levenshteinDistance('foo', 'fob'), 1);
	t.assert.strictEqual(levenshteinDistance('ab', 'ba'), 2);
	t.assert.strictEqual(levenshteinDistance('kitten', 'sitting'), 3);
	t.assert.strictEqual(levenshteinDistance('sitting', 'kitten'), 3);
	t.assert.strictEqual(levenshteinDistance('color-namd', 'color-named'), 1);
});

test('levenshteinDistance compares UTF-16 code units', (t) => {
	t.assert.strictEqual(levenshteinDistance('😀', ''), 2);
	t.assert.strictEqual(levenshteinDistance('😀', '😁'), 1);
});
