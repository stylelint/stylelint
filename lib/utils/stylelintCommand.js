'use strict';

const { assertString } = require('./validateTypes');

const DISABLE_COMMAND = 'stylelint-disable';
const DISABLE_LINE_COMMAND = 'stylelint-disable-line';
const DISABLE_NEXT_LINE_COMMAND = 'stylelint-disable-next-line';
const ENABLE_COMMAND = 'stylelint-enable';

const ALL_COMMANDS = new Set([
	DISABLE_COMMAND,
	DISABLE_LINE_COMMAND,
	DISABLE_NEXT_LINE_COMMAND,
	ENABLE_COMMAND,
]);

/** @typedef {import('postcss').Comment} Comment */

/**
 * Extract a command from a given comment.
 *
 * @param {Comment} comment
 * @returns {string}
 */
function extractStylelintCommand(comment) {
	const [command] = comment.text.split(/\s/, 1);

	assertString(command);

	return command;
}

/**
 * Tests if the given comment is a Stylelint command.
 *
 * @param {Comment} comment
 * @returns {boolean}
 */
function isStylelintCommand(comment) {
	const command = extractStylelintCommand(comment);

	return command !== undefined && ALL_COMMANDS.has(command);
}

module.exports = {
	DISABLE_COMMAND,
	DISABLE_LINE_COMMAND,
	DISABLE_NEXT_LINE_COMMAND,
	ENABLE_COMMAND,

	extractStylelintCommand,
	isStylelintCommand,
};
