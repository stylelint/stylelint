import { assert } from './validateTypes.mjs';

/** @import {Directionality} from 'stylelint' */

const directionalityMap = new Map(
	/** @type {const} */ ([
		['top-to-bottom', ['top', 'bottom']],
		['bottom-to-top', ['bottom', 'top']],
		['left-to-right', ['left', 'right']],
		['right-to-left', ['right', 'left']],
	]),
);

/** @typedef {NonNullable<ReturnType<typeof directionalityMap.get>>} Sides */

/**
 * Resolves a direction flow string to a [start, end] physical-side tuple.
 *
 * @param {Directionality} flow - e.g. 'left-to-right', 'top-to-bottom'
 * @returns {Sides} - e.g. ['left', 'right']
 */
export default function directionFlowToSides(flow) {
	const result = directionalityMap.get(flow);

	assert(result, `Invalid direction flow: ${flow}`);

	return result;
}
