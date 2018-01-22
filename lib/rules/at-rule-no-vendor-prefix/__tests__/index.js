"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],
  fix: true,

  accept: [
    {
      code: "@keyframes { 0% { top: 0; } }"
    },
    {
      code: "@viewport { orientation: landscape; }"
    }
  ],

  reject: [
    {
      code:
        "@-webkit-keyframes { 0% { top: 0; } } @keyframes { 0% { top: 0; } }",
      fixed: "@keyframes { 0% { top: 0; } }",
      message: messages.rejected("-webkit-keyframes")
    },
    {
      code: "@-webkit-keyframes { 0% { top: 0; } }",
      fixed: "@keyframes { 0% { top: 0; } }",
      message: messages.rejected("-webkit-keyframes")
    },
    {
      code: "@-wEbKiT-kEyFrAmEs { 0% { top: 0; } }",
      fixed: "@kEyFrAmEs { 0% { top: 0; } }",
      message: messages.rejected("-wEbKiT-kEyFrAmEs")
    },
    {
      code: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
      fixed: "@KEYFRAMES { 0% { top: 0; } }",
      message: messages.rejected("-WEBKIT-KEYFRAMES")
    },
    {
      code: "@-moz-keyframes { 0% { top: 0; } }",
      fixed: "@keyframes { 0% { top: 0; } }",
      message: messages.rejected("-moz-keyframes")
    },
    {
      code: "@-ms-viewport { orientation: landscape; }",
      fixed: "@viewport { orientation: landscape; }",
      message: messages.rejected("-ms-viewport")
    }
  ]
});
