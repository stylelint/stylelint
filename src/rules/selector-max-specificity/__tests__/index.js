import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["0,3,0"],

  accept: [ {
    code: ".ab {}",
  }, {
    code: ".ab .cd {}",
  }, {
    code: ".ab .cd span {}",
  }, {
    code: ".a .b @nest { span {} }",
  }, {
    code: ".cd div span {}",
  }, {
    code: ".cd .de div span a {}",
  }, {
    code: ".cd .de div span a > b {}",
  }, {
    code: ".cd .de, .cd .ef > b {}",
  } ],

  reject: [ {
    code: "#jubjub {}",
    message: messages.expected("#jubjub", "0,3,0"),
    line: 1,
    column: 1,
  }, {
    code: ".thing div .thing .sausages {}",
    message: messages.expected(".thing div .thing .sausages", "0,3,0"),
    line: 1,
    column: 1,
  }, {
    code: ".a .b .c .d {}",
    message: messages.expected(".a .b .c .d", "0,3,0"),
    line: 1,
    column: 1,
  }, {
    code: ".a .b .c { @nest & .d {} }",
    message: messages.expected(".a .b .c .d", "0,3,0"),
    description: "@nest nesting (nest-prefixed)",
    line: 1,
    column: 18,
  }, {
    code: ".a .b .c { @nest .d & {} }",
    message: messages.expected(".d .a .b .c", "0,3,0"),
    description: "@nest nesting (nest-containing)",
    line: 1,
    column: 18,
  }, {
    code: ".a .b { @nest .c &, .d .e & {} }",
    message: messages.expected(".d .e .a .b", "0,3,0"),
    description: "@nest nesting (nest-containing) list",
    line: 1,
    column: 20,
  }, {
    code: ".thing div .thing, .sausages .burgers .bacon a {}",
    message: messages.expected(".sausages .burgers .bacon a", "0,3,0"),
    line: 1,
    column: 20,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["0,2,1"],

  accept: [ {
    code: ".cd .de,\n.cd .ef > b {}",
  }, {
    code: ".cd { .de {} }",
    description: "standard nesting",
  }, {
    code: "div:hover { .de {} }",
    description: "element, pseudo-class, nested class",
  }, {
    code: ".ab, .cd { & > .de {} }",
    description: "initial (unnecessary) parent selector",
  }, {
    code: ".cd { .de > & {} }",
    description: "necessary parent selector",
  }, {
    code: ".cd { @media print { .de {} } }",
    description: "nested rule within nested media query",
  }, {
    code: "@media print { .cd { .de {} } }",
    description: "media query > rule > rule",
  } ],

  reject: [ {
    code: ".thing div .thing,\n.sausages .burgers .bacon a {}",
    message: messages.expected(".sausages .burgers .bacon a", "0,2,1"),
    line: 2,
    column: 1,
  }, {
    code: ".cd { .de { .fg {} } }",
    message: messages.expected(".cd .de .fg", "0,2,1"),
  }, {
    code: ".cd { .de { & > .fg {} } }",
    message: messages.expected(".cd .de > .fg", "0,2,1"),
  }, {
    code: ".cd { .de { &:hover > .fg {} } }",
    message: messages.expected(".cd .de:hover > .fg", "0,2,1"),
  }, {
    code: ".cd { .de { .fg > & {} } }",
    message: messages.expected(".fg > .cd .de", "0,2,1"),
  }, {
    code: ".cd { @media print { .de { & + .fg {} } } }",
    message: messages.expected(".cd .de + .fg", "0,2,1"),
  }, {
    code: "@media print { li { & + .ab, .ef.ef { .cd {} } } }",
    message: messages.expected("li .ef.ef .cd", "0,2,1"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["0,4,1"],

  accept: [{
    code: ".cd .de {& .fg {}}",
  }],

  reject: [ {
    code: ".thing .thing2 {&.nested {#pop {}}}",
    message: messages.expected(".thing .thing2.nested #pop", "0,4,1"),
    line: 1,
    column: 27,
  }, {
    code: ".thing .thing2 {#here & {}}",
    message: messages.expected("#here .thing .thing2", "0,4,1"),
    line: 1,
    column: 17,
  }, {
    code: ".thing .thing2 .thing3 .thing4 {a.here & {}}",
    message: messages.expected("a.here .thing .thing2 .thing3 .thing4", "0,4,1"),
    line: 1,
    column: 33,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["0,1,1"],
  syntax: "scss",

  accept: [{
    code: "#hello #{$test} {}",
    description: "ignore rules with variable interpolation",
  }],
})

testRule(rule, {
  ruleName,
  config: ["0,1,1"],
  syntax: "less",

  accept: [{
    code: "#hello @{test} {}",
    description: "ignore rules with variable interpolation",
  }],
})
