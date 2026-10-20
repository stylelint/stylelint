import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import assertItemsPartialDeepStrictEqual from '../../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import parseSelector from '../parseSelector.mjs';

describe('parseSelector', () => {
	it('parses selectors into an AST', async () => {
		const result = await postcss().process('a .foo, b::before {}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		assert.ok(ast);
		assert.equal(result.warnings().length, 0);
	});

	it('returns `undefined` when there is no selector', async () => {
		const result = await postcss().process('{}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		assert.equal(ast, undefined);
		assert.equal(result.warnings().length, 0);
	});

	it('warns on invalid selectors, but does not throw', async () => {
		const result = await postcss().process('[&] {}', { from: undefined });
		const rule = result.root.first;
		const ast = parseSelector(rule.selector, result, rule);

		assert.equal(ast, undefined);
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
