import postcss from 'postcss';

import parseSelector from '../parseSelector.mjs';

describe('parseSelector', () => {
	it('parses selectors into an AST', async () => {
		const result = await postcss().process('a .foo, b::before {}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		expect(ast).toBeTruthy();
		expect(result.warnings()).toHaveLength(0);
	});

	it('returns `undefined` when there is no selector', async () => {
		const result = await postcss().process('{}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		expect(ast).toBeUndefined();
		expect(result.warnings()).toHaveLength(0);
	});

	it('warns on invalid selectors, but does not throw', async () => {
		const result = await postcss().process('[&] {}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

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

	it('keeps the callback support for backward compatibility', async () => {
		expect.assertions(3);

		const result = await postcss().process('a {}', { from: undefined });
		const rule = result.root.first;
		const processed = parseSelector(rule.selector, result, rule, (selectorRoot) => {
			expect(selectorRoot).toHaveProperty('type', 'root');
			expect(selectorRoot).toHaveProperty('nodes[0].nodes[0].value', 'a');
		});

		expect(typeof processed).toBe('string');
	});
});
