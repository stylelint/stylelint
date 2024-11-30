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
		expect(atRuleParamIndex(atRule('@media (color) {}'))).toBe(7);
	});

	it('has multiple spaces before the param', () => {
		expect(atRuleParamIndex(atRule('@media  (color) {}'))).toBe(8);
	});

	it('has a newline before the param', () => {
		expect(atRuleParamIndex(atRule("@import\n'x.css');"))).toBe(8);
	});

	it('has a function param', () => {
		expect(atRuleParamIndex(atRule('@document url-prefix(http://www.w3.org/Style/)'))).toBe(10);
	});

	it('has a comment before the param', () => {
		expect(atRuleParamIndex(atRule('@media /* a comment */ (color) {}'))).toBe(23);
	});
});

describe('atRuleAfterIndex', () => {
	it('has no spaces in the rule', () => {
		expect(atRuleAfterIndex(atRule('@media screen {}'))).toBe(15);
	});

	it('has a constructed rule', () => {
		expect(
			atRuleAfterIndex(new postcss.AtRule({ name: 'media', params: 'screen', nodes: [] })),
		).toBe(15);
	});

	it('has a statement', () => {
		expect(atRuleAfterIndex(atRule('@import "foo.css"'))).toBe(16);
	});

	it('has a constructed statement', () => {
		expect(atRuleAfterIndex(new postcss.AtRule({ name: 'import', params: '"foo.css"' }))).toBe(16);
	});

	it('has a statement with a semi-colon', () => {
		expect(atRuleAfterIndex(atRule('@import "foo.css";'))).toBe(17);
	});

	it('has a single space in the rule', () => {
		expect(atRuleAfterIndex(atRule('@media screen { color: red; }'))).toBe(27);
	});

	it('has multiple spaces in the rule', () => {
		expect(atRuleAfterIndex(atRule('@media screen { color: red;  }'))).toBe(27);
	});

	it('has a newline in the rule', () => {
		expect(atRuleAfterIndex(atRule('@media screen { color: red;\n}'))).toBe(27);
	});

	it('has an after value', () => {
		expect(atRule('@media screen { color: red;\n}').raws.after).toBe('\n');
		expect(atRuleAfterIndex(atRule('@media screen { color: red;\n}'))).toBe(27);
	});
});

describe('atRuleAfterNameIndex', () => {
	it('had a "media" condition', () => {
		expect(atRuleAfterNameIndex(atRule('@media (color) {}'))).toBe(6);
	});

	it('has a "supports" condition', () => {
		expect(atRuleAfterNameIndex(atRule('@supports (color) {}'))).toBe(9);
	});

	it('has a space before the @', () => {
		expect(atRuleAfterNameIndex(atRule(' @media (color) {}'))).toBe(6);
	});

	it('has a newline before the @', () => {
		expect(atRuleAfterNameIndex(atRule('\n@media (color) {}'))).toBe(6);
	});

	it('has a comment after the name', () => {
		expect(atRuleAfterNameIndex(atRule('@media /* a comment */ (color) {}'))).toBe(6);
	});
});

describe('atRuleBetweenIndex', () => {
	it('has a single space between the param and the rule', () => {
		expect(atRuleBetweenIndex(atRule('@media screen {}'))).toBe(13);
	});

	it('has multiple spaces between the param and the rule', () => {
		expect(atRuleBetweenIndex(atRule('@media screen  {}'))).toBe(13);
	});

	it('has a newline between the param and the rule', () => {
		expect(atRuleBetweenIndex(atRule('@media screen\n{}'))).toBe(13);
	});

	it('has complex params', () => {
		expect(atRuleBetweenIndex(atRule('@media screen and (color),\nprint {}'))).toBe(32);
	});

	it('has a between value', () => {
		expect(atRule('@media screen\n{}').raws.between).toBe('\n');
		expect(atRuleBetweenIndex(atRule('@media screen\n{}'))).toBe(13);
	});

	it('has no comments', () => {
		expect(atRuleBetweenIndex(atRule('@media screen and (color) {}'))).toBe(25);
	});

	it('has a comment', () => {
		expect(atRuleBetweenIndex(atRule('@media screen and /* a comment */ (color) {}'))).toBe(41);
	});
});

describe('declarationBetweenIndex', () => {
	it('has no spaces before the colon', () => {
		expect(declarationBetweenIndex(decl('a { a:b }'))).toBe(1);
	});

	it('has a space before the colon', () => {
		expect(declarationBetweenIndex(decl('a { a :b}'))).toBe(1);
	});

	it('has multiple characters before the colon', () => {
		expect(declarationBetweenIndex(decl('a { a  :b }'))).toBe(1);
	});

	it('has a newline before the colon', () => {
		expect(declarationBetweenIndex(decl('a { a\n:b }'))).toBe(1);
	});

	it('has a comment before the colon', () => {
		expect(declarationBetweenIndex(decl('a { a/**/:b }'))).toBe(1);
	});

	it('has "aa" as property', () => {
		expect(declarationBetweenIndex(decl('a { aa:b }'))).toBe(2);
	});

	it('has a between value', () => {
		expect(decl('a { a\n:b }').raws.between).toBe('\n:');
		expect(declarationBetweenIndex(decl('a { a\n:b }'))).toBe(1);
	});
});

describe('declarationValueIndex', () => {
	it('has a space before the value', () => {
		expect(declarationValueIndex(decl('a { a: b}'))).toBe(3);
	});

	it('has a colon before the value', () => {
		expect(declarationValueIndex(decl('a { a :b }'))).toBe(3);
	});

	it('has no spaces before the value', () => {
		expect(declarationValueIndex(decl('a { a:b }'))).toBe(2);
	});

	it('has multiple characters before the value', () => {
		expect(declarationValueIndex(decl('a { a  : b }'))).toBe(5);
	});

	it('has a newline before the value', () => {
		expect(declarationValueIndex(decl('a { a:\nb }'))).toBe(3);
	});
});

describe('ruleAfterIndex', () => {
	it('has no spaces in the rule', () => {
		expect(ruleAfterIndex(rule('a {}'))).toBe(3);
	});

	it('has a constructed rule', () => {
		expect(ruleAfterIndex(new postcss.Rule({ selector: 'a' }))).toBe(3);
	});

	it('has multiple spaces in the rule', () => {
		expect(ruleAfterIndex(rule('a {  }'))).toBe(3);
	});

	it('has a newline in the rule', () => {
		expect(ruleAfterIndex(rule('a {\n}'))).toBe(3);
	});

	it('has an after value', () => {
		expect(rule('a { color: red;\n}').raws.after).toBe('\n');
		expect(ruleAfterIndex(rule('a { color: red;\n}'))).toBe(15);
	});
});

describe('ruleBetweenIndex', () => {
	it('has a single space between the param and the rule', () => {
		expect(ruleBetweenIndex(rule('a {}'))).toBe(1);
	});

	it('has multiple spaces between the param and the rule', () => {
		expect(ruleBetweenIndex(rule('a  {}'))).toBe(1);
	});

	it('has a newline between the param and the rule', () => {
		expect(ruleBetweenIndex(rule('a\n{}'))).toBe(1);
	});

	it('has complex selectors', () => {
		expect(ruleBetweenIndex(rule('a > b,\nc:is(d) {}'))).toBe(14);
	});

	it('has a between value', () => {
		expect(rule('a\n{}').raws.between).toBe('\n');
		expect(ruleBetweenIndex(rule('a\n{}'))).toBe(1);
	});

	it('has no comments', () => {
		expect(ruleBetweenIndex(rule('a b {}'))).toBe(3);
	});

	it('has a comment', () => {
		expect(ruleBetweenIndex(rule('a /* a comment */ b {}'))).toBe(19);
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
