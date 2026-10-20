import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import getImportantPosition from '../getImportantPosition.mjs';

describe('getImportantPosition', () => {
	it('returns a position of "!important"', () => {
		assert.deepEqual(getImportantPosition('color: pink !important'), { index: 12, endIndex: 22 });
	});

	it('returns a position of "!important" with upper-case', () => {
		assert.deepEqual(getImportantPosition('color: pink !IMPORTANT'), { index: 12, endIndex: 22 });
	});

	it('returns a position of "!important" including whitespaces', () => {
		assert.deepEqual(getImportantPosition('color: pink !   important'), {
			index: 12,
			endIndex: 25,
		});
	});

	it('returns a position of "!important" including whitespaces with upper-case', () => {
		assert.deepEqual(getImportantPosition('color: pink !   IMPORTANT'), {
			index: 12,
			endIndex: 25,
		});
	});

	it('returns undefined if no "!important"', () => {
		assert.equal(getImportantPosition('color: pink'), undefined);
	});

	it('returns undefined if just a "important"', () => {
		assert.equal(getImportantPosition('color: important'), undefined);
	});

	it('returns undefined if just a typo of "!important"', () => {
		assert.equal(getImportantPosition('color: !importanttt'), undefined);
	});
});
