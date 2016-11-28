"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [ {
    code: "",
  }, {
    code: "@import \"foo.css\";",
  }, {
    code: "#foo {}",
  }, {
    code: ".foo {}",
  }, {
    code: "[foo] {}",
  }, {
    code: ".foo { & {} }",
  }, {
    code: ".foo { &.bar {} }",
  }, {
    code: ".foo { &-bar {} }",
  }, {
    code: ".foo { &__bar {} }",
  }, {
    code: ".foo { [&] {} }",
  }, {
    code: ".foo { & [class*=bar] {} }",
  }, {
    code: ".foo { @nest & {} }",
  }, {
    code: ".foo:nth-child(3n + 1) {}",
  }, {
    code: ".foo:nth-child(n) {}",
  }, {
    code: ".foo:nth-child(odd) {}",
  }, {
    code: ".foo:nth-child(even) {}",
  }, {
    code: ".foo:nth-child(-n) {}",
  }, {
    code: ".foo { &:nth-child(3n + 1) {} }",
  }, {
    code: "@keyframes spin { 0% {} }",
  }, {
    code: "@keyframes spin { to {} from {} }",
  }, {
    code: "@include keyframes(identifier) { to, 50.0% {} 50.01% {} 100% {} }",
    description: "non-standard usage of keyframe selectors",
  }, {
    code: ":root { --custom-property-set: {} }",
  } ],

  reject: [ {
    code: "foo {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".bar > foo {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "foo.bar {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: ".foo, .bar, foo.baz {}",
    message: messages.rejected,
    line: 1,
    column: 13,
  }, {
    code: ".foo { div {} }",
    description: "nested descendant",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: ".foo { .baz, div {} }",
    description: "nested selector list of descendants",
    message: messages.rejected,
    line: 1,
    column: 14,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: ["descendant"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: ".foo div {}",
  }, {
    code: ".foo > div {}",
  }, {
    code: ".foo + div {}",
  }, {
    code: "#bar div.foo {}",
    description: "compounded and descendant",
  }, {
    code: ".foo { div {} }",
    description: "nested descendant",
  }, {
    code: ".foo { div, a {} }",
    description: "nested selector list of descendants",
  } ],

  reject: [ {
    code: "div {}",
    message: messages.rejected,
  }, {
    code: ".foo, div {}",
    message: messages.rejected,
  }, {
    code: "div.foo {}",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: ["compounded"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "div.foo {}",
  }, {
    code: "div#foo {}",
  }, {
    code: "div[something] {}",
  }, {
    code: "#bar div.foo {}",
    description: "compounded and descendant",
  } ],

  reject: [ {
    code: "div {}",
    message: messages.rejected,
  }, {
    code: ".foo, div {}",
    message: messages.rejected,
  }, {
    code: ".foo div {}",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: [ "compounded", "descendant" ] } ],
  skipBasicChecks: true,

  accept: [{
    code: "#bar div.foo {}",
    description: "compounded and descendant",
  }],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [{ code: "// Comment\n.c {}" }],

  reject: [{
    code: "@for $n from 1 through 5 { .foo-#{$n} { div { content: \"#{$n}\"; } } }",
    description: "ignore sass interpolation inside @for for nested descendant",
    line: 1,
    column: 41,
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: ["descendant"] } ],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [{
    code: "@for $n from 1 through 5 { .foo-#{$n} { div { content: \"#{$n}\"; } } }",
    description: "ignore sass interpolation inside @for for nested descendant",
  }],
})

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [{ code: "// Comment\n.c {}" }],

  reject: [{
    code: ".for(@n: 1) when (@n <= 5) { .foo-@{n} { div { content: \"@{n}\"; } } .for (@n + 1); }",
    description: "ignore less interpolation inside @for for nested descendant",
    line: 1,
    column: 42,
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: ["descendant"] } ],
  skipBasicChecks: true,
  syntax: "less",

  accept: [{
    code: ".for(@n: 1) when (@n <= 5) { .foo-@{n} { div { content: \"@{n}\"; } } .for (@n + 1); }",
    description: "ignore less interpolation inside @for for nested descendant",
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignoreTypes: [ "fieldset", "/^my-/" ] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "fieldset {}",
  }, {
    code: "my-type {}",
  }, {
    code: "my-other-type {}",
  } ],

  reject: [ {
    code: "a {}",
    line: 1,
    column: 1,
  }, {
    code: "not-my-type {}",
    message: messages.rejected,
    line: 1,
    column: 1,
  } ],
})
