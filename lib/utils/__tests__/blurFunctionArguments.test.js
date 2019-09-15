'use strict';

const blurFunctionArguments = require('../blurFunctionArguments');

it('blurFunctionArguments', () => {
	expect(blurFunctionArguments('abc abc', 'url')).toBe('abc abc');
	expect(blurFunctionArguments('abc url(abc) abc', 'url')).toBe('abc url(```) abc');
	expect(blurFunctionArguments('abc uRl(abc) abc', 'url')).toBe('abc uRl(```) abc');
	expect(blurFunctionArguments('abc URL(abc) abc', 'url')).toBe('abc URL(```) abc');
	expect(blurFunctionArguments('abc url(abc) url(xx)', 'url', '#')).toBe('abc url(###) url(##)');
});
