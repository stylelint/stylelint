import { describe, it } from 'node:test';

import getImportantPosition from '../getImportantPosition.mjs';

describe('getImportantPosition', () => {
	it('returns a position of "!important"', (t) => {
		t.assert.deepStrictEqual(getImportantPosition('color: pink !important'), {
			index: 12,
			endIndex: 22,
		});
	});

	it('returns a position of "!important" with upper-case', (t) => {
		t.assert.deepStrictEqual(getImportantPosition('color: pink !IMPORTANT'), {
			index: 12,
			endIndex: 22,
		});
	});

	it('returns a position of "!important" including whitespaces', (t) => {
		t.assert.deepStrictEqual(getImportantPosition('color: pink !   important'), {
			index: 12,
			endIndex: 25,
		});
	});

	it('returns a position of "!important" including whitespaces with upper-case', (t) => {
		t.assert.deepStrictEqual(getImportantPosition('color: pink !   IMPORTANT'), {
			index: 12,
			endIndex: 25,
		});
	});

	it('returns undefined if no "!important"', (t) => {
		t.assert.strictEqual(getImportantPosition('color: pink'), undefined);
	});

	it('returns undefined if just a "important"', (t) => {
		t.assert.strictEqual(getImportantPosition('color: important'), undefined);
	});

	it('returns undefined if just a typo of "!important"', (t) => {
		t.assert.strictEqual(getImportantPosition('color: !importanttt'), undefined);
	});
});
