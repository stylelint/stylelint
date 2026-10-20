import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import validateObjectWithArrayProps from '../validateObjectWithArrayProps.mjs';

describe('validateObjectWithArrayProps', () => {
	it('should return a function', () => {
		assert.ok(validateObjectWithArrayProps((x) => x) instanceof Function);
	});

	describe('returned validator', () => {
		const validator = validateObjectWithArrayProps((x) => x > 0);

		it('should return false if any of the object properties do not satisfy the validator', () => {
			assert.ok(
				!validator({
					arrayProp: [1, 2],
					nonArrayProp: 0,
				}),
			);
		});

		it('should return true otherwise', () => {
			assert.ok(
				validator({
					arrayProp: [1, 2],
					nonArrayProp: 3,
				}),
			);
		});
	});

	describe('returned validator with array', () => {
		const validator = validateObjectWithArrayProps(
			(x) => x > 0,
			(x) => x < 0,
		);

		it('should accept an array of validators, any of which can return true', () => {
			assert.ok(
				validator({
					arrayProp: [1, -1],
					nonArrayProp: 3,
				}),
			);
		});

		it('should return false if none of the validators are true for any value', () => {
			assert.ok(
				!validator({
					arrayProp: [1, -1],
					nonArrayProp: 0,
				}),
			);
		});
	});
});
