import selectorParser from 'postcss-selector-parser';

import getSelectorMeaningfulSource from '../getSelectorMeaningfulSource.mjs';

describe('getSelectorMeaningfulSource', () => {
	it('returns the expected source for nodes without surrounding white space', async () => {
		{
			const root = selectorParser().astSync('aaa');

			expect(getSelectorMeaningfulSource(root.first)).toStrictEqual({
				selectorStr: 'aaa',
				index: 0,
				endIndex: 3,
			});
		}

		{
			const root = selectorParser().astSync('a.a');

			expect(getSelectorMeaningfulSource(root.first)).toStrictEqual({
				selectorStr: 'a.a',
				index: 0,
				endIndex: 3,
			});
		}

		{
			const root = selectorParser().astSync('a:a');

			expect(getSelectorMeaningfulSource(root.first)).toStrictEqual({
				selectorStr: 'a:a',
				index: 0,
				endIndex: 3,
			});
		}
	});

	it('returns the expected source for nodes with surrounding white space', async () => {
		{
			const root = selectorParser().astSync(' a , b ');

			expect(getSelectorMeaningfulSource(root.nodes[0])).toStrictEqual({
				selectorStr: 'a',
				index: 1,
				endIndex: 2,
			});

			expect(getSelectorMeaningfulSource(root.nodes[1])).toStrictEqual({
				selectorStr: 'b',
				index: 5,
				endIndex: 6,
			});
		}

		{
			const root = selectorParser().astSync(' a .a , b .b ');

			expect(getSelectorMeaningfulSource(root.nodes[0])).toStrictEqual({
				selectorStr: 'a .a',
				index: 1,
				endIndex: 5,
			});

			expect(getSelectorMeaningfulSource(root.nodes[1])).toStrictEqual({
				selectorStr: 'b .b',
				index: 8,
				endIndex: 12,
			});
		}
	});

	it('returns the expected source for nodes with surrounding white space and comments', async () => {
		{
			const root = selectorParser().astSync(' /* 1 */ a /* 2 */ , /* 3 */ b /* 4 */ ');

			expect(getSelectorMeaningfulSource(root.nodes[0])).toStrictEqual({
				selectorStr: 'a',
				index: 9,
				endIndex: 10,
			});

			expect(getSelectorMeaningfulSource(root.nodes[1])).toStrictEqual({
				selectorStr: 'b',
				index: 29,
				endIndex: 30,
			});
		}

		{
			const root = selectorParser().astSync(' /* 1 */ a\n/* 2 */ , /* 3 */ b\n/* 4 */ ');

			expect(getSelectorMeaningfulSource(root.nodes[0])).toStrictEqual({
				selectorStr: 'a',
				index: 9,
				endIndex: 10,
			});

			expect(getSelectorMeaningfulSource(root.nodes[1])).toStrictEqual({
				selectorStr: 'b',
				index: 29,
				endIndex: 30,
			});
		}
	});
});
