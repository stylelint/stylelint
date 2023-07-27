'use strict';

const typeGuards = require('./typeGuards.cjs');

/**
 * @param {import('postcss').Container} statement
 * @returns {string}
 */
function beforeBlockString(statement, { noRawBefore } = { noRawBefore: false }) {
	let result = '';

	const before = statement.raws.before || '';

	if (!noRawBefore) {
		result += before;
	}

	if (typeGuards.isRule(statement)) {
		result += statement.selector;
	} else if (typeGuards.isAtRule(statement)) {
		result += `@${statement.name}${statement.raws.afterName || ''}${statement.params}`;
	} else {
		return '';
	}

	result += statement.raws.between || '';

	return result;
}

module.exports = beforeBlockString;
