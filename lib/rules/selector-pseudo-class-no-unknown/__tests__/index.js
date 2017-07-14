"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [
    {
      code: "a:hover { }"
    },
    {
      code: "a:Hover { }"
    },
    {
      code: "a:hOvEr { }"
    },
    {
      code: "a:HOVER { }"
    },
    {
      code: "a:before { }"
    },
    {
      code: "a::before { }"
    },
    {
      code: "input:not([type='submit']) { }"
    },
    {
      code: ":matches(section, article, aside, nav) h1 { }"
    },
    {
      code: "section:has(h1, h2, h3, h4, h5, h6) { }"
    },
    {
      code: ":root { }"
    },
    {
      code: "p:has(img):not(:has(:not(img))) { }"
    },
    {
      code: "div.sidebar:has(*:nth-child(5)):not(:has(*:nth-child(6))) { }"
    },
    {
      code: "div :nth-child(2 of .widget) { }"
    },
    {
      code: "a:hover::before { }"
    },
    {
      code: "a:-moz-placeholder { }"
    },
    {
      code: "a,\nb > .foo:hover { }"
    },
    {
      code: ":--heading { }"
    },
    {
      code: "::-webkit-scrollbar-thumb:window-inactive { }"
    },
    {
      code: "@page :first { }"
    },
    {
      code: "@page :blank:left { }"
    },
    {
      code: "@page foo:left { }"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    }
  ],

  reject: [
    {
      code: "a:unknown { }",
      message: messages.rejected(":unknown"),
      line: 1,
      column: 2
    },
    {
      code: "a:Unknown { }",
      message: messages.rejected(":Unknown"),
      line: 1,
      column: 2
    },
    {
      code: "a:uNkNoWn { }",
      message: messages.rejected(":uNkNoWn"),
      line: 1,
      column: 2
    },
    {
      code: "a:UNKNOWN { }",
      message: messages.rejected(":UNKNOWN"),
      line: 1,
      column: 2
    },
    {
      code: "a:pseudo-class { }",
      message: messages.rejected(":pseudo-class"),
      line: 1,
      column: 2
    },
    {
      code: "a:unknown::before { }",
      message: messages.rejected(":unknown"),
      line: 1,
      column: 2
    },
    {
      code: "a,\nb > .foo:error { }",
      message: messages.rejected(":error"),
      line: 2,
      column: 9
    },
    {
      code: "::-webkit-unknown:window-inactive { }",
      message: messages.rejected(":window-inactive"),
      line: 1,
      column: 18
    },
    {
      code: ":first { }",
      message: messages.rejected(":first"),
      line: 1,
      column: 1
    },
    {
      code: "@page :blank:unknown { }",
      message: messages.rejected(":unknown"),
      line: 1,
      column: 13
    },
    {
      code: "@page foo:unknown { }",
      message: messages.rejected(":unknown"),
      line: 1,
      column: 10
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: ":#{$variable} {}"
    },
    {
      code: ":#{$VARIABLE} {}"
    },
    {
      code: "a:#{$variable} {}"
    },
    {
      code: '@directive ":foo";'
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: "a { &:extend(.extended); }"
    },
    {
      code: "a { &:extend(.extended all); }"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignorePseudoClasses: ["unknown", "/^my-/", "/^YOUR-/i"] }],
  skipBasicChecks: true,

  accept: [
    {
      code: "a:unknown { }"
    },
    {
      code: "a:my-pseudo { }"
    },
    {
      code: "a:YOUR-pseudo { }"
    },
    {
      code: "a:your-pseudo { }"
    },
    {
      code: "@page :unknown { }"
    }
  ],

  reject: [
    {
      code: "a:uNkNoWn { }",
      message: messages.rejected(":uNkNoWn"),
      line: 1,
      column: 2
    },
    {
      code: "a:UNKNOWN { }",
      message: messages.rejected(":UNKNOWN"),
      line: 1,
      column: 2
    },
    {
      code: "a:MY-other-pseudo { }",
      message: messages.rejected(":MY-other-pseudo"),
      line: 1,
      column: 2
    },
    {
      code: "a:pseudo-class { }",
      message: messages.rejected(":pseudo-class"),
      line: 1,
      column: 2
    },
    {
      code: "a:not-my-pseudo { }",
      message: messages.rejected(":not-my-pseudo"),
      line: 1,
      column: 2
    },
    {
      code: "@page :not-my-pseudo { }",
      message: messages.rejected(":not-my-pseudo"),
      line: 1,
      column: 7
    }
  ]
});
