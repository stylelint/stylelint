import { isPlainObject } from './validateTypes.mjs';

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
export default function validateObjectWithNestedProps(...validators) {
	/**
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	function check(value) {
		if (!isPlainObject(value)) {
			return false;
		}

		return Object.values(value).every(
			/**
			 * @param {unknown} item
			 * @returns {boolean}
			 */
			(item) => {
				if (isPlainObject(item)) {
					return check(item);
				}

				return validators.some((validator) => validator(item));
			},
		);
	}

	return check;
}
