'use strict';

const isLessVariable = require('../isLessVariable');
const less = require('postcss-less');

describe('isLessVariable', () => {
	it('is less variable', () => {
		expect(isLessVariable(lessAtRule('@var: 10px;'))).toBeTruthy();
	});

	it('is less variable with function', () => {
		expect(isLessVariable(lessAtRule('@hover-color: darken(@color, 10%);'))).toBeTruthy();
	});

	it('@charset is not a less variable', () => {
		expect(isLessVariable(lessAtRule('@charset UTF-8;'))).toBeFalsy();
	});

	it('@import is not a less variable', () => {
		expect(isLessVariable(lessAtRule('@import url("some-styles.css");'))).toBeFalsy();
	});

	it('@media is not a less variable', () => {
		expect(isLessVariable(lessAtRule('@media (min-width: 100px) {};'))).toBeFalsy();
	});

	it('detached ruleset is not a less variable', () => {
		expect(isLessVariable(lessAtRule('@detached-ruleset: { margin: 0 };'))).toBeFalsy();
	});
});

function lessAtRule(css) {
	const atRules = [];

	less.parse(css).walkAtRules((atRule) => atRules.push(atRule));

	return atRules[0];
}
