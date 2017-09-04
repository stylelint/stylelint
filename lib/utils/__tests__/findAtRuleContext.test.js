"use strict";

const findAtRuleContext = require("../findAtRuleContext");
const postcss = require("postcss");

it("findAtRuleContext", () => {
  const css = `
    a {}
    @media print {
      b {}
    }
    @media (min-width: 900px) {
      c {}
    }
    d {}
  `;

  return postcss()
    .process(css)
    .then(result => {
      result.root.walkRules(rule => {
        switch (rule.selector) {
          case "a":
            expect(findAtRuleContext(rule)).toBe(null);
            break;
          case "b":
            expect(findAtRuleContext(rule).params).toBe("print");
            break;
          case "c":
            expect(findAtRuleContext(rule).params).toBe("(min-width: 900px)");
            break;
          case "d":
            expect(findAtRuleContext(rule)).toBe(null);
            break;
          default:
        }
      });
    });
});
