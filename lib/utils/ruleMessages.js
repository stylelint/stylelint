'use strict';

/**
 * Given an object of problem messages, return another
 * that provides the same messages postfixed with the rule
 * that has been violated.
 *
 * @template {import('stylelint').RuleMessages} T
 * @template {{[K in keyof T]: T[K]}} R
 * @param {string} ruleName
 * @param {T} messages - Object whose keys are message identifiers
 *   and values are either message strings or functions that return message strings
 * @returns {R} New message object, whose messages will be marked with the rule name
 */
function ruleMessages(ruleName, messages) {
	/** @typedef {keyof T} K */
	const newMessages = /** @type {R} */ ({});

	for (const [messageId, messageText] of /** @type {[K, T[K]][]} */ (Object.entries(messages))) {
		if (typeof messageText === 'string') {
			newMessages[messageId] = /** @type {R[K]} */ (`${messageText} (${ruleName})`);
		} else {
			newMessages[messageId] = /** @type {R[K]} */ (
				(...args) => `${messageText(...args)} (${ruleName})`
			);
		}
	}

	return newMessages;
}

module.exports = /** @type {typeof import('stylelint').utils.ruleMessages} */ (ruleMessages);
