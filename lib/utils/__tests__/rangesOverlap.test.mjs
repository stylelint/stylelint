import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import rangesOverlap from '../rangesOverlap.mjs';

describe('rangesOverlap', () => {
	test('a right before b', () => {
		const [a, b] = postcss.parse('first {}second {}').nodes;

		assert.equal(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('a right after b', () => {
		const [b, a] = postcss.parse('first {}second {}').nodes;

		assert.equal(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('a before b with whitespace', () => {
		const [a, b] = postcss.parse('first {} second {}').nodes;

		assert.equal(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('a after b with whitespace', () => {
		const [b, a] = postcss.parse('first {} second {}').nodes;

		assert.equal(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			false,
		);
	});

	test('same range', () => {
		const a = postcss.parse('a {}').first;
		const b = postcss.parse('b {}').first;

		assert.equal(
			rangesOverlap(
				[a.source.start?.offset, a.source.end?.offset],
				[b.source.start?.offset, b.source.end?.offset],
			),
			true,
		);
	});

	test('overlapping', () => {
		assert.equal(rangesOverlap([1, 2], [1, 2]), true);
		assert.equal(rangesOverlap([10, 20], [10, 20]), true);
		assert.equal(rangesOverlap([15, 15], [10, 20]), true);
		assert.equal(rangesOverlap([10, 20], [15, 15]), true);
		assert.equal(rangesOverlap([10, 20], [19, 20]), true);
		assert.equal(rangesOverlap([10, 20], [10, 11]), true);
		assert.equal(rangesOverlap([19, 20], [10, 20]), true);
		assert.equal(rangesOverlap([10, 11], [10, 20]), true);
		assert.equal(rangesOverlap([10, 20], [15, 100]), true);
		assert.equal(rangesOverlap([20, 30], [15, 100]), true);
		assert.equal(rangesOverlap([95, 105], [15, 100]), true);
		assert.equal(rangesOverlap([15, 100], [10, 20]), true);
		assert.equal(rangesOverlap([15, 100], [20, 30]), true);
		assert.equal(rangesOverlap([15, 100], [95, 105]), true);
	});

	test('not overlapping', () => {
		assert.equal(rangesOverlap([1, 2], [2, 3]), false);
		assert.equal(rangesOverlap([2, 3], [1, 2]), false);
		assert.equal(rangesOverlap([10, 20], [30, 40]), false);
		assert.equal(rangesOverlap([30, 40], [10, 20]), false);
	});
});
