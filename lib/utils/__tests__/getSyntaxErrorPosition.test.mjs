import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

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
	it('returns the character at the error offset', () => {
		const error = getParseError('a ) b', 'selectorList');

		assert.deepEqual(getSyntaxErrorPosition(error, 'a ) b'), { index: 2, endIndex: 3 });
	});

	it('returns the character at the error offset within a value', () => {
		const error = getParseError('alpha(opacity=30)', 'value');

		assert.deepEqual(getSyntaxErrorPosition(error, 'alpha(opacity=30)'), {
			index: 13,
			endIndex: 14,
		});
	});

	it('clamps the end to the source length', () => {
		const error = getParseError('.', 'selectorList');

		assert.deepEqual(getSyntaxErrorPosition(error, '.'), { index: 1, endIndex: 1 });
	});

	it('returns the first character without an offset', () => {
		assert.deepEqual(getSyntaxErrorPosition(new SyntaxError('foo'), 'a b'), {
			index: 0,
			endIndex: 1,
		});
	});
});
