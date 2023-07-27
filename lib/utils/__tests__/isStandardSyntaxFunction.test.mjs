import isStandardSyntaxFunction from '../isStandardSyntaxFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isStandardSyntaxFunction', () => {
	it('calc', () => {
		expect(isStandardSyntaxFunction(getFunction('calc(a + b)'))).toBe(true);
	});

	it('url', () => {
		expect(isStandardSyntaxFunction(getFunction("url('x.css')"))).toBe(true);
	});

	it('scss list', () => {
		// as in $list: (list)
		expect(isStandardSyntaxFunction(getFunction('(list)'))).toBe(false);
	});

	it('scss map', () => {
		// as in $map: (key: value)
		expect(isStandardSyntaxFunction(getFunction('(key: value)'))).toBe(false);
	});

	it('scss function in scss interpolation', () => {
		expect(isStandardSyntaxFunction(getFunction('#{darken(#fff, 0.2)}'))).toBe(false);
	});

	it('CSS-in-JS interpolation', () => {
		expect(
			isStandardSyntaxFunction(
				getFunction('${({ size }) => (size === "small") ? "0.8em" : "1em"}'),
			),
		).toBe(false);
	});

	it('CSS-in-JS syntax', () => {
		expect(isStandardSyntaxFunction(getFunction('`calc(${token.radiusBase} + 2px)`'))).toBe(false);
	});
});

function getFunction(declValue) {
	const functions = [];

	valueParser(declValue).walk((valueNode) => {
		if (valueNode.type === 'function') {
			functions.push(valueNode);
		}
	});

	return functions[0];
}
