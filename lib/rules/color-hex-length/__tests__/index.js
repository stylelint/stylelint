"use strict";

const mergeTestDescriptions = require("../../../testUtils/mergeTestDescriptions");

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

const sharedTests = {
  accept: [
    {
      code: "a { border-#$side: 0; }",
      description: "ignore sass-like interpolation"
    },
    {
      code: "a { box-sizing: #$type-box; }",
      description: "ignore sass-like interpolation"
    }
  ]
};

testRule(
  rule,
  mergeTestDescriptions(sharedTests, {
    ruleName,
    config: ["short"],

    accept: [
      {
        code: "a { color: pink; }"
      },
      {
        code: "a { color: #000; }"
      },
      {
        code: "a { color: #FFF; }"
      },
      {
        code: "a { color: #fFf; }",
        description: "mixed case"
      },
      {
        code: "a { color: #fffa; }"
      },
      {
        code: "a { something: #000, #fff, #aba; }"
      },
      {
        code: "a { color: #ff; }",
        description: "invalid short"
      },
      {
        code: "a { color: #ffffffa; }",
        description: "invalid long"
      },
      {
        code: "a { color: #fffffffffff; }",
        description: "invalid extra long"
      },
      {
        code: "a { padding: 000000; }"
      },
      {
        code: 'a::before { content: "#ABABAB"; }'
      },
      {
        code: "a { color: white /* #FFFFFF */; }"
      },
      {
        code: "a { background: url(somefile.swvg#abcdef)}"
      }
    ],

    reject: [
      {
        code: "a { color: #FFFFFF; }",
        message: messages.expected("#FFFFFF", "#FFF"),
        line: 1,
        column: 12
      },
      {
        code: "a { color: #FfaAFF; }",
        message: messages.expected("#FfaAFF", "#FaF"),
        line: 1,
        column: 12
      },
      {
        code: "a { color: #00aa00aa; }",
        message: messages.expected("#00aa00aa", "#0a0a"),
        line: 1,
        column: 12
      },
      {
        code: "a { something: #fff, #aba, #00ffAAaa; }",
        message: messages.expected("#00ffAAaa", "#0fAa"),
        line: 1,
        column: 28
      }
    ]
  })
);

testRule(
  rule,
  mergeTestDescriptions(sharedTests, {
    ruleName,
    config: ["long"],

    accept: [
      {
        code: "a { color: pink; }"
      },
      {
        code: "a { color: #000000; }"
      },
      {
        code: "a { color: #FFFFFF; }"
      },
      {
        code: "a { color: #fFfFfF; }",
        description: "mixed case"
      },
      {
        code: "a { color: #ffffffaa; }"
      },
      {
        code: "a { something: #000000, #ffffff, #ababab; }"
      },
      {
        code: "a { color: #ff; }",
        description: "invalid short"
      },
      {
        code: "a { color: #ffffffa; }",
        description: "invalid long"
      },
      {
        code: "a { color: #fffffffffff; }",
        description: "invalid extra long"
      },
      {
        code: "a { padding: 000; }"
      },
      {
        code: 'a::before { content: "#ABA"; }'
      },
      {
        code: "a { color: white /* #FFF */; }"
      },
      {
        code: "a { background: url(somefile.swvg#abc)}"
      }
    ],

    reject: [
      {
        code: "a { color: #FFF; }",
        message: messages.expected("#FFF", "#FFFFFF"),
        line: 1,
        clumn: 12
      },
      {
        code: "a { color: #Ffa; }",
        message: messages.expected("#Ffa", "#FFffaa"),
        line: 1,
        clumn: 12
      },
      {
        code: "a { color: #0a0a; }",
        message: messages.expected("#0a0a", "#00aa00aa"),
        line: 1,
        clumn: 12
      },
      {
        code: "a { something: #ffffff, #aabbaa, #0fAa; }",
        message: messages.expected("#0fAa", "#00ffAAaa"),
        line: 1,
        clumn: 34
      }
    ]
  })
);
