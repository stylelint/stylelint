'use strict';

const isLessVariable = require('../isLessVariable');
const less = require('postcss-less');

describe('isLessVariable', () => {
	it('is less variable', () => {
		lessAtRules('@var: 10px;', (atRule) => {
			expect(isLessVariable(atRule)).toBeTruthy();
		});
	});

	it('is less variable with function', () => {
		lessAtRules('@hover-color: darken(@color, 10%);', (atRule) => {
			expect(isLessVariable(atRule)).toBeTruthy();
		});
	});

	it('@charset is not a less variable', () => {
		lessAtRules('@charset UTF-8;', (atRule) => {
			expect(isLessVariable(atRule)).toBeFalsy();
		});
	});

	it('@import is not a less variable', () => {
		lessAtRules('@import url("some-styles.css");', (atRule) => {
			expect(isLessVariable(atRule)).toBeFalsy();
		});
	});

	it('@media is not a less variable', () => {
		lessAtRules('@media (min-width: 100px) {};', (atRule) => {
			expect(isLessVariable(atRule)).toBeFalsy();
		});
	});

	it('detached ruleset is not a less variable', () => {
		lessAtRules('@detached-ruleset: { margin: 0 };', (atRule) => {
			expect(isLessVariable(atRule)).toBeFalsy();
		});
	});
});

function lessAtRules(css, cb) {
	less.parse(css).walkAtRules(cb);
}
