import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import {
	atRuleAfterIndex,
	atRuleAfterNameIndex,
	atRuleBetweenIndex,
	atRuleParamIndex,
	declarationBetweenIndex,
	declarationValueIndex,
	ruleAfterIndex,
	ruleBetweenIndex,
} from '../nodeFieldIndices.mjs';

describe('atRuleParamIndex', () => {
	it('has a single space before the param', () => {
		assert.equal(atRuleParamIndex(atRule('@media (color) {}')), 7);
	});

	it('has multiple spaces before the param', () => {
		assert.equal(atRuleParamIndex(atRule('@media  (color) {}')), 8);
	});

	it('has a newline before the param', () => {
		assert.equal(atRuleParamIndex(atRule("@import\n'x.css');")), 8);
	});

	it('has a function param', () => {
		assert.equal(atRuleParamIndex(atRule('@document url-prefix(http://www.w3.org/Style/)')), 10);
	});

	it('has a comment before the param', () => {
		assert.equal(atRuleParamIndex(atRule('@media /* a comment */ (color) {}')), 23);
	});
});

describe('atRuleAfterIndex', () => {
	it('has no spaces in the rule', () => {
		assert.equal(atRuleAfterIndex(atRule('@media screen {}')), 15);
	});

	it('has a constructed rule', () => {
		assert.equal(
			atRuleAfterIndex(new postcss.AtRule({ name: 'media', params: 'screen', nodes: [] })),
			15,
		);
	});

	it('has a statement', () => {
		assert.equal(atRuleAfterIndex(atRule('@import "foo.css"')), 16);
	});

	it('has a constructed statement', () => {
		assert.equal(atRuleAfterIndex(new postcss.AtRule({ name: 'import', params: '"foo.css"' })), 16);
	});

	it('has a statement with a semi-colon', () => {
		assert.equal(atRuleAfterIndex(atRule('@import "foo.css";')), 17);
	});

	it('has a single space in the rule', () => {
		assert.equal(atRuleAfterIndex(atRule('@media screen { color: red; }')), 27);
	});

	it('has multiple spaces in the rule', () => {
		assert.equal(atRuleAfterIndex(atRule('@media screen { color: red;  }')), 27);
	});

	it('has a newline in the rule', () => {
		assert.equal(atRuleAfterIndex(atRule('@media screen { color: red;\n}')), 27);
	});

	it('has an after value', () => {
		assert.equal(atRule('@media screen { color: red;\n}').raws.after, '\n');
		assert.equal(atRuleAfterIndex(atRule('@media screen { color: red;\n}')), 27);
	});
});

describe('atRuleAfterNameIndex', () => {
	it('had a "media" condition', () => {
		assert.equal(atRuleAfterNameIndex(atRule('@media (color) {}')), 6);
	});

	it('has a "supports" condition', () => {
		assert.equal(atRuleAfterNameIndex(atRule('@supports (color) {}')), 9);
	});

	it('has a space before the @', () => {
		assert.equal(atRuleAfterNameIndex(atRule(' @media (color) {}')), 6);
	});

	it('has a newline before the @', () => {
		assert.equal(atRuleAfterNameIndex(atRule('\n@media (color) {}')), 6);
	});

	it('has a comment after the name', () => {
		assert.equal(atRuleAfterNameIndex(atRule('@media /* a comment */ (color) {}')), 6);
	});
});

describe('atRuleBetweenIndex', () => {
	it('has a single space between the param and the rule', () => {
		assert.equal(atRuleBetweenIndex(atRule('@media screen {}')), 13);
	});

	it('has multiple spaces between the param and the rule', () => {
		assert.equal(atRuleBetweenIndex(atRule('@media screen  {}')), 13);
	});

	it('has a newline between the param and the rule', () => {
		assert.equal(atRuleBetweenIndex(atRule('@media screen\n{}')), 13);
	});

	it('has complex params', () => {
		assert.equal(atRuleBetweenIndex(atRule('@media screen and (color),\nprint {}')), 32);
	});

	it('has a between value', () => {
		assert.equal(atRule('@media screen\n{}').raws.between, '\n');
		assert.equal(atRuleBetweenIndex(atRule('@media screen\n{}')), 13);
	});

	it('has no comments', () => {
		assert.equal(atRuleBetweenIndex(atRule('@media screen and (color) {}')), 25);
	});

	it('has a comment', () => {
		assert.equal(atRuleBetweenIndex(atRule('@media screen and /* a comment */ (color) {}')), 41);
	});
});

describe('declarationBetweenIndex', () => {
	it('has no spaces before the colon', () => {
		assert.equal(declarationBetweenIndex(decl('a { a:b }')), 1);
	});

	it('has a space before the colon', () => {
		assert.equal(declarationBetweenIndex(decl('a { a :b}')), 1);
	});

	it('has multiple characters before the colon', () => {
		assert.equal(declarationBetweenIndex(decl('a { a  :b }')), 1);
	});

	it('has a newline before the colon', () => {
		assert.equal(declarationBetweenIndex(decl('a { a\n:b }')), 1);
	});

	it('has a comment before the colon', () => {
		assert.equal(declarationBetweenIndex(decl('a { a/**/:b }')), 1);
	});

	it('has "aa" as property', () => {
		assert.equal(declarationBetweenIndex(decl('a { aa:b }')), 2);
	});

	it('has a between value', () => {
		assert.equal(decl('a { a\n:b }').raws.between, '\n:');
		assert.equal(declarationBetweenIndex(decl('a { a\n:b }')), 1);
	});
});

describe('declarationValueIndex', () => {
	it('has a space before the value', () => {
		assert.equal(declarationValueIndex(decl('a { a: b}')), 3);
	});

	it('has a colon before the value', () => {
		assert.equal(declarationValueIndex(decl('a { a :b }')), 3);
	});

	it('has no spaces before the value', () => {
		assert.equal(declarationValueIndex(decl('a { a:b }')), 2);
	});

	it('has multiple characters before the value', () => {
		assert.equal(declarationValueIndex(decl('a { a  : b }')), 5);
	});

	it('has a newline before the value', () => {
		assert.equal(declarationValueIndex(decl('a { a:\nb }')), 3);
	});
});

describe('ruleAfterIndex', () => {
	it('has no spaces in the rule', () => {
		assert.equal(ruleAfterIndex(rule('a {}')), 3);
	});

	it('has a constructed rule', () => {
		assert.equal(ruleAfterIndex(new postcss.Rule({ selector: 'a' })), 3);
	});

	it('has multiple spaces in the rule', () => {
		assert.equal(ruleAfterIndex(rule('a {  }')), 3);
	});

	it('has a newline in the rule', () => {
		assert.equal(ruleAfterIndex(rule('a {\n}')), 3);
	});

	it('has an after value', () => {
		assert.equal(rule('a { color: red;\n}').raws.after, '\n');
		assert.equal(ruleAfterIndex(rule('a { color: red;\n}')), 15);
	});
});

describe('ruleBetweenIndex', () => {
	it('has a single space between the param and the rule', () => {
		assert.equal(ruleBetweenIndex(rule('a {}')), 1);
	});

	it('has multiple spaces between the param and the rule', () => {
		assert.equal(ruleBetweenIndex(rule('a  {}')), 1);
	});

	it('has a newline between the param and the rule', () => {
		assert.equal(ruleBetweenIndex(rule('a\n{}')), 1);
	});

	it('has complex selectors', () => {
		assert.equal(ruleBetweenIndex(rule('a > b,\nc:is(d) {}')), 14);
	});

	it('has a between value', () => {
		assert.equal(rule('a\n{}').raws.between, '\n');
		assert.equal(ruleBetweenIndex(rule('a\n{}')), 1);
	});

	it('has no comments', () => {
		assert.equal(ruleBetweenIndex(rule('a b {}')), 3);
	});

	it('has a comment', () => {
		assert.equal(ruleBetweenIndex(rule('a /* a comment */ b {}')), 19);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((node) => list.push(node));

	return list[0];
}

function decl(css) {
	const list = [];

	postcss.parse(css).walkDecls((node) => list.push(node));

	return list[0];
}

function rule(css) {
	const list = [];

	postcss.parse(css).walkRules((node) => list.push(node));

	return list[0];
}
