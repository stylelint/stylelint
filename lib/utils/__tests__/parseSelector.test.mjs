import { describe, it } from 'node:test';

import postcss from 'postcss';

import assertItemsPartialDeepStrictEqual from '../../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import parseSelector from '../parseSelector.mjs';

describe('parseSelector', () => {
	it('parses selectors into an AST', async (t) => {
		const result = await postcss().process('a .foo, b::before {}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		t.assert.ok(ast);
		t.assert.strictEqual(result.warnings().length, 0);
	});

	it('returns `undefined` when there is no selector', async (t) => {
		const result = await postcss().process('{}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		t.assert.strictEqual(ast, undefined);
		t.assert.strictEqual(result.warnings().length, 0);
	});

	it('warns on invalid selectors, but does not throw', async (t) => {
		const result = await postcss().process('[&] {}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		t.assert.strictEqual(ast, undefined);
		assertItemsPartialDeepStrictEqual(result.warnings(), [
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
