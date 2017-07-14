"use strict";

const mergeTestDescriptions = require("../../../testUtils/mergeTestDescriptions");

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");
const stripIndent = require("common-tags").stripIndent;

const rule = rules[ruleName];

const basicAZTests = {
  accept: [
    {
      code: "a {}"
    },
    {
      code: "a {} b {}"
    },
    {
      code: "@media print { a {} b {} }"
    },
    {
      code: "a { B {} }"
    },
    {
      code: "a { DIV { SPAN {} } }"
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
      code: "a { b {} }",
      message: messages.expected("b"),
      line: 1,
      column: 5
    },
    {
      code: stripIndent`
      a {
        DIV {
          span {}
        }
      }`,
      message: messages.expected("span"),
      line: 3,
      column: 5
    },
    {
      code: "@media print { a { b {} } }",
      message: messages.expected("b"),
      line: 1,
      column: 20
    }
  ]
};

testRule(
  rule,
  mergeTestDescriptions(basicAZTests, {
    ruleName,
    config: [/^[A-Z]+$/]
  })
);

testRule(
  rule,
  mergeTestDescriptions(basicAZTests, {
    ruleName,
    config: ["^[A-Z]+$"]
  })
);

testRule(rule, {
  ruleName,
  config: ["^&:(?:hover|focus)$"],

  accept: [
    {
      code: ".foo { &:hover {} }"
    },
    {
      code: ".foo { &:focus {} }"
    },
    {
      code: ".foo { &:hover {} &:focus {} }"
    }
  ],

  reject: [
    {
      code: ".foo { .bar {} }",
      message: messages.expected(".bar"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { .bar:hover {} }",
      message: messages.expected(".bar:hover"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { &:hover, &focus {} }",
      message: messages.expected("&:hover, &focus"),
      line: 1,
      column: 8
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [/^[A-Z]+$/],

  accept: [
    {
      code: "a { &:#{something} {}}",
      description: "ignore Sass interpolation"
    }
  ]
});
