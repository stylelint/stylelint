import isUrlFunction from '../isUrlFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isUrlFunction', () => {
	it('ignores other functions', () => {
		expect(isUrlFunction(valueParser('calc(10% + 10px)').nodes[0])).toBe(false);
		expect(isUrlFunction(valueParser('calc(10px * pow(2, 10)').nodes[0])).toBe(false);
		expect(isUrlFunction(valueParser('rem(10rem, 6rem)').nodes[0])).toBe(false);
		expect(isUrlFunction(valueParser('var(--width, 20px)').nodes[0])).toBe(false);
		expect(isUrlFunction(valueParser('round(var(--width), 50px)').nodes[0])).toBe(false);
	});

	it('matches url', () => {
		expect(isUrlFunction(valueParser('URL()').nodes[0])).toBe(true);
		expect(isUrlFunction(valueParser('url("photo.gif")').nodes[0])).toBe(true);
		expect(isUrlFunction(valueParser('url("../images/bullet.jpg")').nodes[0])).toBe(true);
	});
});
