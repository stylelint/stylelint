'use strict';

const { isPlainObject } = require('is-plain-object');

/**
 * @template T
 * @typedef {(i: T) => boolean} Validator
 */

/**
 * Check whether the variable is an object and all its properties agree with the provided validator
 *
 * config = {
 *   value1: 1,
 *   value2: 2,
 *   value3: 3,
 * }
 * @template T
 * @param {Validator<T>} validator
 * @returns {(value: unknown) => boolean}
 */
module.exports = (validator) => (value) => {
	if (!isPlainObject(value)) {
		return false;
	}

	return Object.values(/** @type {Record<string, T>} */ (value)).every((item) => {
		return validator(item);
	});
};
