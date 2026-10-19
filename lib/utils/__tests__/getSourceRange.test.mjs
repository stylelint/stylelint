import { tokenize } from '@csstools/css-tokenizer';

import getSourceRange from '../getSourceRange.mjs';
import substituteVarFunctions from '../substituteVarFunctions.mjs';

describe('getSourceRange', () => {
	it('maps a range of the stringified tokens to their indices in the source', () => {
		expect(getSourceRange(tokenize({ css: '1px solid red' }), [10, 13])).toEqual([10, 13]);
	});

	it('maps a range within substituted tokens to the indices of their var()', () => {
		const [{ tokens }] = substituteVarFunctions(
			'var(--foo) solid red',
			new Map([['--foo', ['1px']]]),
		);

		expect(getSourceRange(tokens, [1, 4])).toEqual([0, 10]);
		expect(getSourceRange(tokens, [12, 15])).toEqual([17, 20]);
	});

	it('returns undefined when the range does not start and end at tokens', () => {
		expect(getSourceRange(tokenize({ css: '1px solid red' }), [1, 13])).toBeUndefined();
	});
});
