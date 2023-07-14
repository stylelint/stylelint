'use strict';

const { isPlainObject } = require('is-plain-object');
const { fork, parse, find } = require('css-tree');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const { isAtRule } = require('../../utils/typeGuards');
const { isRegExp, isString } = require('../../utils/validateTypes');
const { nestingSupportedAtKeywords } = require('../../reference/atKeywords');

const ruleName = 'declaration-property-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected unknown value "${value}" for property "${property}"`,
	rejectedParseError: (property, value) =>
		`Cannot parse property value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
					propertiesSyntax: [isPlainObject],
					typesSyntax: [isPlainObject],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreProperties = Array.from(
			Object.entries((secondaryOptions && secondaryOptions.ignoreProperties) || {}),
		);

		/** @type {(name: string, propValue: string) => boolean} */
		const isPropIgnored = (name, value) => {
			const [, valuePattern] =
				ignoreProperties.find(([namePattern]) => matchesStringOrRegExp(name, namePattern)) || [];

			return valuePattern && matchesStringOrRegExp(value, valuePattern);
		};

		const propertiesSyntax = (secondaryOptions && secondaryOptions.propertiesSyntax) || {};
		const typesSyntax = (secondaryOptions && secondaryOptions.typesSyntax) || {};

		const forkedLexer = fork({
			properties: propertiesSyntax,
			types: typesSyntax,
		}).lexer;

		root.walkDecls((decl) => {
			const { prop, value, parent } = decl;

			// NOTE: CSSTree's `fork()` doesn't support `-moz-initial`, but it may be possible in the future.
			// See https://github.com/stylelint/stylelint/pull/6511#issuecomment-1412921062
			if (/^-moz-initial$/i.test(value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (!isStandardSyntaxProperty(prop)) return;

			if (!isStandardSyntaxValue(value)) return;

			if (isCustomProperty(prop)) return;

			if (isPropIgnored(prop, value)) return;

			/** @type {import('css-tree').CssNode} */
			let cssTreeValueNode;

			try {
				cssTreeValueNode = parse(value, { context: 'value' });

				if (containsUnsupportedFunction(cssTreeValueNode)) return;
			} catch (e) {
				const index = declarationValueIndex(decl);
				const endIndex = index + value.length;

				report({
					message: messages.rejectedParseError(prop, value),
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});

				return;
			}

			const { error } =
				parent && isAtRule(parent) && !nestingSupportedAtKeywords.has(parent.name.toLowerCase())
					? forkedLexer.matchAtruleDescriptor(parent.name, prop, cssTreeValueNode)
					: forkedLexer.matchProperty(prop, cssTreeValueNode);

			if (!error) return;

			if (!('mismatchLength' in error)) return;

			const { mismatchLength, mismatchOffset, name, rawMessage } = error;

			if (name !== 'SyntaxMatchError') return;

			if (rawMessage !== 'Mismatch') return;

			const mismatchValue = value.slice(mismatchOffset, mismatchOffset + mismatchLength);
			const index = declarationValueIndex(decl) + mismatchOffset;
			const endIndex = index + mismatchLength;

			report({
				message: messages.rejected(prop, mismatchValue),
				node: decl,
				index,
				endIndex,
				result,
				ruleName,
			});
		});
	};
};

/**
 * TODO: This function avoids false positives because CSSTree doesn't fully support
 * some math functions like `clamp()` via `fork()`. In the future, it may be unnecessary.
 *
 * @see https://github.com/stylelint/stylelint/pull/6511#issuecomment-1412921062
 * @see https://github.com/stylelint/stylelint/issues/6635#issuecomment-1425787649
 *
 * @param {import('css-tree').CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsUnsupportedFunction(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) => node.type === 'Function' && ['clamp', 'min', 'max', 'env'].includes(node.name),
		),
	);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
