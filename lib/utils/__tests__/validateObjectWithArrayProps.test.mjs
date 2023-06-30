import validateObjectWithArrayProps from '../validateObjectWithArrayProps.js';

describe('validateObjectWithArrayProps', () => {
	it('should return a function', () => {
		expect(validateObjectWithArrayProps((x) => x)).toBeInstanceOf(Function);
	});

	describe('returned validator', () => {
		const validator = validateObjectWithArrayProps((x) => x > 0);

		it('should return false if any of the object properties do not satisfy the validator', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: 0,
				}),
			).toBeFalsy();
		});

		it('should return true otherwise', () => {
			expect(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: 3,
				}),
			).toBeTruthy();
		});
	});

	describe('returned validator with array', () => {
		const validator = validateObjectWithArrayProps(
			(x) => x > 0,
			(x) => x < 0,
		);

		it('should accept an array of validators, any of which can return true', () => {
			expect(
				validator({
					arrayProp: [1, -1],
					nonArrayProp: 3,
				}),
			).toBeTruthy();
		});

		it('should return false if none of the validators are true for any value', () => {
			expect(
				validator({
					arrayProp: [1, -1],
					nonArrayProp: 0,
				}),
			).toBeFalsy();
		});
	});
});
