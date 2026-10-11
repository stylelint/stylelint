import { atRuleRegexes, descriptorRegexes } from './regexes.mjs';
import getCustomPropertyNames from './getCustomPropertyNames.mjs';
import getDeclarationValue from './getDeclarationValue.mjs';
import getOrInsertComputed from './getOrInsertComputed.mjs';
import { isAtRule } from './typeGuards.mjs';
import isCustomProperty from './isCustomProperty.mjs';
import memoize from './memoize.mjs';

/** @import { Declaration, Root } from 'postcss' */

/**
 * Collect the values of each custom property in the given roots, in source order, including
 * the initial values of custom properties defined using `@property`
 *
 * @param {Root[]} roots
 * @returns {Map<string, string[]>}
 */
export default function getCustomPropertyValues(roots) {
	/** @type {Map<string, string[]>} */
	const values = new Map();

	for (const root of roots) {
		root.walkDecls((decl) => {
			const names = isInitialValueDescriptor(decl)
				? getCustomPropertyNames(decl.parent)
				: [decl.prop];

			for (const name of names) {
				if (!isCustomProperty(name)) continue;

				getOrInsertComputed(values, name, () => []).push(getDeclarationValue(decl));
			}
		});
	}

	return values;
}

/**
 * Computed once, as reference roots are shared across linted files
 */
export const getCustomPropertyValuesOfReferenceRoots = memoize(getCustomPropertyValues);

/**
 * The reference roots' values, then the root's, in source order. A root declaring none gets the
 * shared reference map, so the result mustn't be mutated
 *
 * @param {Root} root
 * @param {Root[]} referenceRoots
 * @returns {Map<string, string[]>}
 */
export function getDeclaredCustomPropertyValues(root, referenceRoots) {
	const referenceValues = getCustomPropertyValuesOfReferenceRoots(referenceRoots);
	const ownValues = getCustomPropertyValues([root]);

	if (ownValues.size === 0) return referenceValues;

	const declared = new Map(referenceValues);

	for (const [name, values] of ownValues) {
		declared.set(name, [...(referenceValues.get(name) ?? []), ...values]);
	}

	return declared;
}

/**
 * @param {Declaration} decl
 * @returns {decl is Declaration & { parent: import('postcss').AtRule }}
 */
function isInitialValueDescriptor(decl) {
	return (
		isAtRule(decl.parent) &&
		atRuleRegexes.propertyName.test(decl.parent.name) &&
		descriptorRegexes.initialValueName.test(decl.prop)
	);
}
