import { RULE_NAME_ALL } from './constants.mjs';

import {
	DISABLE_COMMAND,
	DISABLE_LINE_COMMAND,
	DISABLE_NEXT_LINE_COMMAND,
	ENABLE_COMMAND,
	extractConfigurationComment,
	getConfigurationComment,
	isConfigurationComment,
} from './utils/configurationComment.mjs';
import { assert, assertNumber, assertString } from './utils/validateTypes.mjs';
import isStandardSyntaxComment from './utils/isStandardSyntaxComment.mjs';

/** @typedef {import('postcss').Comment} PostcssComment */
/** @typedef {import('postcss').Root} PostcssRoot */
/** @typedef {import('postcss').Document} PostcssDocument */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').DisabledRangeObject} DisabledRangeObject */
/** @typedef {import('stylelint').DisabledRange} DisabledRange */

/**
 * @param {PostcssComment} comment
 * @param {number} start
 * @param {boolean} strictStart
 * @param {string|undefined} description
 * @param {number} [end]
 * @param {boolean} [strictEnd]
 * @returns {DisabledRange}
 */
function createDisableRange(comment, start, strictStart, description, end, strictEnd) {
	return {
		comment,
		start,
		end: end || undefined,
		strictStart,
		strictEnd: typeof strictEnd === 'boolean' ? strictEnd : undefined,
		description,
	};
}

/**
 * Run it like a PostCSS plugin
 * @param {PostcssRoot | PostcssDocument} root
 * @param {PostcssResult} result
 * @returns {PostcssResult}
 */
export default function assignDisabledRanges(root, result) {
	result.stylelint = result.stylelint || {
		disabledRanges: {},
		ruleSeverities: {},
		customMessages: {},
		ruleMetadata: {},
	};

	/**
	 * Most of the functions below work via side effects mutating this object
	 * @type {DisabledRangeObject}
	 */
	const disabledRanges = result.stylelint.disabledRanges;

	/** @type {DisabledRange[]} */
	const disabledRangesAll = [];

	disabledRanges[RULE_NAME_ALL] = disabledRangesAll;

	// Work around postcss/postcss-scss#109 by merging adjacent `//` comments
	// into a single node before passing to `checkComment`.

	/** @type {PostcssComment?} */
	let inlineEnd;

	const configurationComment = result.stylelint.config?.configurationComment;

	root.walkComments((comment) => {
		if (inlineEnd) {
			// Ignore comments already processed by grouping with a previous one.
			if (inlineEnd === comment) inlineEnd = null;

			return;
		}

		const nextComment = comment.next();

		// If any of these conditions are not met, do not merge comments.
		if (
			!(
				!isStandardSyntaxComment(comment) &&
				isConfigurationComment(comment, configurationComment) &&
				nextComment &&
				nextComment.type === 'comment' &&
				(comment.text.includes('--') || nextComment.text.startsWith('--'))
			)
		) {
			checkComment(comment);

			return;
		}

		let lastLine = (comment.source && comment.source.end && comment.source.end.line) || 0;
		const fullComment = comment.clone();

		let current = nextComment;

		while (
			!isStandardSyntaxComment(current) &&
			!isConfigurationComment(current, configurationComment)
		) {
			const currentLine = (current.source && current.source.end && current.source.end.line) || 0;

			if (lastLine + 1 !== currentLine) break;

			fullComment.text += `\n${current.text}`;

			if (fullComment.source && current.source) {
				fullComment.source.end = current.source.end;
			}

			inlineEnd = current;
			const next = current.next();

			if (!next || next.type !== 'comment') break;

			current = next;
			lastLine = currentLine;
		}

		checkComment(fullComment);
	});

	return result;

	/**
	 * @param {PostcssComment} comment
	 */
	function processDisableLineCommand(comment) {
		if (comment.source && comment.source.start) {
			const line = comment.source.start.line;
			const description = getDescription(comment.text);

			for (const ruleName of getCommandRules(DISABLE_LINE_COMMAND, comment.text)) {
				disableLine(comment, line, ruleName, description);
			}
		}
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function processDisableNextLineCommand(comment) {
		if (comment.source && comment.source.end) {
			const line = comment.source.end.line;
			const description = getDescription(comment.text);

			for (const ruleName of getCommandRules(DISABLE_NEXT_LINE_COMMAND, comment.text)) {
				disableLine(comment, line + 1, ruleName, description);
			}
		}
	}

	/**
	 * @param {PostcssComment} comment
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {string|undefined} description
	 */
	function disableLine(comment, line, ruleName, description) {
		if (ruleIsDisabled(RULE_NAME_ALL)) {
			throw comment.error('All rules have already been disabled', {
				plugin: 'stylelint',
			});
		}

		if (ruleName === RULE_NAME_ALL) {
			for (const disabledRuleName of Object.keys(disabledRanges)) {
				if (ruleIsDisabled(disabledRuleName)) continue;

				const strict = disabledRuleName === RULE_NAME_ALL;

				startDisabledRange(comment, line, disabledRuleName, strict, description);
				endDisabledRange(line, disabledRuleName, strict);
			}
		} else {
			if (ruleIsDisabled(ruleName)) {
				throw comment.error(`"${ruleName}" has already been disabled`, {
					plugin: 'stylelint',
				});
			}

			startDisabledRange(comment, line, ruleName, true, description);
			endDisabledRange(line, ruleName, true);
		}
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function processDisableCommand(comment) {
		const description = getDescription(comment.text);

		for (const ruleToDisable of getCommandRules(DISABLE_COMMAND, comment.text)) {
			const isAllRules = ruleToDisable === RULE_NAME_ALL;

			if (ruleIsDisabled(ruleToDisable)) {
				throw comment.error(
					isAllRules
						? 'All rules have already been disabled'
						: `"${ruleToDisable}" has already been disabled`,
					{
						plugin: 'stylelint',
					},
				);
			}

			if (comment.source && comment.source.start) {
				const line = comment.source.start.line;

				if (isAllRules) {
					for (const ruleName of Object.keys(disabledRanges)) {
						startDisabledRange(comment, line, ruleName, ruleName === RULE_NAME_ALL, description);
					}
				} else {
					startDisabledRange(comment, line, ruleToDisable, true, description);
				}
			}
		}
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function processEnableCommand(comment) {
		for (const ruleToEnable of getCommandRules(ENABLE_COMMAND, comment.text)) {
			// need fallback if endLine will be undefined
			const endLine = comment.source && comment.source.end && comment.source.end.line;

			assertNumber(endLine);

			if (ruleToEnable === RULE_NAME_ALL) {
				if (
					Object.values(disabledRanges).every((ranges) => {
						if (ranges.length === 0) return true;

						const lastRange = ranges[ranges.length - 1];

						return lastRange && typeof lastRange.end === 'number';
					})
				) {
					throw comment.error('No rules have been disabled', {
						plugin: 'stylelint',
					});
				}

				for (const [ruleName, ranges] of Object.entries(disabledRanges)) {
					const lastRange = ranges[ranges.length - 1];

					if (!lastRange || !lastRange.end) {
						endDisabledRange(endLine, ruleName, ruleName === RULE_NAME_ALL);
					}
				}

				continue;
			}

			if (ruleIsDisabled(RULE_NAME_ALL) && disabledRanges[ruleToEnable] === undefined) {
				// Get a starting point from the where all rules were disabled
				disabledRanges[ruleToEnable] = disabledRangesAll.map(({ start, end, description }) =>
					createDisableRange(comment, start, false, description, end, false),
				);

				endDisabledRange(endLine, ruleToEnable, true);

				continue;
			}

			if (ruleIsDisabled(ruleToEnable)) {
				endDisabledRange(endLine, ruleToEnable, true);

				continue;
			}

			throw comment.error(`"${ruleToEnable}" has not been disabled`, {
				plugin: 'stylelint',
			});
		}
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function checkComment(comment) {
		// Ignore comments that are not relevant commands

		if (!isConfigurationComment(comment, configurationComment)) {
			return;
		}

		switch (extractConfigurationComment(comment, configurationComment)) {
			case DISABLE_LINE_COMMAND:
				processDisableLineCommand(comment);
				break;
			case DISABLE_NEXT_LINE_COMMAND:
				processDisableNextLineCommand(comment);
				break;
			case DISABLE_COMMAND:
				processDisableCommand(comment);
				break;
			case ENABLE_COMMAND:
				processEnableCommand(comment);
				break;
		}
	}

	/**
	 * @param {string} command
	 * @param {string} fullText
	 * @returns {string[]}
	 */
	function getCommandRules(command, fullText) {
		// Allow for description (f.e. /* stylelint-disable a, b -- Description */).
		const fullCommand = getConfigurationComment(command, configurationComment);
		const rulesText = fullText.slice(fullCommand.length).split(/\s-{2,}\s/u)[0];

		assertString(rulesText);
		const rules = rulesText
			.trim()
			.split(',')
			.filter(Boolean)
			.map((r) => r.trim());

		if (rules.length === 0) {
			return [RULE_NAME_ALL];
		}

		return rules;
	}

	/**
	 * @param {string} fullText
	 * @returns {string|undefined}
	 */
	function getDescription(fullText) {
		const descriptionStart = fullText.indexOf('--');

		if (descriptionStart === -1) return;

		return fullText.slice(descriptionStart + 2).trim();
	}

	/**
	 * @param {PostcssComment} comment
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {boolean} strict
	 * @param {string|undefined} description
	 */
	function startDisabledRange(comment, line, ruleName, strict, description) {
		const rangeObj = createDisableRange(comment, line, strict, description);

		ensureRuleRanges(ruleName);

		const range = disabledRanges[ruleName];

		assert(range);
		range.push(rangeObj);
	}

	/**
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {boolean} strict
	 */
	function endDisabledRange(line, ruleName, strict) {
		const ranges = disabledRanges[ruleName];
		const lastRangeForRule = ranges ? ranges[ranges.length - 1] : null;

		if (!lastRangeForRule) {
			return;
		}

		// Add an `end` prop to the last range of that rule
		lastRangeForRule.end = line;
		lastRangeForRule.strictEnd = strict;
	}

	/**
	 * @param {string} ruleName
	 */
	function ensureRuleRanges(ruleName) {
		if (!disabledRanges[ruleName]) {
			disabledRanges[ruleName] = disabledRangesAll.map(({ comment, start, end, description }) =>
				createDisableRange(comment, start, false, description, end, false),
			);
		}
	}

	/**
	 * @param {string} ruleName
	 * @returns {boolean}
	 */
	function ruleIsDisabled(ruleName) {
		const ranges = disabledRanges[ruleName];

		if (!ranges) return false;

		const lastRange = ranges[ranges.length - 1];

		if (!lastRange) return false;

		if (!lastRange.end) return true;

		return false;
	}
}
