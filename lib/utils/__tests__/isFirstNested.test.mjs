import { describe, it } from 'node:test';

import isFirstNested from '../isFirstNested.mjs';
import postcss from 'postcss';

describe('isFirstNested', () => {
	it('returns false with the first node', (t) => {
		const root = postcss.parse(`
      a { color: 'pink'; }
    `);

		t.assert.strictEqual(isFirstNested(root.nodes[0]), false);
	});

	it('returns true with the first-nested rule', (t) => {
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

		t.assert.strictEqual(rules.length, 2);
		t.assert.strictEqual(isFirstNested(rules[0]), true);
		t.assert.strictEqual(isFirstNested(rules[1]), true);
	});

	it('returns true with the first-nested at-rule', (t) => {
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

		t.assert.strictEqual(atRules.length, 2);
		t.assert.strictEqual(isFirstNested(atRules[0]), true);
		t.assert.strictEqual(isFirstNested(atRules[1]), true);
	});

	it('returns true with the first-nested declaration', (t) => {
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

		t.assert.strictEqual(decls.length, 2);
		t.assert.strictEqual(isFirstNested(decls[0]), true);
		t.assert.strictEqual(isFirstNested(decls[1]), true);
	});

	it('returns true with first-nested non-statement', (t) => {
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

		t.assert.strictEqual(comments.length, 3);
		t.assert.strictEqual(isFirstNested(comments[0]), true);
		t.assert.strictEqual(isFirstNested(comments[1]), true);
		t.assert.strictEqual(isFirstNested(comments[2]), true);
	});

	it('returns false with not-first-nested rule', (t) => {
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

		t.assert.strictEqual(rules.length, 2);
		t.assert.strictEqual(isFirstNested(rules[0]), false);
		t.assert.strictEqual(isFirstNested(rules[1]), false);
	});

	it('returns false with not-first-nested at-rule', (t) => {
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

		t.assert.strictEqual(atRules.length, 2);
		t.assert.strictEqual(isFirstNested(atRules[0]), false);
		t.assert.strictEqual(isFirstNested(atRules[1]), false);
	});

	it('returns false with not-first-nested declaration', (t) => {
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

		t.assert.strictEqual(decls.length, 4);
		t.assert.strictEqual(isFirstNested(decls[0]), false);
		t.assert.strictEqual(isFirstNested(decls[1]), false);
		t.assert.strictEqual(isFirstNested(decls[2]), false);
		t.assert.strictEqual(isFirstNested(decls[3]), false);
	});

	it('returns false without a parent', (t) => {
		const decl = postcss.decl({ prop: 'color', value: 'pink' });

		t.assert.strictEqual(isFirstNested(decl), false);
	});

	it('returns true with the first-nested declaration in a document', (t) => {
		const document = postcss.document();

		document.append(postcss.parse('color: pink;'));
		document.append(postcss.parse('color: red; color: blue;'));

		const decls = [];

		document.walkDecls('color', (decl) => decls.push(decl));

		t.assert.strictEqual(decls.length, 3);
		t.assert.strictEqual(isFirstNested(decls[0]), true);
		t.assert.strictEqual(isFirstNested(decls[1]), true);
		t.assert.strictEqual(isFirstNested(decls[2]), false);
	});
});
