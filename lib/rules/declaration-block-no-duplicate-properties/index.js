'use strict';

const { parse } = require('css-tree');
const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');
const vendor = require('../../utils/vendor');

const ruleName = 'declaration-block-no-duplicate-properties';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected duplicate "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-properties',
	fixable: true,
};

/** @type {(node: import('css-tree').CssNode) => node is import('css-tree').Value} */
const isValueNode = (node) => {
	return node.type === 'Value';
};

/** @type {(node1: import('css-tree').CssNode, node2: import('css-tree').CssNode) => boolean} */
const isEqualValueChildNode = (node1, node2) => {
	if (node1.type !== node2.type) {
		return false;
	}

	const node1Unit = 'unit' in node1 ? node1.unit : '';
	const node2Unit = 'unit' in node2 ? node2.unit : '';

	return node1Unit === node2Unit;
};

/** @type {(value1: string, value2: string) => boolean} */
const isEqualValueSyntaxes = (value1, value2) => {
	if (value1 === value2) {
		return true;
	}

	/** @type {import('css-tree').CssNode} */
	const value1Node = parse(value1, { context: 'value' });
	const value2Node = parse(value2, { context: 'value' });

	if (
		!isValueNode(value1Node) ||
		!isValueNode(value2Node) ||
		value1Node.children.size !== value2Node.children.size
	) {
		return false;
	}

	const value1Nodes = value1Node.children.toArray();
	const value2Nodes = value2Node.children.toArray();

	for (let i = 0; i < value1Nodes.length; i++) {
		const node1 = value1Nodes[i];
		const node2 = value2Nodes[i];

		if (
			typeof node1 === 'undefined' ||
			typeof node2 === 'undefined' ||
			!isEqualValueChildNode(node1, node2)
		) {
			return false;
		}
	}

	return true;
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignore: [
						'consecutive-duplicates',
						'consecutive-duplicates-with-different-values',
						'consecutive-duplicates-with-different-syntaxes',
						'consecutive-duplicates-with-same-prefixless-values',
					],
					ignoreProperties: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreDuplicates = optionsMatches(secondaryOptions, 'ignore', 'consecutive-duplicates');
		const ignoreDiffValues = optionsMatches(
			secondaryOptions,
			'ignore',
			'consecutive-duplicates-with-different-values',
		);
		const ignoreDiffSyntaxes = optionsMatches(
			secondaryOptions,
			'ignore',
			'consecutive-duplicates-with-different-syntaxes',
		);
		const ignorePrefixlessSameValues = optionsMatches(
			secondaryOptions,
			'ignore',
			'consecutive-duplicates-with-same-prefixless-values',
		);

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {import('postcss').Declaration[]} */
			const decls = [];

			eachDecl((decl) => {
				const prop = decl.prop;
				const lowerProp = decl.prop.toLowerCase();
				const value = decl.value;
				const important = decl.important;

				if (!isStandardSyntaxProperty(prop)) {
					return;
				}

				if (isCustomProperty(prop)) {
					return;
				}

				// Return early if the property is to be ignored
				if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) {
					return;
				}

				// Ignore the src property as commonly duplicated in at-fontface
				if (lowerProp === 'src') {
					return;
				}

				const indexDuplicate = decls.findIndex((d) => d.prop.toLowerCase() === lowerProp);

				if (indexDuplicate === -1) {
					decls.push(decl);
				}

				const duplicateDecl = decls[indexDuplicate];

				if (!duplicateDecl) {
					return;
				}

				const duplicateValue = duplicateDecl.value || '';
				const duplicateImportant = duplicateDecl.important || false;
				const duplicateIsMoreImportant = !important && duplicateImportant;
				const duplicatesAreConsecutive = indexDuplicate === decls.length - 1;
				const unprefixedDuplicatesAreEqual =
					vendor.unprefixed(value) === vendor.unprefixed(duplicateValue);

				const fixOrReport = () => {
					if (!context.fix) {
						return report({
							message: messages.rejected,
							messageArgs: [prop],
							node: decl,
							result,
							ruleName,
							word: prop,
						});
					}

					if (duplicateIsMoreImportant) {
						return decl.remove();
					}

					return duplicateDecl.remove();
				};

				if (ignoreDiffValues || ignoreDiffSyntaxes || ignorePrefixlessSameValues) {
					if (
						!duplicatesAreConsecutive ||
						(ignorePrefixlessSameValues && !unprefixedDuplicatesAreEqual)
					) {
						fixOrReport();

						return;
					}

					if (ignoreDiffSyntaxes) {
						const duplicateValueSyntaxesAreEqual = isEqualValueSyntaxes(value, duplicateValue);

						if (duplicateValueSyntaxesAreEqual) {
							fixOrReport();

							return;
						}
					}

					if (value !== duplicateValue) {
						return;
					}

					if (context.fix) {
						return duplicateDecl.remove();
					}

					return report({
						message: messages.rejected,
						messageArgs: [prop],
						node: decl,
						result,
						ruleName,
						word: prop,
					});
				}

				if (ignoreDuplicates && duplicatesAreConsecutive) {
					return;
				}

				fixOrReport();
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
