import isIgnoredFunction from '../isIgnoredFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isIgnoredFunction', () => {
	it('ignores other functions', () => {
		expect(isIgnoredFunction(valueParser('calc(10% + 10px)').nodes[0])).toBe(false);
		expect(isIgnoredFunction(valueParser('calc(10px * pow(2, 10)').nodes[0])).toBe(false);
		expect(isIgnoredFunction(valueParser('rem(10rem, 6rem)').nodes[0])).toBe(false);
		expect(isIgnoredFunction(valueParser('var(--width, 20px)').nodes[0])).toBe(false);
		expect(isIgnoredFunction(valueParser('round(var(--width), 50px)').nodes[0])).toBe(false);
	});

	it('matches url', () => {
		expect(isIgnoredFunction(valueParser('url("photo.gif")').nodes[0])).toBe(true);
		expect(isIgnoredFunction(valueParser('url("../images/bullet.jpg")').nodes[0])).toBe(true);
	});
});
