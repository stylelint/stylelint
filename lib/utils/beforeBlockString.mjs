import { isAtRule, isRule } from './typeGuards.mjs';
import getAtRuleParams from './getAtRuleParams.mjs';
import getRuleSelector from './getRuleSelector.mjs';

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
		result += getRuleSelector(statement);
	} else if (isAtRule(statement)) {
		result += `@${statement.name}${raws.afterName || ''}${getAtRuleParams(statement)}`;
	} else {
		return '';
	}

	result += raws.between || '';

	return result;
}
