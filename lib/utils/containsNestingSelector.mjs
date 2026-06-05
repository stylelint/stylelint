/**
 * Whether a selector contains a nesting selector.
 *
 * @param {import('postcss-selector-parser').Selector} selector
 * @returns {boolean}
 */
export default function containsNestingSelector(selector) {
	let found = false;

	selector.walkNesting(() => {
		found = true;

		return false;
	});

	return found;
}
