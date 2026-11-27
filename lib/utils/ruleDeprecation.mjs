import { emitDeprecationWarning } from './emitWarning.mjs';

/**
 * @param {string} ruleName
 * @returns {string}
 */
export function getRuleDeprecationMessage(ruleName) {
	return `The "${ruleName}" rule is deprecated.`;
}

/**
 * @param {string} ruleName
 * @returns {void}
 */
export function emitRuleDeprecationWarning(ruleName) {
	emitDeprecationWarning(
		getRuleDeprecationMessage(ruleName),
		'RULE',
		`Please be aware that the "${ruleName}" rule will soon be either removed or renamed.`,
	);
}
