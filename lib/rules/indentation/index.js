'use strict';

const beforeBlockString = require('../../utils/beforeBlockString');
const hasBlock = require('../../utils/hasBlock');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
const validateOptions = require('../../utils/validateOptions');
const { isAtRule, isDeclaration, isRoot, isRule } = require('../../utils/typeGuards');
const { isBoolean, isNumber, isString, assertString } = require('../../utils/validateTypes');

const ruleName = 'indentation';
const messages = ruleMessages(ruleName, {
	expected: (x) => `Expected indentation of ${x}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/indentation',
	fixable: true,
	deprecated: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions = {}, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isNumber, 'tab'],
			},
			{
				actual: secondaryOptions,
				possible: {
					baseIndentLevel: [isNumber, 'auto'],
					except: ['block', 'value', 'param'],
					ignore: ['value', 'param', 'inside-parens'],
					indentInsideParens: ['twice', 'once-at-root-twice-in-block'],
					indentClosingBrace: [isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const spaceCount = isNumber(primary) ? primary : null;
		const indentChar = spaceCount == null ? '\t' : ' '.repeat(spaceCount);
		const warningWord = primary === 'tab' ? 'tab' : 'space';

		/** @type {number | 'auto'} */
		const baseIndentLevel = secondaryOptions.baseIndentLevel;
		/** @type {boolean} */
		const indentClosingBrace = secondaryOptions.indentClosingBrace;

		/**
		 * @param {number} level
		 */
		const legibleExpectation = (level) => {
			const count = spaceCount == null ? level : level * spaceCount;
			const quantifiedWarningWord = count === 1 ? warningWord : `${warningWord}s`;

			return `${count} ${quantifiedWarningWord}`;
		};

		// Cycle through all nodes using walk.
		root.walk((node) => {
			if (isRoot(node)) {
				// Ignore nested template literals root in css-in-js lang
				return;
			}

			const nodeLevel = indentationLevel(node);

			// Cut out any * and _ hacks from `before`
			const before = (node.raws.before || '').replace(/[*_]$/, '');
			const after = typeof node.raws.after === 'string' ? node.raws.after : '';
			const parent = node.parent;

			if (!parent) throw new Error('A parent node must be present');

			const expectedOpeningBraceIndentation = indentChar.repeat(nodeLevel);

			// Only inspect the spaces before the node
			// if this is the first node in root
			// or there is a newline in the `before` string.
			// (If there is no newline before a node,
			// there is no "indentation" to check.)
			const isFirstChild = parent.type === 'root' && parent.first === node;
			const lastIndexOfNewline = before.lastIndexOf('\n');

			// Inspect whitespace in the `before` string that is
			// *after* the *last* newline character,
			// because anything besides that is not indentation for this node:
			// it is some other kind of separation, checked by some separate rule
			if (
				(lastIndexOfNewline !== -1 ||
					(isFirstChild &&
						(!getDocument(parent) ||
							(parent.raws.codeBefore && parent.raws.codeBefore.endsWith('\n'))))) &&
				before.slice(lastIndexOfNewline + 1) !== expectedOpeningBraceIndentation
			) {
				if (context.fix) {
					if (isFirstChild && isString(node.raws.before)) {
						node.raws.before = node.raws.before.replace(
							/^[ \t]*(?=\S|$)/,
							expectedOpeningBraceIndentation,
						);
					}

					node.raws.before = fixIndentation(node.raws.before, expectedOpeningBraceIndentation);
				} else {
					report({
						message: messages.expected(legibleExpectation(nodeLevel)),
						node,
						result,
						ruleName,
					});
				}
			}

			// Only blocks have the `after` string to check.
			// Only inspect `after` strings that start with a newline;
			// otherwise there's no indentation involved.
			// And check `indentClosingBrace` to see if it should be indented an extra level.
			const closingBraceLevel = indentClosingBrace ? nodeLevel + 1 : nodeLevel;
			const expectedClosingBraceIndentation = indentChar.repeat(closingBraceLevel);

			if (
				(isRule(node) || isAtRule(node)) &&
				hasBlock(node) &&
				after &&
				after.includes('\n') &&
				after.slice(after.lastIndexOf('\n') + 1) !== expectedClosingBraceIndentation
			) {
				if (context.fix) {
					node.raws.after = fixIndentation(node.raws.after, expectedClosingBraceIndentation);
				} else {
					report({
						message: messages.expected(legibleExpectation(closingBraceLevel)),
						node,
						index: node.toString().length - 1,
						result,
						ruleName,
					});
				}
			}

			// If this is a declaration, check the value
			if (isDeclaration(node)) {
				checkValue(node, nodeLevel);
			}

			// If this is a rule, check the selector
			if (isRule(node)) {
				checkSelector(node, nodeLevel);
			}

			// If this is an at rule, check the params
			if (isAtRule(node)) {
				checkAtRuleParams(node, nodeLevel);
			}
		});

		/**
		 * @param {import('postcss').Node} node
		 * @param {number} level
		 * @returns {number}
		 */
		function indentationLevel(node, level = 0) {
			if (!node.parent) throw new Error('A parent node must be present');

			if (isRoot(node.parent)) {
				return level + getRootBaseIndentLevel(node.parent, baseIndentLevel, primary);
			}

			let calculatedLevel;

			// Indentation level equals the ancestor nodes
			// separating this node from root; so recursively
			// run this operation
			calculatedLevel = indentationLevel(node.parent, level + 1);

			// If `secondaryOptions.except` includes "block",
			// blocks are taken down one from their calculated level
			// (all blocks are the same level as their parents)
			if (
				optionsMatches(secondaryOptions, 'except', 'block') &&
				(isRule(node) || isAtRule(node)) &&
				hasBlock(node)
			) {
				calculatedLevel--;
			}

			return calculatedLevel;
		}

		/**
		 * @param {import('postcss').Declaration} decl
		 * @param {number} declLevel
		 */
		function checkValue(decl, declLevel) {
			if (!decl.value.includes('\n')) {
				return;
			}

			if (optionsMatches(secondaryOptions, 'ignore', 'value')) {
				return;
			}

			const declString = decl.toString();
			const valueLevel = optionsMatches(secondaryOptions, 'except', 'value')
				? declLevel
				: declLevel + 1;

			checkMultilineBit(declString, valueLevel, decl);
		}

		/**
		 * @param {import('postcss').Rule} ruleNode
		 * @param {number} ruleLevel
		 */
		function checkSelector(ruleNode, ruleLevel) {
			const selector = ruleNode.selector;

			// Less mixins have params, and they should be indented extra
			// @ts-expect-error -- TS2339: Property 'params' does not exist on type 'Rule'.
			if (ruleNode.params) {
				ruleLevel += 1;
			}

			checkMultilineBit(selector, ruleLevel, ruleNode);
		}

		/**
		 * @param {import('postcss').AtRule} atRule
		 * @param {number} ruleLevel
		 */
		function checkAtRuleParams(atRule, ruleLevel) {
			if (optionsMatches(secondaryOptions, 'ignore', 'param')) {
				return;
			}

			// @nest and SCSS's @at-root rules should be treated like regular rules, not expected
			// to have their params (selectors) indented
			const paramLevel =
				optionsMatches(secondaryOptions, 'except', 'param') ||
				atRule.name === 'nest' ||
				atRule.name === 'at-root'
					? ruleLevel
					: ruleLevel + 1;

			checkMultilineBit(beforeBlockString(atRule).trim(), paramLevel, atRule);
		}

		/**
		 * @param {string} source
		 * @param {number} newlineIndentLevel
		 * @param {import('postcss').Node} node
		 */
		function checkMultilineBit(source, newlineIndentLevel, node) {
			if (!source.includes('\n')) {
				return;
			}

			// Data for current node fixing
			/** @type {Array<{ expectedIndentation: string, currentIndentation: string, startIndex: number }>} */
			const fixPositions = [];

			// `outsideParens` because function arguments and also non-standard parenthesized stuff like
			// Sass maps are ignored to allow for arbitrary indentation
			let parentheticalDepth = 0;

			const ignoreInsideParans = optionsMatches(secondaryOptions, 'ignore', 'inside-parens');

			styleSearch(
				{
					source,
					target: '\n',
					// @ts-expect-error -- The `outsideParens` option is unsupported. Why?
					outsideParens: ignoreInsideParans,
				},
				(match, matchCount) => {
					const precedesClosingParenthesis = /^[ \t]*\)/.test(source.slice(match.startIndex + 1));

					if (ignoreInsideParans && (precedesClosingParenthesis || match.insideParens)) {
						return;
					}

					let expectedIndentLevel = newlineIndentLevel;

					// Modififications for parenthetical content
					if (!ignoreInsideParans && match.insideParens) {
						// If the first match in is within parentheses, reduce the parenthesis penalty
						if (matchCount === 1) parentheticalDepth -= 1;

						// Account for windows line endings
						let newlineIndex = match.startIndex;

						if (source[match.startIndex - 1] === '\r') {
							newlineIndex--;
						}

						const followsOpeningParenthesis = /\([ \t]*$/.test(source.slice(0, newlineIndex));

						if (followsOpeningParenthesis) {
							parentheticalDepth += 1;
						}

						const followsOpeningBrace = /\{[ \t]*$/.test(source.slice(0, newlineIndex));

						if (followsOpeningBrace) {
							parentheticalDepth += 1;
						}

						const startingClosingBrace = /^[ \t]*\}/.test(source.slice(match.startIndex + 1));

						if (startingClosingBrace) {
							parentheticalDepth -= 1;
						}

						expectedIndentLevel += parentheticalDepth;

						// Past this point, adjustments to parentheticalDepth affect next line

						if (precedesClosingParenthesis) {
							parentheticalDepth -= 1;
						}

						switch (secondaryOptions.indentInsideParens) {
							case 'twice':
								if (!precedesClosingParenthesis || indentClosingBrace) {
									expectedIndentLevel += 1;
								}

								break;
							case 'once-at-root-twice-in-block':
								if (node.parent === node.root()) {
									if (precedesClosingParenthesis && !indentClosingBrace) {
										expectedIndentLevel -= 1;
									}

									break;
								}

								if (!precedesClosingParenthesis || indentClosingBrace) {
									expectedIndentLevel += 1;
								}

								break;
							default:
								if (precedesClosingParenthesis && !indentClosingBrace) {
									expectedIndentLevel -= 1;
								}
						}
					}

					// Starting at the index after the newline, we want to
					// check that the whitespace characters (excluding newlines) before the first
					// non-whitespace character equal the expected indentation
					const afterNewlineSpaceMatches = /^([ \t]*)\S/.exec(source.slice(match.startIndex + 1));

					if (!afterNewlineSpaceMatches) {
						return;
					}

					const afterNewlineSpace = afterNewlineSpaceMatches[1] || '';
					const expectedIndentation = indentChar.repeat(
						expectedIndentLevel > 0 ? expectedIndentLevel : 0,
					);

					if (afterNewlineSpace !== expectedIndentation) {
						if (context.fix) {
							// Adding fixes position in reverse order, because if we change indent in the beginning of the string it will break all following fixes for that string
							fixPositions.unshift({
								expectedIndentation,
								currentIndentation: afterNewlineSpace,
								startIndex: match.startIndex,
							});
						} else {
							report({
								message: messages.expected(legibleExpectation(expectedIndentLevel)),
								node,
								index: match.startIndex + afterNewlineSpace.length + 1,
								result,
								ruleName,
							});
						}
					}
				},
			);

			if (fixPositions.length) {
				if (isRule(node)) {
					for (const fixPosition of fixPositions) {
						node.selector = replaceIndentation(
							node.selector,
							fixPosition.currentIndentation,
							fixPosition.expectedIndentation,
							fixPosition.startIndex,
						);
					}
				}

				if (isDeclaration(node)) {
					const declProp = node.prop;
					const declBetween = node.raws.between;

					if (!isString(declBetween)) {
						throw new TypeError('The `between` property must be a string');
					}

					for (const fixPosition of fixPositions) {
						if (fixPosition.startIndex < declProp.length + declBetween.length) {
							node.raws.between = replaceIndentation(
								declBetween,
								fixPosition.currentIndentation,
								fixPosition.expectedIndentation,
								fixPosition.startIndex - declProp.length,
							);
						} else {
							node.value = replaceIndentation(
								node.value,
								fixPosition.currentIndentation,
								fixPosition.expectedIndentation,
								fixPosition.startIndex - declProp.length - declBetween.length,
							);
						}
					}
				}

				if (isAtRule(node)) {
					const atRuleName = node.name;
					const atRuleAfterName = node.raws.afterName;
					const atRuleParams = node.params;

					if (!isString(atRuleAfterName)) {
						throw new TypeError('The `afterName` property must be a string');
					}

					for (const fixPosition of fixPositions) {
						// 1 — it's a @ length
						if (fixPosition.startIndex < 1 + atRuleName.length + atRuleAfterName.length) {
							node.raws.afterName = replaceIndentation(
								atRuleAfterName,
								fixPosition.currentIndentation,
								fixPosition.expectedIndentation,
								fixPosition.startIndex - atRuleName.length - 1,
							);
						} else {
							node.params = replaceIndentation(
								atRuleParams,
								fixPosition.currentIndentation,
								fixPosition.expectedIndentation,
								fixPosition.startIndex - atRuleName.length - atRuleAfterName.length - 1,
							);
						}
					}
				}
			}
		}
	};
};

/**
 * @param {import('postcss').Root} root
 * @param {number | 'auto'} baseIndentLevel
 * @param {string} space
 * @returns {number}
 */
function getRootBaseIndentLevel(root, baseIndentLevel, space) {
	const document = getDocument(root);

	if (!document) {
		return 0;
	}

	if (!root.source) {
		throw new Error('The root node must have a source');
	}

	/** @type {import('postcss').Source & { baseIndentLevel?: number }} */
	const source = root.source;

	const indentLevel = source.baseIndentLevel;

	if (isNumber(indentLevel) && Number.isSafeInteger(indentLevel)) {
		return indentLevel;
	}

	const newIndentLevel = inferRootIndentLevel(root, baseIndentLevel, () =>
		inferDocIndentSize(document, space),
	);

	source.baseIndentLevel = newIndentLevel;

	return newIndentLevel;
}

/**
 * @param {import('postcss').Node} node
 */
function getDocument(node) {
	// @ts-expect-error -- TS2339: Property 'document' does not exist on type 'Node'.
	const document = node.document;

	if (document) {
		return document;
	}

	const root = node.root();

	// @ts-expect-error -- TS2339: Property 'document' does not exist on type 'Node'.
	return root && root.document;
}

/**
 * @param {import('postcss').Document} document
 * @param {string} space
 * returns {number}
 */
function inferDocIndentSize(document, space) {
	if (!document.source) throw new Error('The document node must have a source');

	/** @type {import('postcss').Source & { indentSize?: number }} */
	const docSource = document.source;

	let indentSize = docSource.indentSize;

	if (isNumber(indentSize) && Number.isSafeInteger(indentSize)) {
		return indentSize;
	}

	const source = document.source.input.css;
	const indents = source.match(/^ *(?=\S)/gm);

	if (indents) {
		/** @type {Map<number, number>} */
		const scores = new Map();
		let lastIndentSize = 0;
		let lastLeadingSpacesLength = 0;

		/**
		 * @param {number} leadingSpacesLength
		 */
		const vote = (leadingSpacesLength) => {
			if (leadingSpacesLength) {
				lastIndentSize = Math.abs(leadingSpacesLength - lastLeadingSpacesLength) || lastIndentSize;

				if (lastIndentSize > 1) {
					const score = scores.get(lastIndentSize);

					if (score) {
						scores.set(lastIndentSize, score + 1);
					} else {
						scores.set(lastIndentSize, 1);
					}
				}
			} else {
				lastIndentSize = 0;
			}

			lastLeadingSpacesLength = leadingSpacesLength;
		};

		for (const leadingSpaces of indents) {
			vote(leadingSpaces.length);
		}

		let bestScore = 0;

		for (const [indentSizeDate, score] of scores.entries()) {
			if (score > bestScore) {
				bestScore = score;
				indentSize = indentSizeDate;
			}
		}
	}

	indentSize =
		Number(indentSize) || (indents && indents[0] && indents[0].length) || Number(space) || 2;
	docSource.indentSize = indentSize;

	return indentSize;
}

/**
 * @param {import('postcss').Root} root
 * @param {number | 'auto'} baseIndentLevel
 * @param {() => number} indentSize
 * @returns {number}
 */
function inferRootIndentLevel(root, baseIndentLevel, indentSize) {
	/**
	 * @param {string} indent
	 */
	function getIndentLevel(indent) {
		const tabMatch = indent.match(/\t/g);
		const tabCount = tabMatch ? tabMatch.length : 0;

		const spaceMatch = indent.match(/ /g);
		const spaceCount = spaceMatch ? Math.round(spaceMatch.length / indentSize()) : 0;

		return tabCount + spaceCount;
	}

	let newBaseIndentLevel = 0;

	if (!isNumber(baseIndentLevel) || !Number.isSafeInteger(baseIndentLevel)) {
		if (!root.source) throw new Error('The root node must have a source');

		let source = root.source.input.css;

		source = source.replace(/^[^\r\n]+/, (firstLine) => {
			const match = root.raws.codeBefore && /(?:^|\n)([ \t]*)$/.exec(root.raws.codeBefore);

			if (match) {
				return match[1] + firstLine;
			}

			return '';
		});

		const indents = source.match(/^[ \t]*(?=\S)/gm);

		if (indents) {
			return Math.min(...indents.map((indent) => getIndentLevel(indent)));
		}

		newBaseIndentLevel = 1;
	} else {
		newBaseIndentLevel = baseIndentLevel;
	}

	const indents = [];
	const foundIndents = root.raws.codeBefore && /(?:^|\n)([ \t]*)\S/m.exec(root.raws.codeBefore);

	// The indent level of the CSS code block in non-CSS-like files is determined by the shortest indent of non-empty line.
	if (foundIndents) {
		let shortest = Number.MAX_SAFE_INTEGER;
		let i = 0;

		while (++i < foundIndents.length) {
			const foundIndent = foundIndents[i];

			assertString(foundIndent);
			const current = getIndentLevel(foundIndent);

			if (current < shortest) {
				shortest = current;

				if (shortest === 0) {
					break;
				}
			}
		}

		if (shortest !== Number.MAX_SAFE_INTEGER) {
			indents.push(new Array(shortest).fill(' ').join(''));
		}
	}

	const after = root.raws.after;

	if (after) {
		let afterEnd;

		if (after.endsWith('\n')) {
			// @ts-expect-error -- TS2339: Property 'document' does not exist on type 'Root'.
			const document = root.document;

			if (document) {
				const nextRoot = document.nodes[document.nodes.indexOf(root) + 1];

				afterEnd = nextRoot ? nextRoot.raws.codeBefore : document.raws.codeAfter;
			} else {
				// Nested root node in css-in-js lang
				const parent = root.parent;

				if (!parent) throw new Error('The root node must have a parent');

				const nextRoot = parent.nodes[parent.nodes.indexOf(root) + 1];

				afterEnd = nextRoot ? nextRoot.raws.codeBefore : root.raws.codeAfter;
			}
		} else {
			afterEnd = after;
		}

		if (afterEnd) indents.push(afterEnd.match(/^[ \t]*/)[0]);
	}

	if (indents.length) {
		return Math.max(...indents.map((indent) => getIndentLevel(indent))) + newBaseIndentLevel;
	}

	return newBaseIndentLevel;
}

/**
 * @param {string | undefined} str
 * @param {string} whitespace
 */
function fixIndentation(str, whitespace) {
	if (!isString(str)) {
		return str;
	}

	return str.replace(/\n[ \t]*(?=\S|$)/g, `\n${whitespace}`);
}

/**
 * @param {string} input
 * @param {string} searchString
 * @param {string} replaceString
 * @param {number} startIndex
 */
function replaceIndentation(input, searchString, replaceString, startIndex) {
	const offset = startIndex + 1;
	const stringStart = input.slice(0, offset);
	const stringEnd = input.slice(offset + searchString.length);

	return stringStart + replaceString + stringEnd;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
