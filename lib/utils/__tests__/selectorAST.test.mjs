import postcss from 'postcss';
import selectorAST from '../selectorAST.mjs';

describe('selectorAST', () => {
	it('parses selectors into an AST', async () => {
		const result = await postcss().process('a .foo, b::before {}');
		const rule = result.root.first;
		const ast = selectorAST(rule.selector, result, rule);

		expect(ast).toBeTruthy();
		expect(result.warnings()).toHaveLength(0);
	});

	it('warns on invalid selectors, but does not throw', async () => {
		const result = await postcss().process('[&] {}');
		const rule = result.root.first;
		const ast = selectorAST(rule.selector, result, rule);

		expect(ast).toBeUndefined();
		expect(
			result.warnings().map((x) => {
				delete x.node;

				return x;
			}),
		).toEqual([
			{
				column: 1,
				endColumn: 7,
				endLine: 1,
				line: 1,
				stylelintType: 'parseError',
				text: 'Cannot parse selector (Error: Expected an attribute.)',
				type: 'warning',
			},
		]);
	});
});