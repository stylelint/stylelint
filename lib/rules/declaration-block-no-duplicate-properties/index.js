'use strict';

const { parse, List } = require('css-tree');
const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
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

/** @typedef {import('css-tree').CssNode} CssNode */

/** @type {(node: CssNode) => node is CssNode & { children: List<CssNode> }} */
const hasChildren = (node) => 'children' in node && node.children instanceof List;

/** @type {(node1: CssNode[], node2: CssNode[]) => boolean} */
const isEqualValueNodes = (nodes1, nodes2) => {
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
			if (isEqualValueNodes(node1Children, node2Children)) {
				continue;
			} else {
				return false;
			}
		}
	}

	return true;
};

/** @type {(value1: string, value2: string) => boolean} */
const isEqualValueSyntaxes = (value1, value2) => {
	if (value1 === value2) {
		return true;
	}

	if (!(isStandardSyntaxValue(value1) && isStandardSyntaxValue(value2))) {
		return false;
	}

	let value1Node;
	let value2Node;

	try {
		value1Node = parse(value1, { context: 'value' });
		value2Node = parse(value2, { context: 'value' });
	} catch (error) {
		return false;
	}

	const node1Children = hasChildren(value1Node) ? value1Node.children.toArray() : [];
	const node2Children = hasChildren(value2Node) ? value2Node.children.toArray() : [];

	return isEqualValueNodes(node1Children, node2Children);
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

					// replace previous "active" decl with current one
					decls[indexDuplicate] = decl;

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
