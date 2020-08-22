'use strict';

const isFirstNested = require('../isFirstNested');
const postcss = require('postcss');

describe('isFirstNested', () => {
	it('returns false with the first node', () => {
		const root = postcss.parse(`
      a { color: 'pink'; }
    `);

		expect(isFirstNested(root.nodes[0])).toBe(false);
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

		expect(rules).toHaveLength(2);
		expect(isFirstNested(rules[0])).toBe(true);
		expect(isFirstNested(rules[1])).toBe(true);
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

		expect(atRules).toHaveLength(2);
		expect(isFirstNested(atRules[0])).toBe(true);
		expect(isFirstNested(atRules[1])).toBe(true);
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

		expect(decls).toHaveLength(2);
		expect(isFirstNested(decls[0])).toBe(true);
		expect(isFirstNested(decls[1])).toBe(true);
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

		expect(comments).toHaveLength(3);
		expect(isFirstNested(comments[0])).toBe(true);
		expect(isFirstNested(comments[1])).toBe(true);
		expect(isFirstNested(comments[2])).toBe(true);
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

		expect(rules).toHaveLength(2);
		expect(isFirstNested(rules[0])).toBe(false);
		expect(isFirstNested(rules[1])).toBe(false);
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

		expect(atRules).toHaveLength(2);
		expect(isFirstNested(atRules[0])).toBe(false);
		expect(isFirstNested(atRules[1])).toBe(false);
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

		expect(decls).toHaveLength(4);
		expect(isFirstNested(decls[0])).toBe(false);
		expect(isFirstNested(decls[1])).toBe(false);
		expect(isFirstNested(decls[2])).toBe(false);
		expect(isFirstNested(decls[3])).toBe(false);
	});
});
