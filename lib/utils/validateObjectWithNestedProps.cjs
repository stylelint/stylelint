// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('./validateTypes.cjs');

/**
 * Check whether the variable is an object and all its properties agree with at least one of the provided validators,
 * recursively checking nested objects.
 *
 * @example
 * const config = {
 *   value1: 'string',
 *   value2: null,
 *   value3: {
 *     nestedValue: 'string',
 *     nestedNull: null,
 *   },
 * };
 * validateObjectWithNestedProps(isString, isNullish)(config);
 * // => true
 *
 * @param {...(value: unknown) => boolean} validators
 * @returns {(value: unknown) => boolean}
 */
function validateObjectWithNestedProps(...validators) {
	/**
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	function check(value) {
		if (!validateTypes.isPlainObject(value)) {
			return false;
		}

		return Object.values(value).every(
			/**
			 * @param {unknown} item
			 * @returns {boolean}
			 */
			(item) => {
				if (validateTypes.isPlainObject(item)) {
					return check(item);
				}

				return validators.some((validator) => validator(item));
			},
		);
	}

	return check;
}

module.exports = validateObjectWithNestedProps;
