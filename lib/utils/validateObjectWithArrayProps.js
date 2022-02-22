'use strict';

const { isPlainObject } = require('./validateTypes');

/**
 * Check whether the variable is an object and all its properties are arrays of values
 * that satisfy the specified validator(s):
 *
 * @example
 * ignoreProperties = {
 *   value1: ["item11", "item12", "item13"],
 *   value2: ["item21", "item22", "item23"],
 *   value3: ["item31", "item32", "item33"],
 * };
 * validateObjectWithArrayProps(isString)(ignoreProperties);
 * //=> true
 *
 * @template {(value: unknown) => boolean} Validator
 * @param {Validator | Validator[]} validator
 * @returns {(value: unknown) => boolean}
 */
module.exports = function validateObjectWithArrayProps(validator) {
	return (value) => {
		if (!isPlainObject(value)) {
			return false;
		}

		return Object.values(value).every((array) => {
			if (!Array.isArray(array)) {
				return false;
			}

			// Make sure the array items are strings
			return array.every((item) => {
				if (Array.isArray(validator)) {
					return validator.some((v) => v(item));
				}

				return validator(item);
			});
		});
	};
};
