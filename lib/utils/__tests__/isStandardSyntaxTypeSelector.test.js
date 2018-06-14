"use strict";

const isStandardSyntaxTypeSelector = require("../isStandardSyntaxTypeSelector");
const postcss = require("postcss");
const selectorParser = require("postcss-selector-parser");

describe("isStandardSyntaxTypeSelector", () => {
  it("tag", () => {
    return rules("a {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeTruthy();
    });
  });
  it("lowercase nth-child pseudo selector", () => {
    return rules(".foo:nth-child(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("mixedcase nth-child pseudo selector", () => {
    return rules(".foo:nTh-ChIlD(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("uppercase nth-child pseudo selector", () => {
    return rules(".foo:NTH-CHILD(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("nth-last-child pseudo selector", () => {
    return rules(".foo:nth-last-child(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("nth-of-type pseudo selector", () => {
    return rules(".foo:nth-of-type(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("lowercase lang pseudo selector", () => {
    return rules(":lang(en) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("mixedcase lang pseudo selector", () => {
    return rules(":lAnG(en) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("uppercase lang pseudo selector", () => {
    return rules(":LANG(en) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("dir pseudo selector", () => {
    return rules(":dir(ltr) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("nesting selector", () => {
    return rules(".foo { &-bar {} }", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("nesting selector", () => {
    return rules(".foo { &__bar {} }", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("placeholder selector", () => {
    return rules("%foo {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("shadow-piercing descendant combinator", () => {
    return rules(".foo /deep/ .bar {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("lowercase reference combinators", () => {
    return rules(".foo /for/ .bar {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("mixedcase reference combinators", () => {
    return rules(".foo /fOr/ .bar {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("uppercase reference combinators", () => {
    return rules(".foo /FOR/ .bar {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
  it("variable selector", () => {
    return rules("$variable {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
    });
  });
});

function rules(css, cb) {
  return postcss()
    .process(css, { from: undefined })
    .then(result => {
      return result.root.walkRules(rule => {
        selectorParser(selectorAST => {
          selectorAST.walkTags(cb);
        }).processSync(rule.selector);
      });
    });
}
