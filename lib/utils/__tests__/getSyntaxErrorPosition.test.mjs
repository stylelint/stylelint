import { describe, it } from 'node:test';

import { parse } from 'css-tree';

import getSyntaxErrorPosition from '../getSyntaxErrorPosition.mjs';

/**
 * @param {string} source
 * @param {'selectorList' | 'value'} context
 * @returns {SyntaxError}
 */
function getParseError(source, context) {
	try {
		parse(source, { context });
	} catch (error) {
		if (error instanceof SyntaxError) return error;

		throw error;
	}

	throw new Error(`Expected "${source}" not to parse`);
}

describe('getSyntaxErrorPosition', () => {
	it('returns the character at the error offset', (t) => {
		const error = getParseError('a ) b', 'selectorList');

		t.assert.deepStrictEqual(getSyntaxErrorPosition(error, 'a ) b'), { index: 2, endIndex: 3 });
	});

	it('returns the character at the error offset within a value', (t) => {
		const error = getParseError('alpha(opacity=30)', 'value');

		t.assert.deepStrictEqual(getSyntaxErrorPosition(error, 'alpha(opacity=30)'), {
			index: 13,
			endIndex: 14,
		});
	});

	it('clamps the end to the source length', (t) => {
		const error = getParseError('.', 'selectorList');

		t.assert.deepStrictEqual(getSyntaxErrorPosition(error, '.'), { index: 1, endIndex: 1 });
	});

	it('returns the first character without an offset', (t) => {
		t.assert.deepStrictEqual(getSyntaxErrorPosition(new SyntaxError('foo'), 'a b'), {
			index: 0,
			endIndex: 1,
		});
	});
});
