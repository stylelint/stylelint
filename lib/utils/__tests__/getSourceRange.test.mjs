import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { tokenize } from '@csstools/css-tokenizer';

import getSourceRange from '../getSourceRange.mjs';
import substituteVarFunctions from '../substituteVarFunctions.mjs';

describe('getSourceRange', () => {
	it('maps a range of the stringified tokens to their indices in the source', () => {
		assert.deepEqual(getSourceRange(tokenize({ css: '1px solid red' }), [10, 13]), [10, 13]);
	});

	it('maps a range within substituted tokens to the indices of their var()', () => {
		const [{ tokens }] = substituteVarFunctions(
			'var(--foo) solid red',
			new Map([['--foo', ['1px']]]),
		);

		assert.deepEqual(getSourceRange(tokens, [1, 4]), [0, 10]);
		assert.deepEqual(getSourceRange(tokens, [12, 15]), [17, 20]);
	});

	it('returns undefined when the range does not start and end at tokens', () => {
		assert.equal(getSourceRange(tokenize({ css: '1px solid red' }), [1, 13]), undefined);
	});
});
