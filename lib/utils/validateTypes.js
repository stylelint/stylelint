'use strict';

/**
 * Checks if the value is a boolean or a Boolean object.
 * @param {any} value
 * @returns {boolean}
 */
function isBoolean(value) {
	return typeof value === 'boolean' || value instanceof Boolean;
}

/**
 * Checks if the value is a number or a Number object.
 * @param {any} value
 * @returns {boolean}
 */
function isNumber(value) {
	return typeof value === 'number' || value instanceof Number;
}

/**
 * Checks if the value is a RegExp object.
 * @param {any} value
 * @returns {boolean}
 */
function isRegExp(value) {
	return value instanceof RegExp;
}

/**
 * Checks if the value is a string or a String object.
 * @param {any} value
 * @returns {boolean}
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
