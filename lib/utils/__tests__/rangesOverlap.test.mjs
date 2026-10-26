import { describe, test } from 'node:test';

import postcss from 'postcss';

import rangesOverlap from '../rangesOverlap.mjs';

describe('rangesOverlap', () => {
	test('a right before b', (t) => {
		const [a, b] = postcss.parse('first {}second {}').nodes;

		t.assert.strictEqual(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('a right after b', (t) => {
		const [b, a] = postcss.parse('first {}second {}').nodes;

		t.assert.strictEqual(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('a before b with whitespace', (t) => {
		const [a, b] = postcss.parse('first {} second {}').nodes;

		t.assert.strictEqual(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('a after b with whitespace', (t) => {
		const [b, a] = postcss.parse('first {} second {}').nodes;

		t.assert.strictEqual(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('same range', (t) => {
		const a = postcss.parse('a {}').first;
		const b = postcss.parse('b {}').first;

		t.assert.strictEqual(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			true,
		);
	});

	test('overlapping', (t) => {
		t.assert.strictEqual(rangesOverlap([1, 2], [1, 2]), true);
		t.assert.strictEqual(rangesOverlap([10, 20], [10, 20]), true);
		t.assert.strictEqual(rangesOverlap([15, 15], [10, 20]), true);
		t.assert.strictEqual(rangesOverlap([10, 20], [15, 15]), true);
		t.assert.strictEqual(rangesOverlap([10, 20], [19, 20]), true);
		t.assert.strictEqual(rangesOverlap([10, 20], [10, 11]), true);
		t.assert.strictEqual(rangesOverlap([19, 20], [10, 20]), true);
		t.assert.strictEqual(rangesOverlap([10, 11], [10, 20]), true);
		t.assert.strictEqual(rangesOverlap([10, 20], [15, 100]), true);
		t.assert.strictEqual(rangesOverlap([20, 30], [15, 100]), true);
		t.assert.strictEqual(rangesOverlap([95, 105], [15, 100]), true);
		t.assert.strictEqual(rangesOverlap([15, 100], [10, 20]), true);
		t.assert.strictEqual(rangesOverlap([15, 100], [20, 30]), true);
		t.assert.strictEqual(rangesOverlap([15, 100], [95, 105]), true);
	});

	test('not overlapping', (t) => {
		t.assert.strictEqual(rangesOverlap([1, 2], [2, 3]), false);
		t.assert.strictEqual(rangesOverlap([2, 3], [1, 2]), false);
		t.assert.strictEqual(rangesOverlap([10, 20], [30, 40]), false);
		t.assert.strictEqual(rangesOverlap([30, 40], [10, 20]), false);
	});
});
