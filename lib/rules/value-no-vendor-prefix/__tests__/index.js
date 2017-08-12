"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: ".foo { display: flex; }"
    },
    {
      code: ".foo { background: linear-gradient(to top, #000, #fff); }"
    },
    {
      code: ".foo { max-width: max-content; }"
    },
    {
      code: ".foo { -webkit-transform: translate(0, 0); }",
      description: "ignores property vendor prefixes"
    },
    {
      code: ".foo { -wEbKiT-tRaNsFoRm: translate(0, 0); }",
      description: "ignores property vendor prefixes"
    },
    {
      code: ".foo { -WEBKIT-TRANSFORM: translate(0, 0); }",
      description: "ignores property vendor prefixes"
    }
  ],

  reject: [
    {
      code: ".foo { display: -webkit-flex; }",
      message: messages.rejected("-webkit-flex"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { display: -wEbKiT-fLeX; }",
      message: messages.rejected("-wEbKiT-fLeX"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { display: -WEBKIT-FLEX; }",
      message: messages.rejected("-WEBKIT-FLEX"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { dIsPlAy: -webkit-flex; }",
      message: messages.rejected("-webkit-flex"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { DISPLAY: -webkit-flex; }",
      message: messages.rejected("-webkit-flex"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { color: pink; display: -webkit-flex; }",
      message: messages.rejected("-webkit-flex"),
      line: 1,
      column: 30
    },
    {
      code: ".foo { display: -webkit-box; }",
      message: messages.rejected("-webkit-box"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { background: -webkit-linear-gradient(bottom, #000, #fff); }",
      message: messages.rejected("-webkit-linear-gradient"),
      line: 1,
      column: 20
    },
    {
      code: ".foo { max-width: -moz-max-content; }",
      message: messages.rejected("-moz-max-content"),
      line: 1,
      column: 19
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "a { $margin: -webkit-box; }"
    },
    {
      code: "a { margin: $variable-webkit-variable; }"
    },
    {
      code: "a { margin: #{$variable-webkit-variable}; }"
    },
    {
      code: "a { #{$display}: -webkit-box; }"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "less",

  accept: [
    {
      code: "@new-color: -webkit-function(@color, 10%);"
    },
    {
      code: "a { margin: @variable-webkit-variable; }"
    }
  ]
});
