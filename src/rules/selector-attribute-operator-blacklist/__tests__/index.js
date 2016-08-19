import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,

  config: [[
    "*=",
    "~=",
  ]],

  accept: [ {
    code: "a[target] { }",
  }, {
    code: "a[target=\"_blank\"] { }",
  }, {
    code: "[class|=\"top\"] { }",
  }, {
    code: "[class^=top] { }",
  }, {
    code: "[class$=\"test\"] { }",
  } ],

  reject: [ {
    code: "[title~=\"flower\"] { }",
    message: messages.rejected("~="),
    line: 1,
    column: 7,
  }, {
    code: "[ title~=\"flower\" ] { }",
    message: messages.rejected("~="),
    line: 1,
    column: 8,
  }, {
    code: "[title ~= \"flower\"] { }",
    message: messages.rejected("~="),
    line: 1,
    column: 8,
  }, {
    code: "[class*=te] { }",
    message: messages.rejected("*="),
    line: 1,
    column: 7,
  } ],
})

testRule(rule, {
  ruleName,

  config: ["*="],

  accept: [{
    code: "a[target=\"_blank\"] { }",
  }],

  reject: [{
    code: "[title*=\"foo\"] { }",
    message: messages.rejected("*="),
    line: 1,
    column: 7,
  }],
})
