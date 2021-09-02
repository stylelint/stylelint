'use strict';

/** @typedef {import('postcss').Rule} Rule */
/** @typedef {import('postcss').AtRule} AtRule */

/**
 * @param {Rule | AtRule} statement
 * @returns {string}
 */
module.exports = function beforeBlockString(statement, { noRawBefore } = { noRawBefore: false }) {
	let result = '';

	const before = statement.raws.before || '';

	if (!noRawBefore) {
		result += before;
	}

	switch (statement.type) {
		case 'rule':
			result += statement.selector;
			break;
		case 'atrule':
			result += `@${statement.name}${statement.raws.afterName || ''}${statement.params}`;
			break;
		default:
			return '';
	}

	result += statement.raws.between || '';

	return result;
};
