import getAtRuleParams from './getAtRuleParams.mjs';
import getRuleSelector from './getRuleSelector.mjs';

import { isObject, isString } from './validateTypes.mjs';

/** @import {AtRule, Declaration, Rule} from 'postcss' */

/**
 * @param {AtRule} atRule
 * @returns {number}
 */
export function atRuleParamIndex(atRule) {
	const index = atRuleRawsAfterNameIndex(atRule);

	return index + (atRule.raws.afterName?.length ?? 0);
}

/**
 * @param {AtRule} node
 * @returns {number}
 */
export function atRuleRawsAfterIndex(atRule) {
	// subtract 1 for `}`

	const endOffset = node.source?.end?.offset;

	if (!endOffset) return node.toString().length - 1;

	const afterLength = node.raws?.after?.length;

	if (!afterLength) return endOffset - 1;

	return endOffset - (afterLength + 1);
}

/**
 * @param {AtRule} atRule
 * @returns {number}
 */
export function atRuleRawsAfterNameIndex(atRule) {
	// Initial 1 is for the `@`
	return 1 + atRule.name.length;
}

/**
 * @param {AtRule} atRule
 * @returns {number}
 */
export function atRuleRawsBetweenIndex(atRule) {
	return atRuleParamIndex(atRule) + getAtRuleParams(atRule).length;
}

/**
 * @param {Declaration} decl
 * @returns {number}
 */
export function declarationRawsBetweenIndex(decl) {
	const raws = decl.raws;
	const prop = raws.prop;
	const propIsObject = isObject(prop);

	return [
		propIsObject && 'prefix' in prop && prop.prefix,
		(propIsObject && 'raw' in prop && prop.raw) || decl.prop,
		propIsObject && 'suffix' in prop && prop.suffix,
	].reduce((/** @type {number} */ count, str) => {
		if (isString(str)) {
			return count + str.length;
		}

		return count;
	}, 0);
}

/**
 * Get the index of a declaration's value
 *
 * @param {Declaration} decl
 * @returns {number}
 */
export function declarationValueIndex(decl) {
	const { between, value } = decl.raws;

	return (
		declarationRawsBetweenIndex(decl) +
		[between || ':', value && 'prefix' in value && value.prefix].reduce(
			(/** @type {number} */ count, str) => {
				if (isString(str)) {
					return count + str.length;
				}

				return count;
			},
			0,
		)
	);
}

/**
 * @param {Rule} rule
 * @returns {number}
 */
export function ruleRawsBetweenIndex(rule) {
	return getRuleSelector(rule).length;
}

/**
 * @param {Rule} node
 * @returns {number}
 */
export function ruleRawsAfterIndex(rule) {
	// subtract 1 for `}`

	const endOffset = node.source?.end?.offset;

	if (!endOffset) return node.toString().length - 1;

	if (!node.raws?.after?.length) return node.source.end.offset - 1;

	return node.source.end.offset - (node.raws.after.length + 1);
}
