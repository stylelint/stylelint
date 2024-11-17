import validateObjectWithNestedProps from '../validateObjectWithNestedProps.mjs';

import { isNullish, isString } from '../validateTypes.mjs';

describe('validateObjectWithNestedProps', () => {
	it('should return a function', () => {
		expect(validateObjectWithNestedProps((x) => x)).toBeInstanceOf(Function);
	});

	it('should reject non-objects', () => {
		expect(validateObjectWithNestedProps((x) => x)(42)).toBeFalsy();
		expect(validateObjectWithNestedProps((x) => x)(null)).toBeFalsy();
		expect(validateObjectWithNestedProps((x) => x)(undefined)).toBeFalsy();
		expect(validateObjectWithNestedProps((x) => x)('string')).toBeFalsy();
		expect(validateObjectWithNestedProps((x) => x)([1, 2, 3])).toBeFalsy();
	});

	describe('single isString validator', () => {
		const validator = validateObjectWithNestedProps(isString);

		it('should accept an object where all values satisfy the validator', () => {
			expect(
				validator({
					value1: 'hello',
					value2: 'world',
				}),
			).toBeTruthy();
		});

		it('should reject if the validator is false for at least one value', () => {
			expect(
				validator({
					value1: 'hello',
					value2: null,
				}),
			).toBeFalsy();
		});
	});

	describe('multiple validators (isString, isNullish)', () => {
		const validator = validateObjectWithNestedProps(isString, isNullish);

		it('should accept an object where values satisfy at least one validator', () => {
			expect(
				validator({
					value1: 'hello',
					value2: null,
					value3: undefined,
				}),
			).toBeTruthy();
		});

		it('should accept nested objects where values satisfy at least one validator', () => {
			expect(
				validator({
					value1: 'hello',
					nested: {
						value2: 'world',
						value3: null,
						deepNested: {
							value4: undefined,
							value5: '!',
						},
					},
				}),
			).toBeTruthy();
		});

		it('should reject if a value does not satisfy any validator', () => {
			expect(
				validator({
					value1: 'hello',
					value2: 42,
				}),
			).toBeFalsy();
		});

		it('should reject if a nested value does not satisfy any validator', () => {
			expect(
				validator({
					value1: 'hello',
					nested: {
						value2: 'world',
						value3: [],
					},
				}),
			).toBeFalsy();
		});
	});
});
