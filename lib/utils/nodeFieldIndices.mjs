import getAtRuleParams from './getAtRuleParams.mjs';
import getRuleSelector from './getRuleSelector.mjs';

import { isObject, isString } from './validateTypes.mjs';

/** @import {AtRule, Declaration, Rule} from 'postcss' */

/**
 * @param {AtRule} atRule
 * @returns {number}
 */
export function atRuleParamIndex(atRule) {
	let index = atRuleRawsAfterNameIndex(atRule);

	if (atRule.raws.afterName) {
		index += atRule.raws.afterName.length;
	}

	return index;
}

/**
 * @param {AtRule} node
 * @returns {number}
 */
export function atRuleRawsAfterIndex(node) {
	// subtract 1 for `}`

	if (!node.source?.end?.offset) return node.toString().length - 1;

	if (!node.raws?.after?.length) return node.source.end.offset - 1;

	return node.source.end.offset - (node.raws.after.length + 1);
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

	return [
		isObject(prop) && 'prefix' in prop && prop.prefix,
		(isObject(prop) && 'raw' in prop && prop.raw) || decl.prop,
		isObject(prop) && 'suffix' in prop && prop.suffix,
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
	const raws = decl.raws;

	return (
		declarationRawsBetweenIndex(decl) +
		[raws.between || ':', raws.value && 'prefix' in raws.value && raws.value.prefix].reduce(
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
export function ruleRawsAfterIndex(node) {
	// subtract 1 for `}`

	if (!node.source?.end?.offset) return node.toString().length - 1;

	if (!node.raws?.after?.length) return node.source.end.offset - 1;

	return node.source.end.offset - (node.raws.after.length + 1);
}
