import levenshteinDistance from '../levenshteinDistance.mjs';

test('levenshteinDistance', () => {
	expect(levenshteinDistance('', '')).toBe(0);
	expect(levenshteinDistance('', 'foo')).toBe(3);
	expect(levenshteinDistance('foo', '')).toBe(3);
	expect(levenshteinDistance('foo', 'foo')).toBe(0);
	expect(levenshteinDistance('foo', 'fo')).toBe(1);
	expect(levenshteinDistance('fo', 'foo')).toBe(1);
	expect(levenshteinDistance('foo', 'fob')).toBe(1);
	expect(levenshteinDistance('ab', 'ba')).toBe(2);
	expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
	expect(levenshteinDistance('sitting', 'kitten')).toBe(3);
	expect(levenshteinDistance('color-namd', 'color-named')).toBe(1);
});

test('levenshteinDistance compares UTF-16 code units', () => {
	expect(levenshteinDistance('😀', '')).toBe(2);
	expect(levenshteinDistance('😀', '😁')).toBe(1);
});
