"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [0],
  skipBasicChecks: true,

  accept: [
    {
      code: "",
      description: "empty stylesheet"
    },
    {
      code: "a {}",
      description: "empty rule"
    },
    {
      code: '@import "foo.css";',
      description: "blockless statement"
    },
    {
      code: "a {}",
      description: "selector with no pseudo class"
    },
    {
      code: ".foo { .bar { .baz {} } }",
      description: "nested selectors with no pseudo classes"
    }
  ],

  reject: [
    {
      code: ":global {}",
      message: messages.expected(":global", 0)
    },
    {
      code: "a:first-child {}",
      message: messages.expected("a:first-child", 0)
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [1],
  skipBasicChecks: true,

  accept: [
    {
      code: "a:first-child {}",
      description: "selector with one pseudo class"
    },
    {
      code: ".foo .bar:first-child {}",
      description: "compound selectors with one pseudo class"
    },
    {
      code: ".foo > .bar:first-child {}",
      description: "parent selector with one pseudo class"
    },
    {
      code: ".foo:last-child { .bar:first-child { .baz:visited {} } }",
      description: "nested selectors each with one pseudo class"
    },
    {
      code: "a::before:hover {}",
      description: "selector a pseudo element and a pseudo class"
    },
    {
      code: ".foo:hover, \n.bar:hover {}",
      description: "multiple selectors: fewer than max pseudo classes"
    },
    {
      code: "a:not(:first-child) {}",
      description: "two selectors with one pseudo class each"
    }
  ],

  reject: [
    {
      code: "a:first:focus {}",
      message: messages.expected("a:first:focus", 1)
    },
    {
      code: "a::before:first:focus {}",
      message: messages.expected("a::before:first:focus", 1)
    },
    {
      code: ".foo .bar:first-child:hover {}",
      message: messages.expected(".foo .bar:first-child:hover", 1)
    },
    {
      code: ".foo > bar:nth-child(2):focus {}",
      message: messages.expected(".foo > bar:nth-child(2):focus", 1)
    },
    {
      code: "input[type=file]:first-of-type:focus {}",
      message: messages.expected("input[type=file]:first-of-type:focus", 1)
    },
    {
      code: "a:not(:first-child:lang(en)) {}",
      message: messages.expected(":first-child:lang(en)", 1)
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: "a:first:hover {}",
      description: "selector with two pseudo classes"
    }
  ],

  reject: [
    {
      code: "input:first-of-type:read-only:hover {}",
      message: messages.expected("input:first-of-type:read-only:hover", 2)
    }
  ]
});
