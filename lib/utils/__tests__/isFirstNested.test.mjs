import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isFirstNested from '../isFirstNested.mjs';
import postcss from 'postcss';

describe('isFirstNested', () => {
	it('returns false with the first node', () => {
		const root = postcss.parse(`
      a { color: 'pink'; }
    `);

		assert.equal(isFirstNested(root.nodes[0]), false);
	});

	it('returns true with the first-nested rule', () => {
		const root = postcss.parse(`
      @media (min-width: 0px) {
        a { color: 'pink'; }
      }
      @media (min-width: 0px) { /* comment */
        a { color: 'pink'; }
      }
    `);

		const rules = [];

		root.walkRules((rule) => rules.push(rule));

		assert.equal(rules.length, 2);
		assert.equal(isFirstNested(rules[0]), true);
		assert.equal(isFirstNested(rules[1]), true);
	});

	it('returns true with the first-nested at-rule', () => {
		const root = postcss.parse(`
      a {
        @include foo;
      }
      b { /* comment */
        @include foo;
      }
    `);

		const atRules = [];

		root.walkAtRules((rule) => atRules.push(rule));

		assert.equal(atRules.length, 2);
		assert.equal(isFirstNested(atRules[0]), true);
		assert.equal(isFirstNested(atRules[1]), true);
	});

	it('returns true with the first-nested declaration', () => {
		const root = postcss.parse(`
      a {
        color: pink;
      }
      b { /* comment */
        color: pink;
      }
    `);

		const decls = [];

		root.walkDecls((decl) => decls.push(decl));

		assert.equal(decls.length, 2);
		assert.equal(isFirstNested(decls[0]), true);
		assert.equal(isFirstNested(decls[1]), true);
	});

	it('returns true with first-nested non-statement', () => {
		const root = postcss.parse(`
      a {
        /* comment */
      }
      b { /* shared-line comment */
        /* comment */
      }
    `);

		const comments = [];

		root.walkComments((comment) => comments.push(comment));

		assert.equal(comments.length, 3);
		assert.equal(isFirstNested(comments[0]), true);
		assert.equal(isFirstNested(comments[1]), true);
		assert.equal(isFirstNested(comments[2]), true);
	});

	it('returns false with not-first-nested rule', () => {
		const root = postcss.parse(`
      @media (min-width: 0px) {
        a { color: 'pink'; }
        b { color: 'pink'; }
      }
      @media (min-width: 0px) {
        /* comment */
        b { color: 'pink'; }
      }
    `);

		const rules = [];

		root.walkRules('b', (rule) => rules.push(rule));

		assert.equal(rules.length, 2);
		assert.equal(isFirstNested(rules[0]), false);
		assert.equal(isFirstNested(rules[1]), false);
	});

	it('returns false with not-first-nested at-rule', () => {
		const root = postcss.parse(`
      a {
        @include foo;
        @expect bar;
      }
      b {
        /* comment */
        @expect bar;
      }
    `);

		const atRules = [];

		root.walkAtRules('expect', (atRule) => atRules.push(atRule));

		assert.equal(atRules.length, 2);
		assert.equal(isFirstNested(atRules[0]), false);
		assert.equal(isFirstNested(atRules[1]), false);
	});

	it('returns false with not-first-nested declaration', () => {
		const root = postcss.parse(`
      a {
        font-size: 0;
        color: pink;
      }
      b {
        /* comment */
        color: pink;
      }
      c { /* comment */ /* comment */
        /* comment */
        color: pink;
      }
      d { /* shared-line/multi-line
             comment */
        color: pink;
      }
    `);

		const decls = [];

		root.walkDecls('color', (decl) => decls.push(decl));

		assert.equal(decls.length, 4);
		assert.equal(isFirstNested(decls[0]), false);
		assert.equal(isFirstNested(decls[1]), false);
		assert.equal(isFirstNested(decls[2]), false);
		assert.equal(isFirstNested(decls[3]), false);
	});

	it('returns false without a parent', () => {
		const decl = postcss.decl({ prop: 'color', value: 'pink' });

		assert.equal(isFirstNested(decl), false);
	});

	it('returns true with the first-nested declaration in a document', () => {
		const document = postcss.document();

		document.append(postcss.parse('color: pink;'));
		document.append(postcss.parse('color: red; color: blue;'));

		const decls = [];

		document.walkDecls('color', (decl) => decls.push(decl));

		assert.equal(decls.length, 3);
		assert.equal(isFirstNested(decls[0]), true);
		assert.equal(isFirstNested(decls[1]), true);
		assert.equal(isFirstNested(decls[2]), false);
	});
});
