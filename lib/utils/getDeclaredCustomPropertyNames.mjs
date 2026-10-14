import { atRuleRegexes, propertyRegexes } from './regexes.mjs';
import getCustomPropertyNames from './getCustomPropertyNames.mjs';

/**
 * The names of the custom properties a root declares or registers with `@property`
 *
 * @param {import('postcss').Root} root
 * @returns {Set<string>}
 */
export default function getDeclaredCustomPropertyNames(root) {
	/** @type {Set<string>} */
	const names = new Set();

	root.walkAtRules(atRuleRegexes.propertyName, (atRule) => {
		for (const name of getCustomPropertyNames(atRule)) {
			names.add(name);
		}
	});

	root.walkDecls(propertyRegexes.custom, ({ prop }) => {
		names.add(prop);
	});

	return names;
}
