'use strict';

/**
 * Checks if the value is a boolean or a Boolean object.
 * @param {unknown} value
 * @returns {value is boolean}
 */
function isBoolean(value) {
	return typeof value === 'boolean' || value instanceof Boolean;
}

/**
 * Checks if the value is a number or a Number object.
 * @param {unknown} value
 * @returns {value is number}
 */
function isNumber(value) {
	return typeof value === 'number' || value instanceof Number;
}

/**
 * Checks if the value is a RegExp object.
 * @param {unknown} value
 * @returns {value is RegExp}
 */
function isRegExp(value) {
	return value instanceof RegExp;
}

/**
 * Checks if the value is a string or a String object.
 * @param {unknown} value
 * @returns {value is string}
 */
function isString(value) {
	return typeof value === 'string' || value instanceof String;
}

module.exports = {
	isBoolean,
	isNumber,
	isRegExp,
	isString,
};
