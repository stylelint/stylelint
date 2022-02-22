'use strict';

const validateObjectWithProps = require('../validateObjectWithProps');
const { isNumber } = require('../validateTypes');

describe('validateObjectWithProps', () => {
	it('should return a function', () => {
		expect(validateObjectWithProps((x) => x)).toBeInstanceOf(Function);
	});

	describe('simple isNumber validator', () => {
		const validator = validateObjectWithProps(isNumber);

		it('should accept an object where the validators are true for any value', () => {
			expect(
				validator({
					value1: 1,
					value2: 2,
				}),
			).toBeTruthy();
		});

		it('should be false if the validator is false for at least one value', () => {
			expect(
				validator({
					value1: 1,
					value2: '2',
				}),
			).toBeFalsy();
		});
	});
});
