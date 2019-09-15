'use strict';

const validateObjectWithArrayProps = require('../validateObjectWithArrayProps');

describe('validateObjectWithArrayProps', () => {
	it('should return a function', () => {
		expect(validateObjectWithArrayProps((x) => x)).toBeInstanceOf(Function);
	});

	describe('returned validator', () => {
		const validator = validateObjectWithArrayProps((x) => x);

		it('should return false if any of the object properties are not an array', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: 3,
				}),
			).toBeFalsy();
		});

		it('should return false if any of the object properties array values do not pass the test', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: [0, 3],
				}),
			).toBeFalsy();
		});

		it('should return true otherwise', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: [3, 4],
				}),
			).toBeTruthy();
		});
	});

	describe('returned validator with array', () => {
		const validator = validateObjectWithArrayProps([(x) => x > 0, (x) => x < 0]);

		it('should accept an array of validators, any of which can return true', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: [-1, 3],
				}),
			).toBeTruthy();
		});

		it('should be false if none of the validators are true for any value', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: [-1, 0],
				}),
			).toBeFalsy();
		});
	});
});
