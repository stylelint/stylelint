import parseSelector from '../parseSelector.mjs';
import selectorSourceIndex from '../selectorSourceIndex.mjs';

it('selectorSourceIndex', () => {
	expect(selectorSourceIndex(parseSelector('a'))).toBe(0);
	expect(selectorSourceIndex(parseSelector('a').nodes[0])).toBe(0);
	expect(selectorSourceIndex(parseSelector('a,b').nodes[1])).toBe(2);

	// Check that source indices are whitespace exclusive
	expect(selectorSourceIndex(parseSelector('a, b').nodes[1])).toBe(3);

	// Check that we fallback to the selector source index when a selector node has no children
	expect(selectorSourceIndex(parseSelector('a,,b').nodes[1])).toBe(2);
});
