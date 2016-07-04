import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

// All commented tests should uncomment after resolve issue https://github.com/postcss/postcss-selector-parser/issues/71

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,

  accept: [ {
    code: "[title] { }",
  }, {
    code: "a[target=\"_blank\"] { }",
  }, {
    code: "a[ target=\"_blank\" ] { }",
  }, {
    code: "[class|=\"top\"] { }",
  }, /* {
    code: "[class |= \"top\"] { }",
  }, */ {
    code: "[title~=\'text\'] { }",
  }, /* {
    code: "[data-attribute=\'component\'] { }",
  }, */ {
    code: "[frame=\"hsides\" i] { }",
  }, {
    code: "[frame=\'hsides\' i] { }",
  } ],

  reject: [ {
    code: "a[title=flower] { }",
    message: messages.expected("flower"),
    line: 1,
    column: 9,
  }, {
    code: "a[ title=flower ] { }",
    message: messages.expected("flower "),
    line: 1,
    column: 10,
  }, {
    code: "[class^=top] { }",
    message: messages.expected("top"),
    line: 1,
    column: 9,
  }, {
    code: "[class ^= top] { }",
    message: messages.expected(" top"),
    line: 1,
    column: 10,
  }, {
    code: "[frame=hsides i] { }",
    message: messages.expected("hsides"),
    line: 1,
    column: 8,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "[title] { }",
  }, {
    code: "[title=flower] { }",
  }, {
    code: "[class^=top] { }",
  }, {
    code: "[frame=hsides i] { }",
  } ],

  reject: [ {
    code: "a[target=\"_blank\"] { }",
    message: messages.rejected("_blank"),
    line: 1,
    column: 10,
  }, /* {
    code: "a[ target=\"_blank\" ] { }",
    message: messages.rejected("_blank "),
    line: 1,
    column: 11,
  }, */ {
    code: "[class|=\"top\"] { }",
    message: messages.rejected("top"),
    line: 1,
    column: 9,
  }, /* {
    code: "[class |= \"top\"] { }",
    message: messages.rejected(" \"top\""),
    line: 1,
    column: 10,
  }, */ {
    code: "[title~=\'text\'] { }",
    message: messages.rejected("text"),
    line: 1,
    column: 9,
  }, {
    code: "[data-attribute=\'component\'] { }",
    message: messages.rejected("component"),
    line: 1,
    column: 17,
  }, {
    code: "[frame=\"hsides\" i] { }",
    message: messages.rejected("hsides"),
    line: 1,
    column: 8,
  }, {
    code: "[frame=\'hsides\' i] { }",
    message: messages.rejected("hsides"),
    line: 1,
    column: 8,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

  accept: [ {
    code: "[class=\"#{$variable}\"] { }",
  }, {
    code: "[data-attribute^=\'#{$variable}\'] { }",
  } ],

  reject: [ {
    code: "[class=#{$variable}] { }",
    message: messages.expected("#{$variable}"),
    line: 1,
    column: 8,
  }, {
    code: "[class^=#{$variable}] { }",
    message: messages.expected("#{$variable}"),
    line: 1,
    column: 9,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",

  accept: [ {
    code: "[class=#{$variable}] { }",
  }, {
    code: "[data-attribute^=#{$variable}] { }",
  } ],

  reject: [ {
    code: "[class=\"#{$variable}\"] { }",
    message: messages.rejected("#{$variable}"),
    line: 1,
    column: 8,
  }, {
    code: "[data-attribute^=\'#{$variable}\'] { }",
    message: messages.rejected("#{$variable}"),
    line: 1,
    column: 18,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "less",

  accept: [ {
    code: "[class=\"@{variable}\"] { }",
  }, {
    code: "[data-attribute^=\'@{variable}\'] { }",
  } ],

  reject: [ {
    code: "[class=@{variable}] { }",
    message: messages.expected("@{variable}"),
    line: 1,
    column: 8,
  }, {
    code: "[data-attribute^=@{variable}] { }",
    message: messages.expected("@{variable}"),
    line: 1,
    column: 18,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "less",

  accept: [ {
    code: "[class=@{variable}] { }",
  }, {
    code: "[data-attribute^=@{variable}] { }",
  } ],

  reject: [ {
    code: "[class=\"@{variable}\"] { }",
    message: messages.rejected("@{variable}"),
    line: 1,
    column: 8,
  }, {
    code: "[data-attribute^=\'@{variable}\'] { }",
    message: messages.rejected("@{variable}"),
    line: 1,
    column: 18,
  } ],
})
