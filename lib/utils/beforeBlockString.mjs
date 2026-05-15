import { isAtRule, isRule } from './typeGuards.mjs';

/**
 * @param {import('postcss').Container} statement
 * @param {{ noRawBefore: boolean }} options
 * @returns {string}
 */
export default function beforeBlockString(statement, { noRawBefore } = { noRawBefore: false }) {
	let result = '';

	const raws = statement.raws;

	if (!noRawBefore) {
		result += raws.before || '';
	}

	if (isRule(statement)) {
		result += raws.selector?.raw ?? statement.selector;
	} else if (isAtRule(statement)) {
		result += `@${statement.name}${raws.afterName || ''}${raws.params?.raw ?? statement.params}`;
	} else {
		return '';
	}

	result += raws.between || '';

	return result;
}
