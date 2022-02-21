'use strict';

const { isPlainObject: _isPlainObject } = require('is-plain-object');

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

/**
 * Checks if the value is a plain object.
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isPlainObject(value) {
	return _isPlainObject(value);
}

/**
 * Assert that the value is truthy.
 * @param {unknown} value
 * @returns {asserts value}
 */
function assert(value) {
	// eslint-disable-next-line no-console
	console.assert(value);
}

/**
 * Assert that the value is a number or a Number object.
 * @param {unknown} value
 * @returns {asserts value is number}
 */
function assertNumber(value) {
	// eslint-disable-next-line no-console
	console.assert(isNumber(value), `"${value}" must be a number`);
}

/**
 * Assert that the value is a string or a String object.
 * @param {unknown} value
 * @returns {asserts value is string}
 */
function assertString(value) {
	// eslint-disable-next-line no-console
	console.assert(isString(value), `"${value}" must be a string`);
}

module.exports = {
	isBoolean,
	isNumber,
	isRegExp,
	isString,
	isPlainObject,

	assert,
	assertNumber,
	assertString,
};
