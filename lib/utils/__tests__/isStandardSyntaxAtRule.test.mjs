import { describe, it } from 'node:test';

import isStandardSyntaxAtRule from '../isStandardSyntaxAtRule.mjs';
import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssSass from 'postcss-sass';
import postcssScss from 'postcss-scss';

describe('isStandardSyntaxAtRule', () => {
	it('non nested at-rules without quotes', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@import url(foo.css)')));
	});

	it("non nested at-rules with `'` quotes", (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule("@import 'foo.css';")));
	});

	it('non nested at-rules with `"` quotes', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@import "foo.css";')));
	});

	it('non nested at-rules with function and ident', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@import url("fineprint.css") print;')));
	});

	it('nested at-rules', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@media (min-width: 100px) {};')));
	});

	it('nested at-rules with newline after name', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@media\n(min-width: 100px) {};')));
	});

	it('nested at-rules with windows newline after name', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@media\r\n(min-width: 100px) {};')));
	});

	it('nested at-rules without space after name', (t) => {
		t.assert.ok(isStandardSyntaxAtRule(atRule('@media(min-width: 100px) {};')));
	});

	it('at-charset css rule', (t) => {
		t.assert.ok(!isStandardSyntaxAtRule(atRule('@charset UTF-8;')));
	});

	// see AleshaOleg/postcss-sass#56
	it.skip('ignore `@content` inside mixins newline', (t) => {
		const rules = sassAtRules('@mixin mixin()\n  @content');

		t.assert.strictEqual(rules.length, 2);
		t.assert.deepStrictEqual(
			rules.map((rule) => rule.name),
			['mixin', 'content'],
		);
		t.assert.ok(isStandardSyntaxAtRule(rules[0]));
		t.assert.ok(!isStandardSyntaxAtRule(rules[1]));
	});

	it('ignore `@content` inside mixins space', (t) => {
		const rules = scssAtRules('@mixin mixin() { @content; };');

		t.assert.strictEqual(rules.length, 2);
		t.assert.deepStrictEqual(
			rules.map((rule) => rule.name),
			['mixin', 'content'],
		);
		t.assert.ok(isStandardSyntaxAtRule(rules[0]));
		t.assert.ok(!isStandardSyntaxAtRule(rules[1]));
	});

	it('ignore passing rulesets to mixins', (t) => {
		const rules = lessAtRules(
			'@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }',
		);

		t.assert.strictEqual(rules.length, 2);
		t.assert.ok(!isStandardSyntaxAtRule(rules[0]));
		t.assert.ok(!isStandardSyntaxAtRule(rules[1]));
	});

	it('ignore calling of mixins', (t) => {
		const rules = lessAtRules('a { .mixin(); }');

		t.assert.strictEqual(rules.length, 1);
		t.assert.ok(!isStandardSyntaxAtRule(rules[0]));
	});

	it('ignore variables', (t) => {
		const rules = lessAtRules('@my-variable: 10px; .top { margin-top: @my-variable; }');

		t.assert.strictEqual(rules.length, 1);
		t.assert.ok(!isStandardSyntaxAtRule(rules[0]));
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
