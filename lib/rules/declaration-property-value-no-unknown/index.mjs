import { find, fork, parse, string } from 'css-tree';
import { isPlainObject } from 'is-plain-object';

import { isAtRule, isDeclaration } from '../../utils/typeGuards.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import { nestingSupportedAtKeywords } from '../../reference/atKeywords.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-property-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected unknown value "${value}" for property "${property}"`,
	rejectedParseError: (property, value) =>
		`Cannot parse property value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
};

const SYNTAX_PROPERTY = /^syntax$/i;

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

		const ignoreProperties = Array.from(Object.entries(secondaryOptions?.ignoreProperties ?? {}));

		/** @type {(name: string, propValue: string) => boolean} */
		const isPropIgnored = (name, value) => {
			const [, valuePattern] =
				ignoreProperties.find(([namePattern]) => matchesStringOrRegExp(name, namePattern)) || [];

			return valuePattern && matchesStringOrRegExp(value, valuePattern);
		};

		const propertiesSyntax = {
			// Take a shallow clone as this object will be appended to.
			...(secondaryOptions?.propertiesSyntax ?? {}),
		};
		const typesSyntax = secondaryOptions?.typesSyntax ?? {};

		/** @type {Map<string, string>} */
		const typedCustomPropertyNames = new Map();

		root.walkAtRules(/^property$/i, (atRule) => {
			const propName = atRule.params.trim();

			if (!propName || !atRule.nodes || !isCustomProperty(propName)) return;

			for (const node of atRule.nodes) {
				if (isDeclaration(node) && SYNTAX_PROPERTY.test(node.prop)) {
					const value = node.value.trim();
					const unquoted = string.decode(value);

					// Only string values are valid.
					// We can not check the syntax of this property.
					if (unquoted === value) continue;

					// Any value is allowed in this custom property.
					// We don't need to check this property.
					if (unquoted === '*') continue;

					// https://github.com/csstree/csstree/pull/256
					// We can circumvent this issue by prefixing the property name,
					// making it a vendor-prefixed property instead of a custom property.
					// No one should be using `-stylelint--` as a property prefix.
					//
					// When this is resolved `typedCustomPropertyNames` can become a `Set<string>`
					// and the prefix can be removed.
					const prefixedPropName = `-stylelint${propName}`;

					typedCustomPropertyNames.set(propName, prefixedPropName);
					propertiesSyntax[prefixedPropName] = unquoted;
				}
			}
		});

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

			if (isCustomProperty(prop) && !typedCustomPropertyNames.has(prop)) return;

			if (isPropIgnored(prop, value)) return;

			// https://github.com/mdn/data/pull/674
			// `initial-value` has an incorrect syntax definition.
			// In reality everything is valid.
			if (
				/^initial-value$/i.test(prop) &&
				decl.parent &&
				isAtRule(decl.parent) &&
				/^property$/i.test(decl.parent.name)
			) {
				return;
			}

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
					: forkedLexer.matchProperty(typedCustomPropertyNames.get(prop) ?? prop, cssTreeValueNode);

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
 *
 * @see csstree/csstree#164 min, max, clamp
 * @see csstree/csstree#245 env
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
export default rule;
