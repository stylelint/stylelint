/* @flow */
"use strict";

const isFirstNested = require("../isFirstNested");
const postcss = require("postcss");

describe("isFirstNested", () => {
  it("returns false with the first node", () => {
    const root = postcss.parse(`
      a { color: 'pink'; }
    `);
    expect(isFirstNested(root.nodes[0])).toBe(false);
  });

  it("returns true with the first-nested rule", () => {
    const root = postcss.parse(`
      @media (min-width: 0px) {
        a { color: 'pink'; }
      }
    `);

    root.walkRules(rule => {
      expect(isFirstNested(rule)).toBe(true);
    });
  });

  it("returns true with the first-nested at-rule", () => {
    const root = postcss.parse(`
      a {
        @include foo;
      }
    `);

    root.walkAtRules(atRule => {
      expect(isFirstNested(atRule)).toBe(true);
    });
  });

  it("returns true with first-nested non-statement", () => {
    const root = postcss.parse(`
      a {
        /* comment */
      }
    `);

    root.walkComments(comment => {
      expect(isFirstNested(comment)).toBe(true);
    });
  });

  it("returns false with not-first-nested rule", () => {
    const root = postcss.parse(`
      @media (min-width: 0px) {
        a { color: 'pink'; }
        b { color: 'pink'; }
      }
    `);

    root.walkRules("b", rule => {
      expect(isFirstNested(rule)).toBe(false);
    });
  });

  it("returns false with not-first-nested at-rule", () => {
    const root = postcss.parse(`
      a {
        @include foo;
        @expect bar;
      }
    `);

    root.walkAtRules("expect", atRule => {
      expect(isFirstNested(atRule)).toBe(false);
    });
  });
});
