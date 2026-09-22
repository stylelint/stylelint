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

		expect(getSyntaxErrorPosition(error, 'a ) b')).toEqual({ index: 2, endIndex: 3 });
	});

	it('returns the character at the error offset within a value', () => {
		const error = getParseError('alpha(opacity=30)', 'value');

		expect(getSyntaxErrorPosition(error, 'alpha(opacity=30)')).toEqual({ index: 13, endIndex: 14 });
	});

	it('clamps the end to the source length', () => {
		const error = getParseError('.', 'selectorList');

		expect(getSyntaxErrorPosition(error, '.')).toEqual({ index: 1, endIndex: 1 });
	});

	it('returns the first character without an offset', () => {
		expect(getSyntaxErrorPosition(new SyntaxError('foo'), 'a b')).toEqual({
			index: 0,
			endIndex: 1,
		});
	});
});
