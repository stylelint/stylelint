import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxAtRule from '../isStandardSyntaxAtRule.mjs';
import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

describe('isStandardSyntaxAtRule', () => {
	it('non nested at-rules without quotes', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@import url(foo.css)')));
	});

	it("non nested at-rules with `'` quotes", () => {
		assert.ok(isStandardSyntaxAtRule(atRule("@import 'foo.css';")));
	});

	it('non nested at-rules with `"` quotes', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@import "foo.css";')));
	});

	it('non nested at-rules with function and ident', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@import url("fineprint.css") print;')));
	});

	it('nested at-rules', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@media (min-width: 100px) {};')));
	});

	it('nested at-rules with newline after name', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@media\n(min-width: 100px) {};')));
	});

	it('nested at-rules with windows newline after name', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@media\r\n(min-width: 100px) {};')));
	});

	it('nested at-rules without space after name', () => {
		assert.ok(isStandardSyntaxAtRule(atRule('@media(min-width: 100px) {};')));
	});

	it('at-charset css rule', () => {
		assert.ok(!isStandardSyntaxAtRule(atRule('@charset UTF-8;')));
	});

	// see AleshaOleg/postcss-sass#56
	it.skip('ignore `@content` inside mixins newline', () => {
		const rules = sassAtRules('@mixin mixin()\n  @content');

		assert.equal(rules.length, 2);
		assert.deepEqual(
			rules.map((rule) => rule.name),
			['mixin', 'content'],
		);
		assert.ok(isStandardSyntaxAtRule(rules[0]));
		assert.ok(!isStandardSyntaxAtRule(rules[1]));
	});

	it('ignore `@content` inside mixins space', () => {
		const rules = scssAtRules('@mixin mixin() { @content; };');

		assert.equal(rules.length, 2);
		assert.deepEqual(
			rules.map((rule) => rule.name),
			['mixin', 'content'],
		);
		assert.ok(isStandardSyntaxAtRule(rules[0]));
		assert.ok(!isStandardSyntaxAtRule(rules[1]));
	});

	it('ignore passing rulesets to mixins', () => {
		const rules = lessAtRules(
			'@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }',
		);

		assert.equal(rules.length, 2);
		assert.ok(!isStandardSyntaxAtRule(rules[0]));
		assert.ok(!isStandardSyntaxAtRule(rules[1]));
	});

	it('ignore calling of mixins', () => {
		const rules = lessAtRules('a { .mixin(); }');

		assert.equal(rules.length, 1);
		assert.ok(!isStandardSyntaxAtRule(rules[0]));
	});

	it('ignore variables', () => {
		const rules = lessAtRules('@my-variable: 10px; .top { margin-top: @my-variable; }');

		assert.equal(rules.length, 1);
		assert.ok(!isStandardSyntaxAtRule(rules[0]));
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
