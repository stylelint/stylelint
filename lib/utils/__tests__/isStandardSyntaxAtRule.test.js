"use strict";

const isStandardSyntaxAtRule = require("../isStandardSyntaxAtRule");
const less = require("postcss-less");
const postcss = require("postcss");
const scss = require("postcss-scss");

describe("isStandardSyntaxAtRule", () => {
  it("non nested at-rules without quotes", () => {
    return atRules("@charset UTF-8;", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("non nested at-rules with `'` quotes", () => {
    return atRules("@charset 'UTF-8';", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it('non nested at-rules with `"` quotes', () => {
    return atRules('@charset "UTF-8";', atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("non nested at-rules with `'` quotes and without space after name", () => {
    return atRules("@charset'UTF-8';", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it('non nested at-rules with `"` quotes and without space after name', () => {
    return atRules('@charset"UTF-8";', atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("non nested at-rules with function and without space after name", () => {
    return atRules('@import url("fineprint.css") print;', atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("nested at-rules", () => {
    return atRules("@media (min-width: 100px) {};", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("nested at-rules with newline after name", () => {
    return atRules("@media\n(min-width: 100px) {};", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("nested at-rules with newline after name", () => {
    return atRules("@media\r\n(min-width: 100px) {};", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("nested at-rules without space after name", () => {
    return atRules("@media(min-width: 100px) {};", atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeTruthy();
    });
  });

  it("ignore `@content` inside mixins", () => {
    const scss = "@mixin mixin() { @content; };";
    return scssAtRules(scss, atRule => {
      if (atRule.name === "mixin") {
        return;
      }
      expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
    });
  });

  it("ignore passing rulesets to mixins", () => {
    const less =
      "@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }";
    return lessAtRules(less, atRule => {
      expect(isStandardSyntaxAtRule(atRule)).toBeFalsy();
    });
  });
});

function atRules(css, cb) {
  return postcss()
    .process(css, { from: undefined })
    .then(result => {
      return result.root.walkAtRules(cb);
    });
}

function scssAtRules(css, cb) {
  return postcss()
    .process(css, { syntax: scss, from: undefined })
    .then(result => {
      return result.root.walkAtRules(cb);
    });
}

function lessAtRules(css, cb) {
  return postcss()
    .process(css, { syntax: less, from: undefined })
    .then(result => {
      return result.root.walkAtRules(cb);
    });
}
