"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,

  config: ["extend", "import", "keyframes"],

  accept: [
    {
      code: "a { color: pink; }",
      description: "Some random code."
    },
    {
      code: "a { @extend %placeholder; }",
      description: "@rule from a whitelist, is a Sass directive."
    },
    {
      code: `
      a {
        @extend
        %placeholder;
      }
    `,
      description: "@rule from a whitelist; newline after its name."
    },
    {
      code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description: "@rule from a whitelist; independent rule."
    },
    {
      code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description: "@rule from a whitelist; independent rule; messed case."
    },
    {
      code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description:
        "@rule from a whitelist; independent rule; has vendor prefix."
    },
    {
      code: `
      @-WEBKET-KEYFRAMES name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description:
        "@rule from a whitelist; independent rule; has vendor prefix."
    }
  ],

  reject: [
    {
      code: `
      @mixin name () {}
    `,
      line: 2,
      columt: 7,
      message: messages.rejected("mixin"),
      description: "@rule not from a whitelist; independent rule."
    }
  ]
});

testRule(rule, {
  ruleName,
  skipBasicChecks: true,

  config: ["keyframes"],

  accept: [
    {
      code: `
      @keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description: "@rule from a whitelist; independent rule."
    },
    {
      code: `
      @Keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description: "@rule from a whitelist; independent rule; messed case."
    },
    {
      code: `
      @-moz-keyframes name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description:
        "@rule from a whitelist; independent rule; has vendor prefix."
    },
    {
      code: `
      @-WEBKET-KEYFRAMES name {
        from { top: 10px; }
        to { top: 20px; }
      }
    `,
      description:
        "@rule from a whitelist; independent rule; has vendor prefix."
    }
  ],

  reject: [
    {
      code: `
      @mixin name ($p) {}
    `,
      message: messages.rejected("mixin"),
      line: 2,
      column: 7,
      description: "@rule not from a whitelist."
    },
    {
      code: "@import 'path/to/file.css';",
      message: messages.rejected("import"),
      line: 1,
      column: 1,
      description: "@rule not from a whitelist."
    },
    {
      code: "@media screen and (max-witdh: 1000px) {}",
      message: messages.rejected("media"),
      line: 1,
      column: 1,
      description: "@rule not from a whitelist."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["media"],
  syntax: "less",

  accept: [
    {
      code: "@import 'x.css';",
      description: "ignore less @imports"
    }
  ]
});
