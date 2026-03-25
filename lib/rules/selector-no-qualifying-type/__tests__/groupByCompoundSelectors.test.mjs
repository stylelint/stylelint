import selectorParser from 'postcss-selector-parser';

import { groupByCompoundSelectors } from '../getCompoundSelectors.mjs';

describe('groupByCompoundSelectors', () => {
	const parser = selectorParser();

	const testCases = [
		{
			input: 'a',
			output: ['a'],
		},
		{
			input: 'a b',
			output: ['a', 'b'],
		},
		{
			input: 'a:is(.b, .c)',
			output: ['a.b', 'a.c'],
		},
		{
			input: 'a:is(.b .c)',
			output: ['.b', 'a.c'],
		},
		{
			input: ':is(.a, .b):is(.c, .d):is(.e, .f)',
			output: ['.a.c.e', '.b.c.e', '.a.d.e', '.b.d.e', '.a.c.f', '.b.c.f', '.a.d.f', '.b.d.f'],
		},
		{
			input: 'a:has(b)',
			output: ['b', 'a'],
		},
		{
			input: 'a:has(b:is(.c, .d))',
			output: ['b.c', 'b.d', 'a'],
		},
		{
			input: 'a:has(b:is(.c, .d)):is(.e, .f .g)',
			output: ['b.c', 'b.d', '.f', 'a.e', 'a.g'],
		},
	];

	for (const { input, output } of testCases) {
		it(`input: ${input}`, () => {
			const root = parser.astSync(input);

			const result = groupByCompoundSelectors(root.nodes[0]).map((compound) => {
				compound.forEach((node) => {
					node.rawSpaceBefore = '';
					node.rawSpaceAfter = '';

					node.spaces.before = '';
					node.spaces.after = '';
				});

				return selectorParser.selector({ nodes: compound }).toString();
			});

			expect(result).toEqual(output);
		});
	}
});
