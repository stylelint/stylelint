import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import findNotContiguousOrRectangular from '../findNotContiguousOrRectangular.mjs';

describe('findNotContiguousOrRectangular finds', () => {
	test('nothing', () => {
		assert.deepEqual(
			findNotContiguousOrRectangular([
				['a', 'a', '.'],
				['a', 'a', '.'],
				['.', 'b', 'c'],
			]),
			[],
		);
	});

	test('non-contiguous area', () => {
		assert.deepEqual(
			findNotContiguousOrRectangular([
				['a', 'a', '.'],
				['a', 'a', '.'],
				['.', 'b', 'a'],
			]),
			['a'],
		);
	});

	test('non-contiguous area when area is not in an adjacent row', () => {
		assert.deepEqual(
			findNotContiguousOrRectangular([
				['header', 'header', 'header', 'header'],
				['main', 'main', '.', 'sidebar'],
				['footer', 'footer', 'footer', 'header'],
			]),
			['header'],
		);
	});
});
