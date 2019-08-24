"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,

  accept: [
    {
      code: "\uFEFF",
      description: "empty with BOM"
    },
    {
      code: "\uFEFFa{}",
      description: "with BOM"
    }
  ],

  reject: [
    {
      code: "",
      description: "empty without BOM",
      message: messages.expected
    },
    {
      code: "a{}",
      description: "without BOM",
      message: messages.expected
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  skipBasicChecks: true,

  accept: [
    {
      code: "",
      description: "empty without BOM"
    },
    {
      code: "a{}",
      description: "without BOM"
    }
  ],

  reject: [
    {
      code: "\uFEFF",
      description: "empty with BOM",
      message: messages.rejected
    },
    {
      code: "\uFEFFa{}",
      description: "with BOM",
      message: messages.rejected
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "html",
  config: ["always"],
  skipBasicChecks: true,

  accept: [
    {
      code: '<a style="color: red;"></a>',
      description: "without BOM"
    },
    {
      code: '<a style="\uFEFFcolor: red;"></a>',
      description: "with BOM"
    },
    {
      code: `<style>a{}</style>`,
      description: "without BOM"
    },
    {
      code: `<style>\uFEFFa{}</style>`,
      description: "with BOM"
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "html",
  config: ["never"],
  skipBasicChecks: true,

  accept: [
    {
      code: '<a style="color: red;"></a>',
      description: "without BOM"
    },
    {
      code: '<a style="\uFEFFcolor: red;"></a>',
      description: "with BOM"
    },
    {
      code: `<style>a{}</style>`,
      description: "without BOM"
    },
    {
      code: `<style>\uFEFFa{}</style>`,
      description: "with BOM"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  syntax: "css-in-js",

  accept: [
    {
      code: `export default (
        <button
          style={{ color: "#fff" }}
        >
        </button>
      );`
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  skipBasicChecks: true,
  syntax: "css-in-js",

  accept: [
    {
      code: `export default (
        <button
          style={{ color: "#fff" }}
        >
        </button>
      );`
    }
  ]
});
