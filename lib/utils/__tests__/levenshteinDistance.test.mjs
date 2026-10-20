import assert from 'node:assert/strict';
import { test } from 'node:test';

import levenshteinDistance from '../levenshteinDistance.mjs';

test('levenshteinDistance', () => {
	assert.equal(levenshteinDistance('', ''), 0);
	assert.equal(levenshteinDistance('', 'foo'), 3);
	assert.equal(levenshteinDistance('foo', ''), 3);
	assert.equal(levenshteinDistance('foo', 'foo'), 0);
	assert.equal(levenshteinDistance('foo', 'fo'), 1);
	assert.equal(levenshteinDistance('fo', 'foo'), 1);
	assert.equal(levenshteinDistance('foo', 'fob'), 1);
	assert.equal(levenshteinDistance('ab', 'ba'), 2);
	assert.equal(levenshteinDistance('kitten', 'sitting'), 3);
	assert.equal(levenshteinDistance('sitting', 'kitten'), 3);
	assert.equal(levenshteinDistance('color-namd', 'color-named'), 1);
});

test('levenshteinDistance compares UTF-16 code units', () => {
	assert.equal(levenshteinDistance('😀', ''), 2);
	assert.equal(levenshteinDistance('😀', '😁'), 1);
});
