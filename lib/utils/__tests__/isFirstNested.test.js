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

		root.walkRules((rule) => {
			expect(isFirstNested(rule)).toBe(true);
		});
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

		root.walkAtRules((atRule) => {
			expect(isFirstNested(atRule)).toBe(true);
		});
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

		root.walkDecls((atRule) => {
			expect(isFirstNested(atRule)).toBe(true);
		});
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

		root.walkComments((comment) => {
			expect(isFirstNested(comment)).toBe(true);
		});
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

		root.walkRules('b', (rule) => {
			expect(isFirstNested(rule)).toBe(false);
		});
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

		root.walkAtRules('expect', (atRule) => {
			expect(isFirstNested(atRule)).toBe(false);
		});
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

		root.walkDecls('color', (atRule) => {
			expect(isFirstNested(atRule)).toBe(false);
		});
	});
});
