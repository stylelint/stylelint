'use strict';

/**
 * Given an object of violation messages, return another
 * that provides the same messages postfixed with the rule
 * that has been violated.
 *
 * @template {import('stylelint').StylelintRuleMessages} T
 * @param {string} ruleName
 * @param {T} messages - Object whose keys are message identifiers
 *   and values are either message strings or functions that return message strings
 * @returns {T} New message object, whose messages will be marked with the rule name
 */
module.exports = function ruleMessages(ruleName, messages) {
	/** @type {T} */
	// @ts-expect-error -- TS2322: Type '{}' is not assignable to type 'T'.
	const newMessages = {};

	for (const [messageId, messageText] of Object.entries(messages)) {
		if (typeof messageText === 'string') {
			// @ts-expect-error -- TS2536: Type 'string' cannot be used to index type 'T'.
			newMessages[messageId] = `${messageText} (${ruleName})`;
		} else {
			// @ts-expect-error -- TS2536: Type 'string' cannot be used to index type 'T'.
			newMessages[messageId] = (...args) => `${messageText(...args)} (${ruleName})`;
		}
	}

	return newMessages;
};
