import appendRuleName from '../appendRuleName.mjs';

describe('appendRuleName', () => {
	const expectedString = 'Unexpected empty block (block-no-empty)';

	it('should append rule name in parentheses if not present', () => {
		expect(appendRuleName('Unexpected empty block', 'block-no-empty')).toBe(expectedString);
	});

	it('should not append rule name if already present', () => {
		expect(appendRuleName('Unexpected empty block (block-no-empty)', 'block-no-empty')).toBe(
			expectedString,
		);
	});
});
