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
      code: "@media (min-resolution: 96dpi) {}"
    },
    {
      code: "@media (device-pixel-ratio: 2) {}"
    }
  ],

  reject: [
    {
      code:
        "@media (min-resolution: 96dpi), (-webkit-min-device-pixel-ratio: 1`) {}",
      fixed: "@media (min-resolution: 96dpi) {}",
      message: messages.rejected("-webkit-min-device-pixel-ratio"),
      line: 1,
      column: 34
    },
    {
      code: "@media (-webkit-min-device-pixel-ratio: 1) {}",
      fixed: "@media (min-resolution: 1dppx) {}",
      message: messages.rejected("-webkit-min-device-pixel-ratio"),
      line: 1,
      column: 9
    },
    {
      code: "@media (-wEbKiT-mIn-DeViCe-PiXeL-rAtIo: 1) {}",
      fixed: "@media (min-resolution: 1dppx) {}",
      message: messages.rejected("-wEbKiT-mIn-DeViCe-PiXeL-rAtIo"),
      line: 1,
      column: 9
    },
    {
      code: "@media (-WEBKIT-MIN-DEVICE-PIXEL-RATIO: 1) {}",
      fixed: "@media (min-resolution: 1dppx) {}",
      message: messages.rejected("-WEBKIT-MIN-DEVICE-PIXEL-RATIO"),
      line: 1,
      column: 9
    },
    {
      code: "@media\n\t(-moz-min-device-pixel-ratio: 1) {}",
      fixed: "@media\n\t(min-resolution: 1dppx) {}",
      message: messages.rejected("-moz-min-device-pixel-ratio"),
      line: 2,
      column: 3
    },
    {
      code: "@media   (-o-max-device-pixel-ratio: 1/1) {}",
      fixed: "@media   (max-resolution: 1dppx) {}",
      message: messages.rejected("-o-max-device-pixel-ratio"),
      line: 1,
      column: 11
    }
  ]
});
