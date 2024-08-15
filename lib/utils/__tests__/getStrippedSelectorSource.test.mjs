import selectorParser from 'postcss-selector-parser';

import getStrippedSelectorSource from '../getStrippedSelectorSource.mjs';

describe('getStrippedSelectorSource', () => {
	it('returns the expected source for erased selector nodes', async () => {
		{
			const root = selectorParser().astSync('aaa');

			root.first.nodes.length = 0;

			expect(getStrippedSelectorSource(root.first)).toStrictEqual({
				selector: '',
				index: 0,
				endIndex: 0,
			});
		}

		{
			const root = selectorParser().astSync(':is(aaa)');

			root.first.first.first.nodes.length = 0;

			expect(getStrippedSelectorSource(root.first)).toStrictEqual({
				selector: ':is()',
				index: 0,
				endIndex: 5,
			});

			expect(getStrippedSelectorSource(root.first.first.first)).toStrictEqual({
				selector: '',
				index: 4,
				endIndex: 4,
			});
		}
	});

	it('returns the expected source for nodes without surrounding white space', async () => {
		{
			const root = selectorParser().astSync('aaa');

			expect(getStrippedSelectorSource(root.first)).toStrictEqual({
				selector: 'aaa',
				index: 0,
				endIndex: 3,
			});
		}

		{
			const root = selectorParser().astSync('a.a');

			expect(getStrippedSelectorSource(root.first)).toStrictEqual({
				selector: 'a.a',
				index: 0,
				endIndex: 3,
			});
		}

		{
			const root = selectorParser().astSync('a:a');

			expect(getStrippedSelectorSource(root.first)).toStrictEqual({
				selector: 'a:a',
				index: 0,
				endIndex: 3,
			});
		}
	});

	it('returns the expected source for nodes with surrounding white space', async () => {
		{
			const root = selectorParser().astSync(' a , b ');

			expect(getStrippedSelectorSource(root.nodes[0])).toStrictEqual({
				selector: 'a',
				index: 1,
				endIndex: 2,
			});

			expect(getStrippedSelectorSource(root.nodes[1])).toStrictEqual({
				selector: 'b',
				index: 5,
				endIndex: 6,
			});
		}

		{
			const root = selectorParser().astSync(' a .a , b .b ');

			expect(getStrippedSelectorSource(root.nodes[0])).toStrictEqual({
				selector: 'a .a',
				index: 1,
				endIndex: 5,
			});

			expect(getStrippedSelectorSource(root.nodes[1])).toStrictEqual({
				selector: 'b .b',
				index: 8,
				endIndex: 12,
			});
		}
	});

	it('returns the expected source for nodes with surrounding white space and comments', async () => {
		{
			const root = selectorParser().astSync(' /* 1 */ a /* 2 */ , /* 3 */ b /* 4 */ ');

			expect(getStrippedSelectorSource(root.nodes[0])).toStrictEqual({
				selector: 'a',
				index: 9,
				endIndex: 10,
			});

			expect(getStrippedSelectorSource(root.nodes[1])).toStrictEqual({
				selector: 'b',
				index: 29,
				endIndex: 30,
			});
		}

		{
			const root = selectorParser().astSync(' /* 1 */ a\n/* 2 */ , /* 3 */ b\n/* 4 */ ');

			expect(getStrippedSelectorSource(root.nodes[0])).toStrictEqual({
				selector: 'a',
				index: 9,
				endIndex: 10,
			});

			expect(getStrippedSelectorSource(root.nodes[1])).toStrictEqual({
				selector: 'b',
				index: 29,
				endIndex: 30,
			});
		}

		{
			const root = selectorParser().astSync(':is( /* 1 */ a\n/* 2 */ , /* 3 */ b\n/* 4 */ )');

			expect(getStrippedSelectorSource(root.first.first.nodes[0])).toStrictEqual({
				selector: 'a',
				index: 13,
				endIndex: 14,
			});

			expect(getStrippedSelectorSource(root.first.first.nodes[1])).toStrictEqual({
				selector: 'b',
				index: 33,
				endIndex: 34,
			});
		}
	});
});

describe('getStrippedSelectorSource with constructed AST nodes', () => {
	it('returns the expected source for artificial selector nodes', async () => {
		const selector = selectorParser.selector({
			nodes: [],
		});

		expect(getStrippedSelectorSource(selector)).toStrictEqual({
			selector: '',
			index: 0,
			endIndex: 0,
		});
	});

	it('returns the expected source for nodes without surrounding white space', async () => {
		const selector = selectorParser.selector({
			nodes: [selectorParser.tag({ value: 'aaa' })],
		});

		expect(getStrippedSelectorSource(selector)).toStrictEqual({
			selector: 'aaa',
			index: 0,
			endIndex: 3,
		});
	});
});
