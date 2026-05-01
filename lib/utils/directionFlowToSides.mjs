import { assert } from './validateTypes.mjs';

/** @import {Directionality} from 'stylelint' */

/** @type {ReadonlyMap<Directionality, [string, string]>} */
const directionalityMap = new Map([
	['top-to-bottom', ['top', 'bottom']],
	['bottom-to-top', ['bottom', 'top']],
	['left-to-right', ['left', 'right']],
	['right-to-left', ['right', 'left']],
]);

/**
 * Resolves a direction flow string to a [start, end] physical-side tuple.
 *
 * @param {Directionality} flow - e.g. 'left-to-right', 'top-to-bottom'
 * @returns {[string, string]} - e.g. ['left', 'right']
 */
export default function directionFlowToSides(flow) {
	const result = directionalityMap.get(flow);

	assert(result, `Invalid direction flow: ${flow}`);

	return result;
}
