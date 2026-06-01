import postcss from 'postcss';
import valueParser from 'postcss-value-parser';

import {
	hasSource,
	isAtRule,
	isComment,
	isDeclaration,
	isDocument,
	isRoot,
	isRule,
	isValueComment,
	isValueDiv,
	isValueFunction,
	isValueSpace,
	isValueString,
	isValueWord,
} from '../typeGuards.mjs';

const root = postcss.parse('a { color: red; } /* c */ @media {}');
const rule = root.first;
const decl = rule.first;
const comment = root.nodes[1];
const atRule = root.last;

describe('PostCSS node guards', () => {
	it('match their node type', () => {
		expect(isRoot(root)).toBe(true);
		expect(isRule(rule)).toBe(true);
		expect(isDeclaration(decl)).toBe(true);
		expect(isComment(comment)).toBe(true);
		expect(isAtRule(atRule)).toBe(true);
	});

	it('reject other node types', () => {
		expect(isRule(decl)).toBe(false);
		expect(isComment(rule)).toBe(false);
		expect(isDocument(root)).toBe(false);
	});

	it('are null/undefined-safe', () => {
		expect(isRule(undefined)).toBe(false);
		expect(isRule(null)).toBe(false);
		expect(isRoot(rule.parent)).toBe(true);
		expect(isRule(root.parent)).toBe(false);
	});
});

describe('value-parser node guards', () => {
	const [word, space, fn] = valueParser('10px calc(1px)').nodes;
	const [, div] = valueParser('a, b').nodes;
	const [string] = valueParser('"a"').nodes;
	const [valueComment] = valueParser('/* c */').nodes;

	it('match their node type', () => {
		expect(isValueWord(word)).toBe(true);
		expect(isValueSpace(space)).toBe(true);
		expect(isValueFunction(fn)).toBe(true);
		expect(isValueDiv(div)).toBe(true);
		expect(isValueString(string)).toBe(true);
		expect(isValueComment(valueComment)).toBe(true);
	});

	it('reject other node types', () => {
		expect(isValueWord(fn)).toBe(false);
		expect(isValueString(word)).toBe(false);
		expect(isValueComment(word)).toBe(false);
	});

	it('are null/undefined-safe', () => {
		expect(isValueWord(undefined)).toBe(false);
		expect(isValueWord(null)).toBe(false);
		expect(isValueComment(undefined)).toBe(false);
		expect(isValueString(null)).toBe(false);
	});
});

describe('hasSource', () => {
	it('reflects whether a node carries a source', () => {
		expect(hasSource(rule)).toBe(true);
		expect(hasSource(undefined)).toBe(false);
		expect(hasSource(null)).toBe(false);
	});
});
