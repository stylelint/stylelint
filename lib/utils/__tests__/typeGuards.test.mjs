import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

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
		assert.equal(isRoot(root), true);
		assert.equal(isRule(rule), true);
		assert.equal(isDeclaration(decl), true);
		assert.equal(isComment(comment), true);
		assert.equal(isAtRule(atRule), true);
	});

	it('reject other node types', () => {
		assert.equal(isRule(decl), false);
		assert.equal(isComment(rule), false);
		assert.equal(isDocument(root), false);
	});

	it('are null/undefined-safe', () => {
		assert.equal(isRule(undefined), false);
		assert.equal(isRule(null), false);
		assert.equal(isRoot(rule.parent), true);
		assert.equal(isRule(root.parent), false);
	});
});

describe('value-parser node guards', () => {
	const [word, space, fn] = valueParser('10px calc(1px)').nodes;
	const [, div] = valueParser('a, b').nodes;
	const [string] = valueParser('"a"').nodes;
	const [valueComment] = valueParser('/* c */').nodes;

	it('match their node type', () => {
		assert.equal(isValueWord(word), true);
		assert.equal(isValueSpace(space), true);
		assert.equal(isValueFunction(fn), true);
		assert.equal(isValueDiv(div), true);
		assert.equal(isValueString(string), true);
		assert.equal(isValueComment(valueComment), true);
	});

	it('reject other node types', () => {
		assert.equal(isValueWord(fn), false);
		assert.equal(isValueString(word), false);
		assert.equal(isValueComment(word), false);
	});

	it('are null/undefined-safe', () => {
		assert.equal(isValueWord(undefined), false);
		assert.equal(isValueWord(null), false);
		assert.equal(isValueComment(undefined), false);
		assert.equal(isValueString(null), false);
	});
});

describe('hasSource', () => {
	it('reflects whether a node carries a source', () => {
		assert.equal(hasSource(rule), true);
		assert.equal(hasSource(undefined), false);
		assert.equal(hasSource(null), false);
	});
});
