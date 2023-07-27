import { assertString } from './validateTypes.mjs';

export const DISABLE_COMMAND = '-disable';
export const DISABLE_LINE_COMMAND = '-disable-line';
export const DISABLE_NEXT_LINE_COMMAND = '-disable-next-line';
export const ENABLE_COMMAND = '-enable';

const ALL_COMMANDS = new Set([
	DISABLE_COMMAND,
	DISABLE_LINE_COMMAND,
	DISABLE_NEXT_LINE_COMMAND,
	ENABLE_COMMAND,
]);

export const DEFAULT_CONFIGURATION_COMMENT = 'stylelint';

/** @typedef {import('postcss').Comment} Comment */

/**
 * Extract a command from a given comment.
 *
 * @param {Comment} comment
 * @param {string} [configurationComment]
 * @returns {string}
 */
export function extractConfigurationComment(
	comment,
	configurationComment = DEFAULT_CONFIGURATION_COMMENT,
) {
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
export function isConfigurationComment(
	comment,
	configurationComment = DEFAULT_CONFIGURATION_COMMENT,
) {
	const command = extractConfigurationComment(comment, configurationComment);

	return command !== undefined && ALL_COMMANDS.has(command);
}

/**
 * Get full stylelint command
 *
 * @param {string} command
 * @param {string} [configurationComment]
 * @returns {string}
 */
export function getConfigurationComment(
	command,
	configurationComment = DEFAULT_CONFIGURATION_COMMENT,
) {
	return `${configurationComment}${command}`;
}
