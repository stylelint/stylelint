'use strict';

const { assertString } = require('./validateTypes');

const DISABLE_COMMAND = '-disable';
const DISABLE_LINE_COMMAND = '-disable-line';
const DISABLE_NEXT_LINE_COMMAND = '-disable-next-line';
const ENABLE_COMMAND = '-enable';

const ALL_COMMANDS = new Set([
	DISABLE_COMMAND,
	DISABLE_LINE_COMMAND,
	DISABLE_NEXT_LINE_COMMAND,
	ENABLE_COMMAND,
]);

const DEFAULT_COMMAND_PREFIX = 'stylelint';

/** @typedef {import('postcss').Comment} Comment */

/**
 * Extract a command from a given comment.
 *
 * @param {Comment} comment
 * @param {string} [configurationComment]
 * @returns {string}
 */
function extractStylelintCommand(comment, configurationComment = DEFAULT_COMMAND_PREFIX) {
	const [command] = comment.text.split(/\s/, 1);

	assertString(command);

	return command.replace(configurationComment, '');
}

/**
 * Tests if the given comment is a Stylelint command.
 *
 * @param {Comment} comment
 * @param {string} [configurationComment]
 * @returns {boolean}
 */
function isStylelintCommand(comment, configurationComment = DEFAULT_COMMAND_PREFIX) {
	const command = extractStylelintCommand(comment, configurationComment);

	return command !== undefined && ALL_COMMANDS.has(command);
}

/**
 * Get full stylelint command
 *
 * @param {string} command
 * @param {string} [configurationComment]
 * @returns {string}
 */
function getStylelintCommand(command, configurationComment = DEFAULT_COMMAND_PREFIX) {
	return `${configurationComment}${command}`;
}

module.exports = {
	DEFAULT_COMMAND_PREFIX,
	DISABLE_COMMAND,
	DISABLE_LINE_COMMAND,
	DISABLE_NEXT_LINE_COMMAND,
	ENABLE_COMMAND,

	extractStylelintCommand,
	getStylelintCommand,
	isStylelintCommand,
};
