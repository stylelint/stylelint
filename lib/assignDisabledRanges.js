/* @flow */
'use strict';

const _ = require('lodash');

const COMMAND_PREFIX = 'stylelint-';
const disableCommand = COMMAND_PREFIX + 'disable';
const enableCommand = COMMAND_PREFIX + 'enable';
const disableLineCommand = COMMAND_PREFIX + 'disable-line';
const disableNextLineCommand = COMMAND_PREFIX + 'disable-next-line';
const ALL_RULES = 'all';

/*:: type disableRange = {
    start: number,
    end?: number,
    strictStart: boolean,
    strictEnd?: boolean
  }
 */

/*:: type disabledRangeObject = {
  [ruleName: string]: Array<disableRange>
}*/

/** @typedef {import('postcss').Comment} PostcssComment */
/** @typedef {import('postcss').Root} PostcssRoot */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').DisabledRangeObject} DisabledRangeObject */
/** @typedef {import('stylelint').DisabledRange} DisabledRange */

/**
 * @param {number} start
 * @param {boolean} strictStart
 * @param {number} [end]
 * @param {boolean} [strictEnd]
 * @returns {DisabledRange}
 */
function createDisableRange(
	start /*: number*/,
	strictStart /*: boolean*/,
	end /*: ?number*/,
	strictEnd /*: ?boolean*/,
) /*: disableRange*/ {
	return {
		start,
		end: end || undefined,
		strictStart,
		strictEnd: typeof strictEnd === 'boolean' ? strictEnd : undefined,
	};
}

/**
 * Run it like a plugin ...
 * @param {PostcssRoot} root
 * @param {PostcssResult} result
 * @returns {PostcssResult}
 */
module.exports = function(root /*: Object*/, result /*: Object*/) /*: postcss$result*/ {
	result.stylelint = result.stylelint || {
		disabledRanges: {},
		ruleSeverities: {},
		customMessages: {},
	};

	/**
	 * Most of the functions below work via side effects mutating this object
	 * @type {DisabledRangeObject}
	 */
	const disabledRanges /*: disabledRangeObject*/ = {
		all: [],
	};

	result.stylelint.disabledRanges = disabledRanges;
	root.walkComments(checkComment);

	return result;

	/**
	 * @param {PostcssComment} comment
	 */
	function processDisableLineCommand(comment /*: postcss$comment*/) {
		if (comment.source && comment.source.start) {
			const line = comment.source.start.line;

			getCommandRules(disableLineCommand, comment.text).forEach((ruleName) => {
				disableLine(line, ruleName, comment);
			});
		}
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function processDisableNextLineCommand(comment /*: postcss$comment*/) {
		if (comment.source && comment.source.start) {
			const line = comment.source.start.line;

			getCommandRules(disableNextLineCommand, comment.text).forEach((ruleName) => {
				disableLine(line + 1, ruleName, comment);
			});
		}
	}

	/**
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {PostcssComment} comment
	 */
	function disableLine(line /*: number*/, ruleName /*: string*/, comment /*: postcss$comment*/) {
		if (ruleIsDisabled(ALL_RULES)) {
			throw comment.error('All rules have already been disabled', {
				plugin: 'stylelint',
			});
		}

		if (ruleIsDisabled(ruleName)) {
			throw comment.error(`"${ruleName}" has already been disabled`, {
				plugin: 'stylelint',
			});
		}

		if (ruleName === ALL_RULES) {
			Object.keys(disabledRanges).forEach((disabledRuleName) => {
				const strict = disabledRuleName === ALL_RULES;

				startDisabledRange(line, disabledRuleName, strict);
				endDisabledRange(line, disabledRuleName, strict);
			});
		} else {
			startDisabledRange(line, ruleName, true);
			endDisabledRange(line, ruleName, true);
		}
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function processDisableCommand(comment /*: postcss$comment*/) {
		getCommandRules(disableCommand, comment.text).forEach((ruleToDisable) => {
			const isAllRules = ruleToDisable === ALL_RULES;

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
					Object.keys(disabledRanges).forEach((ruleName) => {
						startDisabledRange(line, ruleName, ruleName === ALL_RULES);
					});
				} else {
					startDisabledRange(line, ruleToDisable, true);
				}
			}
		});
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function processEnableCommand(comment /*: postcss$comment*/) {
		getCommandRules(enableCommand, comment.text).forEach((ruleToEnable) => {
			// TODO TYPES
			// need fallback if endLine will be undefined
			const endLine =
				/** @type {number} */ (comment.source && comment.source.end && comment.source.end.line);

			if (ruleToEnable === ALL_RULES) {
				// @ts-ignore https://github.com/stylelint/stylelint/issues/4328
				if (_.values(disabledRanges).every((ranges) => _.isEmpty(ranges) || !!_.last(ranges.end))) {
					throw comment.error('No rules have been disabled', {
						plugin: 'stylelint',
					});
				}

				Object.keys(disabledRanges).forEach((ruleName) => {
					if (!_.get(_.last(disabledRanges[ruleName]), 'end')) {
						endDisabledRange(endLine, ruleName, ruleName === ALL_RULES);
					}
				});

				return;
			}

			if (ruleIsDisabled(ALL_RULES) && disabledRanges[ruleToEnable] === undefined) {
				// Get a starting point from the where all rules were disabled
				if (!disabledRanges[ruleToEnable]) {
					disabledRanges[ruleToEnable] = disabledRanges.all.map(({ start, end }) =>
						createDisableRange(start, false, end, false),
					);
				} else {
					const range = _.clone(_.last(disabledRanges[ALL_RULES]));

					if (range) {
						disabledRanges[ruleToEnable].push(range);
					}
				}

				endDisabledRange(endLine, ruleToEnable, true);

				return;
			}

			if (ruleIsDisabled(ruleToEnable)) {
				endDisabledRange(endLine, ruleToEnable, true);

				return;
			}

			throw comment.error(`"${ruleToEnable}" has not been disabled`, {
				plugin: 'stylelint',
			});
		});
	}

	/**
	 * @param {PostcssComment} comment
	 */
	function checkComment(comment /*: postcss$comment*/) {
		const text = comment.text;

		// Ignore comments that are not relevant commands

		if (text.indexOf(COMMAND_PREFIX) !== 0) {
			return result;
		}

		if (text.indexOf(disableLineCommand) === 0) {
			processDisableLineCommand(comment);
		} else if (text.indexOf(disableNextLineCommand) === 0) {
			processDisableNextLineCommand(comment);
		} else if (text.indexOf(disableCommand) === 0) {
			processDisableCommand(comment);
		} else if (text.indexOf(enableCommand) === 0) {
			processEnableCommand(comment);
		}
	}

	/**
	 * @param {string} command
	 * @param {string} fullText
	 * @returns {string[]}
	 */
	function getCommandRules(command /*: string*/, fullText /*: string*/) /*: Array<string>*/ {
		const rules = _.compact(fullText.slice(command.length).split(',')).map((r) => r.trim());

		if (_.isEmpty(rules)) {
			return [ALL_RULES];
		}

		return rules;
	}

	/**
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {boolean} strict
	 */
	function startDisabledRange(line /*: number*/, ruleName /*: string*/, strict /*: boolean*/) {
		const rangeObj = createDisableRange(line, strict);

		ensureRuleRanges(ruleName);
		disabledRanges[ruleName].push(rangeObj);
	}

	/**
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {boolean} strict
	 */
	function endDisabledRange(line /*: number*/, ruleName /*: string*/, strict /*: boolean*/) {
		const lastRangeForRule = _.last(disabledRanges[ruleName]);

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
	function ensureRuleRanges(ruleName /*: string*/) {
		if (!disabledRanges[ruleName]) {
			disabledRanges[ruleName] = disabledRanges.all.map(({ start, end }) =>
				createDisableRange(start, false, end, false),
			);
		}
	}

	/**
	 * @param {string} ruleName
	 * @returns {boolean}
	 */
	function ruleIsDisabled(ruleName /*: string*/) /*: boolean*/ {
		if (disabledRanges[ruleName] === undefined) return false;

		if (_.last(disabledRanges[ruleName]) === undefined) return false;

		if (_.get(_.last(disabledRanges[ruleName]), 'end') === undefined) return true;

		return false;
	}
};
