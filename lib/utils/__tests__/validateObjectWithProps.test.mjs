import { describe, it } from 'node:test';

import validateObjectWithProps from '../validateObjectWithProps.mjs';

import { isNumber } from '../validateTypes.mjs';

describe('validateObjectWithProps', () => {
	it('should return a function', (t) => {
		t.assert.ok(validateObjectWithProps((x) => x) instanceof Function);
	});

	it('should reject non-objects', (t) => {
		t.assert.ok(!validateObjectWithProps((x) => x)(42));
	});

	describe('simple isNumber validator', () => {
		const validator = validateObjectWithProps(isNumber);

		it('should accept an object where the validators are true for any value', (t) => {
			t.assert.ok(
				validator({
					value1: 1,
					value2: 2,
				}),
			);
		});

		it('should be false if the validator is false for at least one value', (t) => {
			t.assert.ok(
				!validator({
					value1: 1,
					value2: '2',
				}),
			);
		});
	});
});
