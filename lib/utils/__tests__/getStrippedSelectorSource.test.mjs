import { describe, it } from 'node:test';

import selectorParser from 'postcss-selector-parser';

import getStrippedSelectorSource from '../getStrippedSelectorSource.mjs';

describe('getStrippedSelectorSource', () => {
	it('returns the expected source for erased selector nodes', async (t) => {
		{
			const root = selectorParser().astSync('aaa');

			root.first.nodes.length = 0;

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first), {
				selector: '',
				index: 0,
				endIndex: 0,
			});
		}

		{
			const root = selectorParser().astSync(':is(aaa)');

			root.first.first.first.nodes.length = 0;

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first), {
				selector: ':is()',
				index: 0,
				endIndex: 5,
			});

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first.first.first), {
				selector: '',
				index: 4,
				endIndex: 4,
			});
		}
	});

	it('returns the expected source for nodes without surrounding white space', async (t) => {
		{
			const root = selectorParser().astSync('aaa');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first), {
				selector: 'aaa',
				index: 0,
				endIndex: 3,
			});
		}

		{
			const root = selectorParser().astSync('a.a');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first), {
				selector: 'a.a',
				index: 0,
				endIndex: 3,
			});
		}

		{
			const root = selectorParser().astSync('a:a');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first), {
				selector: 'a:a',
				index: 0,
				endIndex: 3,
			});
		}
	});

	it('returns the expected source for nodes with surrounding white space', async (t) => {
		{
			const root = selectorParser().astSync(' a , b ');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[0]), {
				selector: 'a',
				index: 1,
				endIndex: 2,
			});

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[1]), {
				selector: 'b',
				index: 5,
				endIndex: 6,
			});
		}

		{
			const root = selectorParser().astSync(' a .a , b .b ');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[0]), {
				selector: 'a .a',
				index: 1,
				endIndex: 5,
			});

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[1]), {
				selector: 'b .b',
				index: 8,
				endIndex: 12,
			});
		}
	});

	it('returns the expected source for nodes with surrounding white space and comments', async (t) => {
		{
			const root = selectorParser().astSync(' /* 1 */ a /* 2 */ , /* 3 */ b /* 4 */ ');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[0]), {
				selector: 'a',
				index: 9,
				endIndex: 10,
			});

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[1]), {
				selector: 'b',
				index: 29,
				endIndex: 30,
			});
		}

		{
			const root = selectorParser().astSync(' /* 1 */ a\n/* 2 */ , /* 3 */ b\n/* 4 */ ');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[0]), {
				selector: 'a',
				index: 9,
				endIndex: 10,
			});

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.nodes[1]), {
				selector: 'b',
				index: 29,
				endIndex: 30,
			});
		}

		{
			const root = selectorParser().astSync(':is( /* 1 */ a\n/* 2 */ , /* 3 */ b\n/* 4 */ )');

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first.first.nodes[0]), {
				selector: 'a',
				index: 13,
				endIndex: 14,
			});

			t.assert.deepStrictEqual(getStrippedSelectorSource(root.first.first.nodes[1]), {
				selector: 'b',
				index: 33,
				endIndex: 34,
			});
		}
	});
});

describe('getStrippedSelectorSource with constructed AST nodes', () => {
	it('returns the expected source for artificial selector nodes', async (t) => {
		const selector = selectorParser.selector({
			nodes: [],
		});

		t.assert.deepStrictEqual(getStrippedSelectorSource(selector), {
			selector: '',
			index: 0,
			endIndex: 0,
		});
	});

	it('returns the expected source for nodes without surrounding white space', async (t) => {
		const selector = selectorParser.selector({
			nodes: [selectorParser.tag({ value: 'aaa' })],
		});

		t.assert.deepStrictEqual(getStrippedSelectorSource(selector), {
			selector: 'aaa',
			index: 0,
			endIndex: 3,
		});
	});
});
