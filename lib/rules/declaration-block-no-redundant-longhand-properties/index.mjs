import valueParser from 'postcss-value-parser';

import { assert, isRegExp, isString } from '../../utils/validateTypes.mjs';
import arrayEqual from '../../utils/arrayEqual.mjs';
import { basicKeywords } from '../../reference/keywords.mjs';
import eachDeclarationBlock from '../../utils/eachDeclarationBlock.mjs';
import { longhandSubPropertiesOfShorthandProperties } from '../../reference/properties.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'declaration-block-no-redundant-longhand-properties';

const messages = ruleMessages(ruleName, {
	expected: (property) => `Expected shorthand property "${property}"`,
	unexpectedLonghand: (longhand, shorthand) =>
		`Redundant longhand property "${longhand}" after shorthand property "${shorthand}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-redundant-longhand-properties',
	fixable: true,
};

/** @import { Declaration } from 'postcss' */
/** @import { Node as ValueNode } from 'postcss-value-parser' */
/** @import { ShorthandProperties } from 'stylelint' */

/** @type {Map<string, (decls: Map<string, Declaration>) => (string | undefined)>} */
const customResolvers = new Map([
	[
		'font-synthesis',
		(decls) => {
			const weight = decls.get('font-synthesis-weight')?.value.trim();
			const style = decls.get('font-synthesis-style')?.value.trim();
			const smallCaps = decls.get('font-synthesis-small-caps')?.value.trim();

			/** @type {(s: string | undefined) => boolean} */
			const isValidFontSynthesisValue = (s) => s === 'none' || s === 'auto';

			if (
				!isValidFontSynthesisValue(weight) ||
				!isValidFontSynthesisValue(style) ||
				!isValidFontSynthesisValue(smallCaps)
			) {
				return;
			}

			const autoShorthands = [];

			if (weight === 'auto') {
				autoShorthands.push('weight');
			}

			if (style === 'auto') {
				autoShorthands.push('style');
			}

			if (smallCaps === 'auto') {
				autoShorthands.push('small-caps');
			}

			if (autoShorthands.length === 0) return 'none';

			return autoShorthands.join(' ');
		},
	],
	[
		'grid-column',
		(decls) => {
			const start = decls.get('grid-column-start')?.value.trim();
			const end = decls.get('grid-column-end')?.value.trim();

			if (!start || !end) return;

			return `${start} / ${end}`;
		},
	],
	[
		'grid-row',
		(decls) => {
			const start = decls.get('grid-row-start')?.value.trim();
			const end = decls.get('grid-row-end')?.value.trim();

			if (!start || !end) return;

			return `${start} / ${end}`;
		},
	],
	[
		'grid-template',
		(decls) => {
			const areas = decls.get('grid-template-areas')?.value.trim();
			const columns = decls.get('grid-template-columns')?.value.trim();
			const rows = decls.get('grid-template-rows')?.value.trim();

			if (!(areas && columns && rows)) return;

			// repeat() is not allowed inside track listings for grid-template.
			// related issue: https://github.com/stylelint/stylelint/issues/7228
			// spec ref: https://drafts.csswg.org/css-grid/#explicit-grid-shorthand

			if (columns.includes('repeat(') || rows.includes('repeat(')) return;

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

const OVERLAPPING_SHORTHANDS = new Set([
	'border-width',
	'border-style',
	'border-color',
	'border-top',
	'border-right',
	'border-bottom',
	'border-left',
	'grid-column',
	'grid-row',
]);

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
					ignoreShorthands: [isString, isRegExp],
					ignoreLonghands: [isString],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {Map<string, ShorthandProperties[]>} */
		const longhandToShorthands = new Map();
		const ignoreLonghands = [secondaryOptions?.ignoreLonghands ?? []].flat();

		for (const [shorthand, longhandProps] of longhandSubPropertiesOfShorthandProperties.entries()) {
			if (optionsMatches(secondaryOptions, 'ignoreShorthands', shorthand)) continue;

			for (const longhand of longhandProps) {
				if (ignoreLonghands.includes(longhand)) continue;

				const shorthands = longhandToShorthands.get(longhand) || [];

				shorthands.push(shorthand);
				longhandToShorthands.set(longhand, shorthands);
			}
		}

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Map<string, Declaration[]>} */
			const longhandDeclarationNodes = new Map();
			/** @type {Map<string, string>} */
			const declaredShorthands = new Map();

			eachDecl((decl) => {
				const declValue = decl.value.trim();

				// basic keywords are not allowed in shorthand properties
				if (basicKeywords.has(declValue)) return;

				const prop = decl.prop.toLowerCase();
				const unprefixedProp = vendor.unprefixed(prop);
				const prefix = vendor.prefix(prop);

				if (
					longhandSubPropertiesOfShorthandProperties.has(
						/** @type {ShorthandProperties} */ (unprefixedProp),
					)
				) {
					declaredShorthands.set(prop, declValue);
				}

				const shorthandProperties = longhandToShorthands.get(unprefixedProp);

				if (!shorthandProperties) return;

				const { parent } = decl;

				assert(parent);

				for (const shorthandProperty of shorthandProperties) {
					const prefixedShorthandProperty = prefix + shorthandProperty;
					const shorthandValue = declaredShorthands.get(prefixedShorthandProperty);

					if (shorthandValue === declValue) {
						report({
							ruleName,
							result,
							node: decl,
							word: decl.prop,
							message: messages.unexpectedLonghand,
							messageArgs: [decl.prop, prefixedShorthandProperty],
							fix: {
								apply: () => {
									decl.remove();
								},
								node: parent,
							},
						});

						return;
					}

					const declNodes = longhandDeclarationNodes.get(prefixedShorthandProperty) || [];

					declNodes.push(decl);
					longhandDeclarationNodes.set(prefixedShorthandProperty, declNodes);

					const prefixedShorthandData = [
						...(longhandSubPropertiesOfShorthandProperties.get(shorthandProperty) ?? []),
					]
						.filter((item) => !ignoreLonghands.includes(item))
						.map((item) => prefix + item);
					const collectedProps = declNodes.map((n) => n.prop.toLowerCase());

					if (!arrayEqual(prefixedShorthandData.toSorted(), collectedProps.toSorted())) {
						continue;
					}

					if (hasMixedImportant(declNodes)) continue;

					const firstDeclNode = declNodes.at(0);
					const lastDeclNode = declNodes.at(-1);

					assert(firstDeclNode && lastDeclNode);

					const transformedDeclarationNodes = new Map(
						declNodes.map((d) => [d.prop.toLowerCase(), d]),
					);

					const resolvedShorthandValue = resolveShorthandValue(
						prefixedShorthandProperty,
						prefixedShorthandData,
						transformedDeclarationNodes,
					);

					const fix = resolvedShorthandValue
						? () => {
								const newShorthandDeclarationNode = firstDeclNode.clone({
									prop: prefixedShorthandProperty,
									value: resolvedShorthandValue,
								});

								firstDeclNode.replaceWith(newShorthandDeclarationNode);
								declNodes.forEach((node) => node.remove());

								if (OVERLAPPING_SHORTHANDS.has(shorthandProperty)) {
									const consumedProps = new Set(collectedProps);

									longhandDeclarationNodes.forEach((nodes, shorthand) => {
										longhandDeclarationNodes.set(
											shorthand,
											nodes.filter((node) => !consumedProps.has(node.prop.toLowerCase())),
										);
									});
								}
							}
						: undefined;

					const span = parent.index(lastDeclNode) - parent.index(firstDeclNode) + 1;
					const isContiguous = span === declNodes.length;
					const startDeclNode = isContiguous ? firstDeclNode : lastDeclNode;

					report({
						ruleName,
						result,
						message: messages.expected,
						messageArgs: [prefixedShorthandProperty],
						node: parent,
						start: startDeclNode.rangeBy({}).start,
						end: lastDeclNode.rangeBy({}).end,
						fix: {
							apply: fix,
							node: parent,
						},
					});
				}
			});
		});
	};
};

/**
 * @param {string | undefined} input
 * @returns {string[]}
 */
function commaSeparated(input) {
	const trimmed = input?.trim();

	if (!trimmed) return [];

	if (!trimmed.includes(',')) return [trimmed];

	/** @type {ValueNode[][]} */
	const parts = [];
	/** @type {ValueNode[]} */
	let current = [];

	parts.push(current);

	for (const node of valueParser(trimmed).nodes) {
		if (node.type === 'div' && node.value === ',') {
			current = [];
			parts.push(current);
		} else {
			current.push(node);
		}
	}

	return parts.map((nodes) => valueParser.stringify(nodes).trim()).filter(Boolean);
}

/**
 * @param {Declaration[]} decls
 * @returns {boolean}
 */
function hasMixedImportant(decls) {
	/** @type {(decl: Declaration) => boolean} */
	const isImportant = (decl) => decl.important;

	return decls.some(isImportant) && !decls.every(isImportant);
}

/**
 * @param {string} prefixedShorthandProperty
 * @param {string[]} prefixedShorthandData
 * @param {Map<string, Declaration>} transformedDeclarationNodes
 * @returns {string | undefined}
 */
function resolveShorthandValue(
	prefixedShorthandProperty,
	prefixedShorthandData,
	transformedDeclarationNodes,
) {
	const resolver = customResolvers.get(prefixedShorthandProperty);

	if (resolver) return resolver(transformedDeclarationNodes);

	// the "default" resolver: sort the longhand values in the order
	// of their properties
	return prefixedShorthandData
		.map((p) => transformedDeclarationNodes.get(p)?.value.trim() ?? '')
		.filter(Boolean)
		.join(' ');
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
