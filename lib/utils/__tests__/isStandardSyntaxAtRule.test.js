'use strict';

const isStandardSyntaxAtRule = require('../isStandardSyntaxAtRule');
const postcss = require('postcss');
const postcssLess = require('postcss-less');
const postcssSass = require('postcss-sass');
const postcssScss = require('postcss-scss');

describe('isStandardSyntaxAtRule', () => {
	it('non nested at-rules without quotes', () => {
		expect(isStandardSyntaxAtRule(atRule('@charset UTF-8;'))).toBeTruthy();
	});

	it("non nested at-rules with `'` quotes", () => {
		expect(isStandardSyntaxAtRule(atRule("@charset 'UTF-8';"))).toBeTruthy();
	});

	it('non nested at-rules with `"` quotes', () => {
		expect(isStandardSyntaxAtRule(atRule('@charset "UTF-8";'))).toBeTruthy();
	});

	it("non nested at-rules with `'` quotes and without space after name", () => {
		expect(isStandardSyntaxAtRule(atRule("@charset'UTF-8';"))).toBeTruthy();
	});

	it('non nested at-rules with `"` quotes and without space after name', () => {
		expect(isStandardSyntaxAtRule(atRule('@charset"UTF-8";'))).toBeTruthy();
	});

	it('non nested at-rules with function and without space after name', () => {
		expect(isStandardSyntaxAtRule(atRule('@import url("fineprint.css") print;'))).toBeTruthy();
	});

	it('nested at-rules', () => {
		expect(isStandardSyntaxAtRule(atRule('@media (min-width: 100px) {};'))).toBeTruthy();
	});

	it('nested at-rules with newline after name', () => {
		expect(isStandardSyntaxAtRule(atRule('@media\n(min-width: 100px) {};'))).toBeTruthy();
	});

	it('nested at-rules with windows newline after name', () => {
		expect(isStandardSyntaxAtRule(atRule('@media\r\n(min-width: 100px) {};'))).toBeTruthy();
	});

	it('nested at-rules without space after name', () => {
		expect(isStandardSyntaxAtRule(atRule('@media(min-width: 100px) {};'))).toBeTruthy();
	});

	// eslint-disable-next-line jest/no-disabled-tests -- TODO: `postcss-sass` parser does not support `@mixin`.
	it.skip('ignore `@content` inside mixins newline', () => {
		const rules = sassAtRules('@mixin mixin()\n  @content');

		expect(rules).toHaveLength(2);
		expect(rules.map((rule) => rule.name)).toEqual(['mixin', 'content']);
		expect(isStandardSyntaxAtRule(rules[0])).toBeTruthy();
		expect(isStandardSyntaxAtRule(rules[1])).toBeFalsy();
	});

	it('ignore `@content` inside mixins space', () => {
		const rules = scssAtRules('@mixin mixin() { @content; };');

		expect(rules).toHaveLength(2);
		expect(rules.map((rule) => rule.name)).toEqual(['mixin', 'content']);
		expect(isStandardSyntaxAtRule(rules[0])).toBeTruthy();
		expect(isStandardSyntaxAtRule(rules[1])).toBeFalsy();
	});

	it('ignore passing rulesets to mixins', () => {
		const rules = lessAtRules(
			'@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }',
		);

		expect(rules).toHaveLength(2);
		expect(isStandardSyntaxAtRule(rules[0])).toBeFalsy();
		expect(isStandardSyntaxAtRule(rules[1])).toBeFalsy();
	});

	it('ignore calling of mixins', () => {
		const rules = lessAtRules('a { .mixin(); }');

		expect(rules).toHaveLength(1);
		expect(isStandardSyntaxAtRule(rules[0])).toBeFalsy();
	});

	it('ignore variables', () => {
		const rules = lessAtRules('@my-variable: 10px; .top { margin-top: @my-variable; }');

		expect(rules).toHaveLength(1);
		expect(isStandardSyntaxAtRule(rules[0])).toBeFalsy();
	});
});

function atRules(code, parser = postcss) {
	const rules = [];

	parser.parse(code).walkAtRules((rule) => rules.push(rule));

	return rules;
}

function atRule(code) {
	return atRules(code)[0];
}

function sassAtRules(code) {
	return atRules(code, postcssSass);
}

function scssAtRules(code) {
	return atRules(code, postcssScss);
}

function lessAtRules(code) {
	return atRules(code, postcssLess);
}
