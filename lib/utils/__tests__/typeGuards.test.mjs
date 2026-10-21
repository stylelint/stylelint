import { describe, it } from 'node:test';

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
	it('match their node type', (t) => {
		t.assert.strictEqual(isRoot(root), true);
		t.assert.strictEqual(isRule(rule), true);
		t.assert.strictEqual(isDeclaration(decl), true);
		t.assert.strictEqual(isComment(comment), true);
		t.assert.strictEqual(isAtRule(atRule), true);
	});

	it('reject other node types', (t) => {
		t.assert.strictEqual(isRule(decl), false);
		t.assert.strictEqual(isComment(rule), false);
		t.assert.strictEqual(isDocument(root), false);
	});

	it('are null/undefined-safe', (t) => {
		t.assert.strictEqual(isRule(undefined), false);
		t.assert.strictEqual(isRule(null), false);
		t.assert.strictEqual(isRoot(rule.parent), true);
		t.assert.strictEqual(isRule(root.parent), false);
	});
});

describe('value-parser node guards', () => {
	const [word, space, fn] = valueParser('10px calc(1px)').nodes;
	const [, div] = valueParser('a, b').nodes;
	const [string] = valueParser('"a"').nodes;
	const [valueComment] = valueParser('/* c */').nodes;

	it('match their node type', (t) => {
		t.assert.strictEqual(isValueWord(word), true);
		t.assert.strictEqual(isValueSpace(space), true);
		t.assert.strictEqual(isValueFunction(fn), true);
		t.assert.strictEqual(isValueDiv(div), true);
		t.assert.strictEqual(isValueString(string), true);
		t.assert.strictEqual(isValueComment(valueComment), true);
	});

	it('reject other node types', (t) => {
		t.assert.strictEqual(isValueWord(fn), false);
		t.assert.strictEqual(isValueString(word), false);
		t.assert.strictEqual(isValueComment(word), false);
	});

	it('are null/undefined-safe', (t) => {
		t.assert.strictEqual(isValueWord(undefined), false);
		t.assert.strictEqual(isValueWord(null), false);
		t.assert.strictEqual(isValueComment(undefined), false);
		t.assert.strictEqual(isValueString(null), false);
	});
});

describe('hasSource', () => {
	it('reflects whether a node carries a source', (t) => {
		t.assert.strictEqual(hasSource(rule), true);
		t.assert.strictEqual(hasSource(undefined), false);
		t.assert.strictEqual(hasSource(null), false);
	});
});
