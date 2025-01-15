import postcss from 'postcss';

import rangesOverlap from '../rangesOverlap.mjs';

describe('rangesOverlap', () => {
	test('a right before b', () => {
		const [a, b] = postcss.parse('first {}second {}').nodes;

		expect(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
		).toBe(false);
	});

	test('a right after b', () => {
		const [b, a] = postcss.parse('first {}second {}').nodes;

		expect(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
		).toBe(false);
	});

	test('a before b with whitespace', () => {
		const [a, b] = postcss.parse('first {} second {}').nodes;

		expect(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
		).toBe(false);
	});

	test('a after b with whitespace', () => {
		const [b, a] = postcss.parse('first {} second {}').nodes;

		expect(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
		).toBe(false);
	});

	test('same range', () => {
		const a = postcss.parse('a {}').first;
		const b = postcss.parse('b {}').first;

		expect(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
		).toBe(true);
	});

	test('overlapping', () => {
		expect(rangesOverlap([1, 2], [1, 2])).toBe(true);
		expect(rangesOverlap([10, 20], [10, 20])).toBe(true);
		expect(rangesOverlap([15, 15], [10, 20])).toBe(true);
		expect(rangesOverlap([10, 20], [15, 15])).toBe(true);
		expect(rangesOverlap([10, 20], [19, 20])).toBe(true);
		expect(rangesOverlap([10, 20], [10, 11])).toBe(true);
		expect(rangesOverlap([19, 20], [10, 20])).toBe(true);
		expect(rangesOverlap([10, 11], [10, 20])).toBe(true);
		expect(rangesOverlap([10, 20], [15, 100])).toBe(true);
		expect(rangesOverlap([20, 30], [15, 100])).toBe(true);
		expect(rangesOverlap([95, 105], [15, 100])).toBe(true);
		expect(rangesOverlap([15, 100], [10, 20])).toBe(true);
		expect(rangesOverlap([15, 100], [20, 30])).toBe(true);
		expect(rangesOverlap([15, 100], [95, 105])).toBe(true);
	});

	test('not overlapping', () => {
		expect(rangesOverlap([1, 2], [2, 3])).toBe(false);
		expect(rangesOverlap([2, 3], [1, 2])).toBe(false);
		expect(rangesOverlap([10, 20], [30, 40])).toBe(false);
		expect(rangesOverlap([30, 40], [10, 20])).toBe(false);
	});
});
