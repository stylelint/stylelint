"use strict";

const isStandardSyntaxCombinator = require("../isStandardSyntaxCombinator");
const postcss = require("postcss");
const selectorParser = require("postcss-selector-parser");

describe("isStandardSyntaxCombinator", () => {
  it("tag", () => {
    return rules("a {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("descendant", () => {
    return rules("a b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("descendant tab", () => {
    return rules("a\tb {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("descendant newline", () => {
    return rules("a\nb {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("descendant (double child)", () => {
    return rules("a >> b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("child", () => {
    return rules("a > b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("next sibling", () => {
    return rules("a + b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("subsequent-sibling", () => {
    return rules("a ~ b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeTruthy();
    });
  });
  it("lowercase reference", () => {
    return rules("a /for/ b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeFalsy();
    });
  });
  it("mixedcase reference", () => {
    return rules("a /fOr/ b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeFalsy();
    });
  });
  it("uppercase reference", () => {
    return rules("a /FOR/ b {}", func => {
      expect(isStandardSyntaxCombinator(func)).toBeFalsy();
    });
  });
});

function rules(css, cb) {
  return postcss()
    .process(css, {
      from: undefined
    })
    .then(result => {
      return result.root.walkRules(rule => {
        selectorParser(selectorAST => {
          selectorAST.walkCombinators(cb);
        }).processSync(rule.selector);
      });
    });
}
