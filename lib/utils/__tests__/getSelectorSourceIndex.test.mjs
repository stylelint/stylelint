import getSelectorSourceIndex from '../getSelectorSourceIndex.mjs';
import parseSelector from '../parseSelector.mjs';

it('getSelectorSourceIndex', () => {
	expect(getSelectorSourceIndex(parseSelector('a'))).toBe(0);
	expect(getSelectorSourceIndex(parseSelector('a').nodes[0])).toBe(0);
	expect(getSelectorSourceIndex(parseSelector('a,b').nodes[1])).toBe(2);

	// Check that source indices are whitespace exclusive
	expect(getSelectorSourceIndex(parseSelector('a, b').nodes[1])).toBe(3);

	// Check that we fallback to the selector source index when a selector node has no children
	expect(getSelectorSourceIndex(parseSelector('a,,b').nodes[1])).toBe(2);
});
