'use strict';

/** @typedef {(...args: any[]) => string} MessageGenerator */
/** @typedef {Record<string, string | MessageGenerator>} Messages */

/**
 * Given an object of violation messages, return another
 * that provides the same messages postfixed with the rule
 * that has been violated.
 *
 * @param {string} ruleName
 * @param {Messages} messages - Object whose keys are message identifiers
 *   and values are either message strings or functions that return message strings
 * @returns {Messages} New message object, whose messages will be marked with the rule name
 */
module.exports = function ruleMessages(ruleName, messages) {
	return Object.keys(messages).reduce((/** @type {Messages} */ newMessages, messageId) => {
		const messageText = messages[messageId];

		if (typeof messageText === 'string') {
			newMessages[messageId] = `${messageText} (${ruleName})`;
		} else {
			newMessages[messageId] = (...args) => `${messageText(...args)} (${ruleName})`;
		}

		return newMessages;
	}, {});
};
