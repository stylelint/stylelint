// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssTree = require('css-tree');
const validateTypes = require('../../utils/validateTypes.cjs');
const properties = require('../../reference/properties.cjs');
const eachDeclarationBlock = require('../../utils/eachDeclarationBlock.cjs');
const isCustomProperty = require('../../utils/isCustomProperty.cjs');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty.cjs');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue.cjs');
const keywords = require('../../reference/keywords.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'declaration-block-no-duplicate-properties';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected duplicate "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-properties',
	fixable: true,
};

/** @typedef {import('css-tree').CssNode} CssNode */
/** @typedef {import('postcss').Declaration} Declaration */

/** @type {(node: CssNode) => node is CssNode & { children: import('css-tree').List<CssNode> }} */
const hasChildren = (node) => 'children' in node && node.children instanceof cssTree.List;

/** @type {(node1: CssNode[], node2: CssNode[], property: string) => boolean} */
const isEqualValueNodes = (nodes1, nodes2, property) => {
	// Different lengths indicate different syntaxes.
	if (nodes1.length !== nodes2.length) {
		return false;
	}

	for (let i = 0; i < nodes1.length; i++) {
		const node1 = nodes1[i];
		const node2 = nodes2[i];

		// Different types indicate different syntaxes.
		if (typeof node1 === 'undefined' || typeof node2 === 'undefined' || node1.type !== node2.type) {
			return false;
		}

		const node1Name = 'name' in node1 ? String(node1.name) : '';
		const node2Name = 'name' in node2 ? String(node2.name) : '';

		// Custom properties have unknown value syntaxes but are equal for CSS parsers.
		if (
			node1.type === 'Identifier' &&
			isCustomProperty(node1Name) &&
			node2.type === 'Identifier' &&
			isCustomProperty(node2Name)
		) {
			continue;
		}

		// Named colors have the same syntax even if the names differ
		// This applies only to color properties (both single and multi-value)
		if (
			node1.type === 'Identifier' &&
			node2.type === 'Identifier' &&
			properties.colorProperties.has(property.toLowerCase()) &&
			keywords.namedColorsKeywords.has(node1Name.toLowerCase()) &&
			keywords.namedColorsKeywords.has(node2Name.toLowerCase())
		) {
			continue;
		}

		// Different ident or function names indicate different syntaxes.
		if (node1Name.toLowerCase() !== node2Name.toLowerCase()) {
			return false;
		}

		const node1Unit = 'unit' in node1 ? node1.unit : '';
		const node2Unit = 'unit' in node2 ? node2.unit : '';

		// Different units indicate different syntaxes.
		if (node1Unit !== node2Unit) {
			return false;
		}

		const node1Children = hasChildren(node1) ? node1.children.toArray() : null;
		const node2Children = hasChildren(node2) ? node2.children.toArray() : null;

		if (Array.isArray(node1Children) && Array.isArray(node2Children)) {
			if (isEqualValueNodes(node1Children, node2Children, property)) {
				continue;
			} else {
				return false;
			}
		}
	}

	return true;
};

/** @type {(value1: string, value2: string, property: string) => boolean} */
const isEqualValueSyntaxes = (value1, value2, property) => {
	if (value1 === value2) {
		return true;
	}

	if (!(isStandardSyntaxValue(value1) && isStandardSyntaxValue(value2))) {
		return false;
	}

	let value1Node;
	let value2Node;

	try {
		value1Node = cssTree.parse(value1, { context: 'value' });
		value2Node = cssTree.parse(value2, { context: 'value' });
	} catch {
		return false;
	}

	const node1Children = hasChildren(value1Node) ? value1Node.children.toArray() : [];
	const node2Children = hasChildren(value2Node) ? value2Node.children.toArray() : [];

	return isEqualValueNodes(node1Children, node2Children, property);
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
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
					ignoreProperties: [validateTypes.isString, validateTypes.isRegExp],
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

		/** @param {Declaration} node */
		const fixer = (node) => () => {
			node.remove();
		};

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Declaration[]} */
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
					const node = duplicateIsMoreImportant ? decl : duplicateDecl;
					const word = duplicateIsMoreImportant ? prop : duplicateDecl.prop;

					if (!duplicateIsMoreImportant) {
						// replace previous "active" decl with current one
						decls[indexDuplicate] = decl;
					}

					report({
						message: messages.rejected,
						messageArgs: [word],
						node,
						result,
						ruleName,
						word,
						fix: {
							apply: fixer(node),
							node: node.parent,
						},
					});
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
						const duplicateValueSyntaxesAreEqual = isEqualValueSyntaxes(
							value,
							duplicateValue,
							prop,
						);

						if (duplicateValueSyntaxesAreEqual) {
							fixOrReport();

							return;
						}
					}

					if (value !== duplicateValue) {
						return;
					}

					return report({
						message: messages.rejected,
						messageArgs: [duplicateDecl.prop],
						node: duplicateDecl,
						result,
						ruleName,
						word: duplicateDecl.prop,
						fix: {
							apply: fixer(duplicateDecl),
							node: duplicateDecl.parent,
						},
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
