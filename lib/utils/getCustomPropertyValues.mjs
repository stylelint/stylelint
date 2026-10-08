import { atRuleRegexes, descriptorRegexes } from './regexes.mjs';
import getDeclarationValue from './getDeclarationValue.mjs';
import { isAtRule } from './typeGuards.mjs';
import isCustomProperty from './isCustomProperty.mjs';
import putIfAbsent from './putIfAbsent.mjs';

/** @import { Declaration } from 'postcss' */

/**
 * Collect the values of each custom property in the given roots, in source order, including
 * the initial values of custom properties defined using `@property`
 *
 * @param {import('postcss').Root[]} roots
 * @returns {Map<string, string[]>}
 */
export default function getCustomPropertyValues(roots) {
	/** @type {Map<string, string[]>} */
	const values = new Map();

	for (const root of roots) {
		root.walkDecls((decl) => {
			const name = isInitialValueDescriptor(decl) ? decl.parent.params.trim() : decl.prop;

			if (!isCustomProperty(name)) return;

			putIfAbsent(values, name, () => []).push(getDeclarationValue(decl));
		});
	}

	return values;
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
