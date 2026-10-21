import { describe, it } from 'node:test';

import appendRuleName from '../appendRuleName.mjs';

describe('appendRuleName', () => {
	const expectedString = 'Unexpected empty block (block-no-empty)';

	it('should append rule name in parentheses if not present', (t) => {
		t.assert.strictEqual(
			appendRuleName('Unexpected empty block', 'block-no-empty'),
			expectedString,
		);
	});

	it('should not append rule name if already present', (t) => {
		t.assert.strictEqual(
			appendRuleName('Unexpected empty block (block-no-empty)', 'block-no-empty'),
			expectedString,
		);
	});
});
