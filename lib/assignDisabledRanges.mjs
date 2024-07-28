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
import { isAtRule, isComment, isDeclaration, isRule } from './utils/typeGuards.mjs';
import isStandardSyntaxComment from './utils/isStandardSyntaxComment.mjs';

import { isTokenComment, tokenize } from '@csstools/css-tokenizer';

/** @import {Node as PostcssNode, Comment as PostcssComment, Document as PostcssDocument, Root as PostcssRoot, Source as PostcssSource} from 'postcss' */
/** @import {DisabledRange, DisabledRangeObject, PostcssResult} from 'stylelint' */
/** @typedef {Pick<PostcssSource, 'start' | 'end'>} Source */

/**
 * @param {PostcssNode} node
 * @param {number} start
 * @param {boolean} strictStart
 * @param {string|undefined} description
 * @param {number} [end]
 * @param {boolean} [strictEnd]
 * @returns {DisabledRange}
 */
function createDisableRange(node, start, strictStart, description, end, strictEnd) {
	return {
		node,
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

	root.walk((node) => {
		if (isComment(node)) {
			if (inlineEnd) {
				// Ignore comments already processed by grouping with a previous one.
				if (inlineEnd === node) inlineEnd = null;

				return;
			}

			const nextComment = node.next();

			// If any of these conditions are not met, do not merge comments.
			if (
				!(
					!isStandardSyntaxComment(node) &&
					isConfigurationComment(node.text, configurationComment) &&
					nextComment &&
					isComment(nextComment) &&
					(node.text.includes('--') || nextComment.text.startsWith('--'))
				)
			) {
				checkComment(node, node.source, node.text);

				return;
			}

			let lastLine = node.source?.end?.line ?? 0;
			const fullComment = node.clone();

			let current = nextComment;

			while (
				!isStandardSyntaxComment(current) &&
				!isConfigurationComment(current.text, configurationComment)
			) {
				const currentLine = current.source?.end?.line ?? 0;

				if (lastLine + 1 !== currentLine) break;

				fullComment.text += `\n${current.text}`;

				if (fullComment.source && current.source) {
					fullComment.source.end = current.source.end;
				}

				inlineEnd = current;
				const next = current.next();

				if (!next || !isComment(next)) break;

				current = next;
				lastLine = currentLine;
			}

			checkComment(fullComment, fullComment.source, fullComment.text);
		}

		if (isRule(node)) {
			let offset = 0;
			const selector = node.raws?.selector?.raw;

			checkCommentsInNode(node, selector, offset);

			offset += selector?.length ?? node.selector.length;
			const between = node.raws?.between;

			checkCommentsInNode(node, between, offset);
		}

		if (isAtRule(node)) {
			let offset = node.name.length + 1; // `@` + name
			const afterName = node.raws?.afterName;

			checkCommentsInNode(node, afterName, offset);

			offset += afterName?.length ?? 0;
			const params = node.raws?.params?.raw;

			checkCommentsInNode(node, params, offset);

			offset += params?.length ?? node.params.length;
			const between = node.raws?.between;

			checkCommentsInNode(node, between, offset);
		}

		if (isDeclaration(node)) {
			let offset = node.prop.length;
			const between = node.raws?.between;

			checkCommentsInNode(node, between, offset);

			offset += between?.length ?? 0;
			const value = node.raws?.value?.raw;

			checkCommentsInNode(node, value, offset);
		}
	});

	return result;

	/**
	 * @param {PostcssNode} node
	 * @param {Source} source
	 * @param {string} text
	 */
	function processDisableLineCommand(node, source, text) {
		if (source.start) {
			const line = source.start.line;
			const description = getDescription(text);

			for (const ruleName of getCommandRules(DISABLE_LINE_COMMAND, text)) {
				disableLine(node, line, ruleName, description);
			}
		}
	}

	/**
	 * @param {PostcssNode} node
	 * @param {Source} source
	 * @param {string} text
	 */
	function processDisableNextLineCommand(node, source, text) {
		if (source.end) {
			const line = source.end.line;
			const description = getDescription(text);

			for (const ruleName of getCommandRules(DISABLE_NEXT_LINE_COMMAND, text)) {
				disableLine(node, line + 1, ruleName, description);
			}
		}
	}

	/**
	 * @param {PostcssNode} node
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {string|undefined} description
	 */
	function disableLine(node, line, ruleName, description) {
		if (ruleIsDisabled(RULE_NAME_ALL)) {
			throw node.error('All rules have already been disabled', {
				plugin: 'stylelint',
			});
		}

		if (ruleName === RULE_NAME_ALL) {
			for (const disabledRuleName of Object.keys(disabledRanges)) {
				if (ruleIsDisabled(disabledRuleName)) continue;

				const strict = disabledRuleName === RULE_NAME_ALL;

				startDisabledRange(node, line, disabledRuleName, strict, description);
				endDisabledRange(line, disabledRuleName, strict);
			}
		} else {
			if (ruleIsDisabled(ruleName)) {
				throw node.error(`"${ruleName}" has already been disabled`, {
					plugin: 'stylelint',
				});
			}

			startDisabledRange(node, line, ruleName, true, description);
			endDisabledRange(line, ruleName, true);
		}
	}

	/**
	 * @param {PostcssNode} node
	 * @param {Source} source
	 * @param {string} text
	 */
	function processDisableCommand(node, source, text) {
		const description = getDescription(text);

		for (const ruleToDisable of getCommandRules(DISABLE_COMMAND, text)) {
			const isAllRules = ruleToDisable === RULE_NAME_ALL;

			if (ruleIsDisabled(ruleToDisable)) {
				throw node.error(
					isAllRules
						? 'All rules have already been disabled'
						: `"${ruleToDisable}" has already been disabled`,
					{
						plugin: 'stylelint',
					},
				);
			}

			if (source.start) {
				const line = source.start.line;

				if (isAllRules) {
					for (const ruleName of Object.keys(disabledRanges)) {
						startDisabledRange(node, line, ruleName, ruleName === RULE_NAME_ALL, description);
					}
				} else {
					startDisabledRange(node, line, ruleToDisable, true, description);
				}
			}
		}
	}

	/**
	 * @param {PostcssNode} node
	 * @param {Source} source
	 * @param {string} text
	 */
	function processEnableCommand(node, source, text) {
		for (const ruleToEnable of getCommandRules(ENABLE_COMMAND, text)) {
			// need fallback if endLine will be undefined
			const endLine = source.end?.line;

			assertNumber(endLine);

			if (ruleToEnable === RULE_NAME_ALL) {
				if (
					Object.values(disabledRanges).every((ranges) => {
						if (ranges.length === 0) return true;

						const lastRange = ranges[ranges.length - 1];

						return lastRange && typeof lastRange.end === 'number';
					})
				) {
					throw node.error('No rules have been disabled', {
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
					createDisableRange(node, start, false, description, end, false),
				);

				endDisabledRange(endLine, ruleToEnable, true);

				continue;
			}

			if (ruleIsDisabled(ruleToEnable)) {
				endDisabledRange(endLine, ruleToEnable, true);

				continue;
			}

			throw node.error(`"${ruleToEnable}" has not been disabled`, {
				plugin: 'stylelint',
			});
		}
	}

	/**
	 * @param {PostcssNode} node
	 * @param {string | undefined} part
	 * @param {number} offset
	 */
	function checkCommentsInNode(node, part, offset) {
		if (!(part && part.includes('/*') && part.includes('*/'))) return;

		tokenize({ css: part }).forEach((token) => {
			if (!isTokenComment(token)) return;

			const [, text, start, end] = token;

			const source = node.rangeBy({
				index: start + offset,
				endIndex: end + 1 + offset,
			});

			checkComment(node, source, text.slice(2, -2).trim());
		});
	}

	/**
	 * @param {PostcssNode} node
	 * @param {Source | undefined} source
	 * @param {string} text
	 */
	function checkComment(node, source, text) {
		if (!source) return;

		// Ignore comments that are not relevant commands
		if (!isConfigurationComment(text, configurationComment)) {
			return;
		}

		switch (extractConfigurationComment(text, configurationComment)) {
			case DISABLE_LINE_COMMAND:
				processDisableLineCommand(node, source, text);
				break;
			case DISABLE_NEXT_LINE_COMMAND:
				processDisableNextLineCommand(node, source, text);
				break;
			case DISABLE_COMMAND:
				processDisableCommand(node, source, text);
				break;
			case ENABLE_COMMAND:
				processEnableCommand(node, source, text);
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
	 * @param {PostcssNode} node
	 * @param {number} line
	 * @param {string} ruleName
	 * @param {boolean} strict
	 * @param {string|undefined} description
	 */
	function startDisabledRange(node, line, ruleName, strict, description) {
		const rangeObj = createDisableRange(node, line, strict, description);

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
			disabledRanges[ruleName] = disabledRangesAll.map(({ node, start, end, description }) =>
				createDisableRange(node, start, false, description, end, false),
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
