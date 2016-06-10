import { testRule } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,

  config: [[
    "extend",
    "supports",
    "keyframes",
  ]],

  accept: [ {
    code: "a { color: pink; }",
    description: "Some random code.",
  }, {
    code: "@mixin name ($p) {}",
    description: "@rule not from a blacklist.",
  } ],

  reject: [ {
    code: "a { @extend %placeholder; }",
    message: messages.rejected("extend"),
    line: 1,
    description: "@rule from a blacklist, is a Sass directive.",
  }, {
    code: `
      a {
        @extend
        %placeholder;
      }
    `,
    message: messages.rejected("extend"),
    line: 3,
    description: "@rule from a blacklist; newline after its name.",
  }, {
    code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
    message: messages.rejected("keyframes"),
    line: 2,
    description: "@rule from a blacklist; independent rule.",
  }, {
    code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
    message: messages.rejected("Keyframes"),
    line: 2,
    description: "@rule from a blacklist; independent rule; messed case.",
  }, {
    code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
    message: messages.rejected("-moz-keyframes"),
    line: 2,
    description: "@rule from a blacklist; independent rule; has vendor prefix.",
  } ],
})
