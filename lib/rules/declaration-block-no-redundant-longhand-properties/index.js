'use strict';

const valueParser = require('postcss-value-parser');

const arrayEqual = require('../../utils/arrayEqual');
const { basicKeywords } = require('../../reference/keywords');
const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { longhandSubPropertiesOfShorthandProperties } = require('../../reference/properties');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'declaration-block-no-redundant-longhand-properties';

const messages = ruleMessages(ruleName, {
	expected: (props) => `Expected shorthand property "${props}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-redundant-longhand-properties',
	fixable: true,
};

/** @typedef {import('postcss').Declaration} Declaration */

/** @type {Map<string, (decls: Map<string, Declaration>) => (string | undefined)>} */
const customResolvers = new Map([
	[
		'grid-template',
		(decls) => {
			const areas = decls.get('grid-template-areas')?.value.trim();
			const columns = decls.get('grid-template-columns')?.value.trim();
			const rows = decls.get('grid-template-rows')?.value.trim();

			if (!(areas && columns && rows)) return;

			const splitAreas = [...areas.matchAll(/"[^"]+"/g)].map((x) => x[0]);
			const splitRows = rows.split(' ');

			if (splitAreas.length === 0 || splitRows.length === 0) return;

			if (splitAreas.length !== splitRows.length) return;

			const zipped = splitAreas.map((area, i) => `${area} ${splitRows[i]}`).join(' ');

			return `${zipped} / ${columns}`;
		},
	],
	[
		'transition',
		(decls) => {
			/** @type {(input: string | undefined) => string[]} */
			const commaSeparated = (input = '') => {
				let trimmedInput = input.trim();

				if (!trimmedInput) return [];

				if (trimmedInput.indexOf(',') === -1) return [trimmedInput];

				/** @type {import('postcss-value-parser').ParsedValue} */
				let parsedValue = valueParser(trimmedInput);
				/** @type {Array<Array<import('postcss-value-parser').Node>>} */
				let valueParts = [];

				{
					/** @type {Array<import('postcss-value-parser').Node>} */
					let currentListItem = [];

					parsedValue.nodes.forEach((node) => {
						if (node.type === 'div' && node.value === ',') {
							valueParts.push(currentListItem);
							currentListItem = [];

							return;
						}

						currentListItem.push(node);
					});

					valueParts.push(currentListItem);
				}

				return valueParts.map((s) => valueParser.stringify(s).trim()).filter((s) => s.length > 0);
			};

			const delays = commaSeparated(decls.get('transition-delay')?.value);
			const durations = commaSeparated(decls.get('transition-duration')?.value);
			const timingFunctions = commaSeparated(decls.get('transition-timing-function')?.value);
			const properties = commaSeparated(decls.get('transition-property')?.value);

			if (!(delays.length && durations.length && timingFunctions.length && properties.length)) {
				return;
			}

			// transition-property is the canonical list of the number of properties;
			// see spec: https://w3c.github.io/csswg-drafts/css-transitions/#transition-property-property
			// if there are more transition-properties than duration/delay/timings,
			// the other properties are computed cyclically -- ex with %
			// see spec example #3: https://w3c.github.io/csswg-drafts/css-transitions/#example-d94cbd75
			return properties
				.map((property, i) => {
					return [
						property,
						durations[i % durations.length],
						timingFunctions[i % timingFunctions.length],
						delays[i % delays.length],
					]
						.filter(isString)
						.join(' ');
				})
				.join(', ');
		},
	],
]);

/**
 * @param {string} prefixedShorthandProperty
 * @param {string[]} prefixedShorthandData
 * @param {Map<string, Declaration>} transformedDeclarationNodes
 * @returns {string | undefined}
 */
const resolveShorthandValue = (
	prefixedShorthandProperty,
	prefixedShorthandData,
	transformedDeclarationNodes,
) => {
	const resolver = customResolvers.get(prefixedShorthandProperty);

	if (resolver === undefined) {
		// the "default" resolver: sort the longhand values in the order
		// of their properties
		const values = prefixedShorthandData
			.map((p) => transformedDeclarationNodes.get(p)?.value.trim())
			.filter(Boolean);

		return values.length > 0 ? values.join(' ') : undefined;
	}

	return resolver(transformedDeclarationNodes);
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
					ignoreShorthands: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {Map<string, import('stylelint').ShorthandProperties[]>} */
		const longhandToShorthands = new Map();

		for (const [shorthand, longhandProps] of longhandSubPropertiesOfShorthandProperties.entries()) {
			if (optionsMatches(secondaryOptions, 'ignoreShorthands', shorthand)) {
				continue;
			}

			for (const longhand of longhandProps) {
				const shorthands = longhandToShorthands.get(longhand) || [];

				shorthands.push(shorthand);
				longhandToShorthands.set(longhand, shorthands);
			}
		}

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Map<string, string[]>} */
			const longhandDeclarations = new Map();
			/** @type {Map<string, Declaration[]>} */
			const longhandDeclarationNodes = new Map();

			eachDecl((decl) => {
				// basic keywords are not allowed in shorthand properties
				if (basicKeywords.has(decl.value)) {
					return;
				}

				const prop = decl.prop.toLowerCase();
				const unprefixedProp = vendor.unprefixed(prop);
				const prefix = vendor.prefix(prop);

				const shorthandProperties = longhandToShorthands.get(unprefixedProp);

				if (!shorthandProperties) {
					return;
				}

				for (const shorthandProperty of shorthandProperties) {
					const prefixedShorthandProperty = prefix + shorthandProperty;
					const longhandDeclaration = longhandDeclarations.get(prefixedShorthandProperty) || [];
					const longhandDeclarationNode =
						longhandDeclarationNodes.get(prefixedShorthandProperty) || [];

					longhandDeclaration.push(prop);
					longhandDeclarations.set(prefixedShorthandProperty, longhandDeclaration);

					longhandDeclarationNode.push(decl);
					longhandDeclarationNodes.set(prefixedShorthandProperty, longhandDeclarationNode);

					const shorthandProps = longhandSubPropertiesOfShorthandProperties.get(shorthandProperty);
					const prefixedShorthandData = Array.from(shorthandProps || []).map(
						(item) => prefix + item,
					);

					const copiedPrefixedShorthandData = [...prefixedShorthandData];

					if (!arrayEqual(copiedPrefixedShorthandData.sort(), longhandDeclaration.sort())) {
						continue;
					}

					if (context.fix) {
						const declNodes = longhandDeclarationNodes.get(prefixedShorthandProperty) || [];
						const [firstDeclNode] = declNodes;

						if (firstDeclNode) {
							const transformedDeclarationNodes = new Map(
								declNodes.map((d) => [d.prop.toLowerCase(), d]),
							);
							const resolvedShorthandValue = resolveShorthandValue(
								prefixedShorthandProperty,
								prefixedShorthandData,
								transformedDeclarationNodes,
							);

							if (resolvedShorthandValue) {
								const newShorthandDeclarationNode = firstDeclNode.clone({
									prop: prefixedShorthandProperty,
									value: resolvedShorthandValue,
								});

								firstDeclNode.replaceWith(newShorthandDeclarationNode);

								declNodes.forEach((node) => node.remove());

								return;
							}
						}
					}

					report({
						ruleName,
						result,
						node: decl,
						word: decl.prop,
						message: messages.expected,
						messageArgs: [prefixedShorthandProperty],
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
