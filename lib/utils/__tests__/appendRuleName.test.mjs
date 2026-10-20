import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import appendRuleName from '../appendRuleName.mjs';

describe('appendRuleName', () => {
	const expectedString = 'Unexpected empty block (block-no-empty)';

	it('should append rule name in parentheses if not present', () => {
		assert.equal(appendRuleName('Unexpected empty block', 'block-no-empty'), expectedString);
	});

	it('should not append rule name if already present', () => {
		assert.equal(
			appendRuleName('Unexpected empty block (block-no-empty)', 'block-no-empty'),
			expectedString,
		);
	});
});
