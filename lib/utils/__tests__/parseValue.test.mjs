import { describe, it } from 'node:test';

import parseValue from '../parseValue.mjs';

describe('parseValue', () => {
	it('parses a value with the positions of its nodes', (t) => {
		t.assert.partialDeepStrictEqual(parseValue('1px solid red'), {
			type: 'Value',
			loc: { start: { offset: 0 }, end: { offset: 13 } },
		});
	});

	it('returns undefined for a value that cannot be parsed', (t) => {
		t.assert.strictEqual(parseValue(')'), undefined);
	});
});
