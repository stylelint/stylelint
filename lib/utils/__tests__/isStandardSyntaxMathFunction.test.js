'use strict';

const isStandardSyntaxMathFunction = require('../isStandardSyntaxMathFunction');

describe('isStandardSyntaxMathFunction', () => {
	it('standard', () => {
		const css = 'calc(10px + 10px)';

		expect(isStandardSyntaxMathFunction(css)).toBe(true);
	});

	it('standard with custom property', () => {
		const css = 'calc(10px + var(--hello))';

		expect(isStandardSyntaxMathFunction(css)).toBe(true);
	});

	it('SCSS variable without dashes', () => {
		const css = 'calc($var * 3)';

		expect(isStandardSyntaxMathFunction(css)).toBe(false);
	});

	it('SCSS variable with dashes', () => {
		const css = 'calc(3 + $my-var)';

		expect(isStandardSyntaxMathFunction(css)).toBe(false);
	});

	it('SCSS interpolation', () => {
		const css = 'calc(3 - ${$my-var})';

		expect(isStandardSyntaxMathFunction(css)).toBe(false);
	});

	it('Less variable without dashes', () => {
		const css = 'calc(@var * 3)';

		expect(isStandardSyntaxMathFunction(css)).toBe(false);
	});

	it('Less variable with dashes', () => {
		const css = 'calc(3 - @my-var)';

		expect(isStandardSyntaxMathFunction(css)).toBe(false);
	});
});
