import parseSelector from '../parseSelector.mjs';
import selectorSourceIndex from '../selectorSourceIndex.mjs';

it('selectorSourceIndex', () => {
	expect(selectorSourceIndex(parseSelector('a'))).toBe(0);
	expect(selectorSourceIndex(parseSelector('a').nodes[0])).toBe(0);
	expect(selectorSourceIndex(parseSelector('a,b').nodes[1])).toBe(2);
	expect(selectorSourceIndex(parseSelector('a,,b').nodes[1])).toBe(2);
	expect(selectorSourceIndex(parseSelector('a,,b').nodes[2])).toBe(3);
});
