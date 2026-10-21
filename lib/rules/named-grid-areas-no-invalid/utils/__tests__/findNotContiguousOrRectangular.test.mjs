import { describe, test } from 'node:test';

import findNotContiguousOrRectangular from '../findNotContiguousOrRectangular.mjs';

describe('findNotContiguousOrRectangular finds', () => {
	test('nothing', (t) => {
		t.assert.deepStrictEqual(
			findNotContiguousOrRectangular([
				['a', 'a', '.'],
				['a', 'a', '.'],
				['.', 'b', 'c'],
			]),
			[],
		);
	});

	test('non-contiguous area', (t) => {
		t.assert.deepStrictEqual(
			findNotContiguousOrRectangular([
				['a', 'a', '.'],
				['a', 'a', '.'],
				['.', 'b', 'a'],
			]),
			['a'],
		);
	});

	test('non-contiguous area when area is not in an adjacent row', (t) => {
		t.assert.deepStrictEqual(
			findNotContiguousOrRectangular([
				['header', 'header', 'header', 'header'],
				['main', 'main', '.', 'sidebar'],
				['footer', 'footer', 'footer', 'header'],
			]),
			['header'],
		);
	});
});
