import { testRule } from "../../../testUtils"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a {} b a {}",
  }, {
    code: "a {} a b {}",
  }, {
    code: "a {} a + a {}",
  }, {
    code: "a {} a[foo] {}",
  }, {
    code: "a[foo] {} a {}",
    description: "only checks matching last compound selectors",
  }, {
    code: "a { b {} } c + b {}",
  }, {
    code: "b a {} @media print { a {} }",
  }, {
    code: "a {} a::after {}",
    description: "pseudo-element last",
  }, {
    code: "a {} a:hover {}",
    description: "pseudo-class last",
  }, {
    code: "a:hover {} a:hover::before {}",
  }, {
    code: ".m:hover {} .b {}",
  }, {
    code: ".menu:hover {} .burger {}",
  }, {
    code: ".foo.bar, .foo.bar:focus { @mixin: foo; } .baz.bar, .baz.bar:focus {}",
  } ],

  reject: [ {
    code: "b a {} a {}",
    message: messages.rejected("a", "b a"),
    line: 1,
    column: 8,
  }, {
    code: "a + a {} a {}",
    message: messages.rejected("a", "a + a"),
    line: 1,
    column: 10,
  }, {
    code: "b > a[foo] {} a[foo] {}",
    message: messages.rejected("a[foo]", "b > a[foo]"),
    line: 1,
    column: 15,
  }, {
    code: "e > f, b + e + a {} c {} a d {} z, f + a, y {}",
    message: messages.rejected("f + a", "b + e + a"),
    line: 1,
    column: 36,
  }, {
    code: "e > f, b + e + a {} c {} a d {} z, f + a, y {}",
    message: messages.rejected("f + a", "b + e + a"),
    line: 1,
    column: 36,
  }, {
    code: "a { & > b {} } b {}",
    message: messages.rejected("b", "a > b"),
    line: 1,
    column: 16,
  }, {
    code: "b a {} @media print { #c a {} a {} }",
    message: messages.rejected("a", "#c a"),
    line: 1,
    column: 31,
  }, {
    code: "a::before {} a {} ",
    description: "pseudo-element first",
    message: messages.rejected("a", "a::before"),
    line: 1,
    column: 14,
  }, {
    code: "a:hover {} a {} ",
    description: "pseudo-class first",
    message: messages.rejected("a", "a:hover"),
    line: 1,
    column: 12,
  }, {
    code: "a:hover::before {} a:hover {} ",
    message: messages.rejected("a:hover", "a:hover::before"),
    line: 1,
    column: 20,
  } ],
})
