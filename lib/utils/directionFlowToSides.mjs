/** @import {Directionality} from 'stylelint' */

/**
 * Resolves a direction flow string to a [start, end] physical-side tuple.
 *
 * @param {Directionality} flow - e.g. 'left-to-right', 'top-to-bottom'
 * @returns {[string, string]} - e.g. ['left', 'right']
 */
export default function directionFlowToSides(flow) {
	switch (flow) {
		case 'top-to-bottom':
			return ['top', 'bottom'];
		case 'bottom-to-top':
			return ['bottom', 'top'];
		case 'left-to-right':
			return ['left', 'right'];
		case 'right-to-left':
			return ['right', 'left'];
	}
}
