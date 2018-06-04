"use strict";

const mergeTestDescriptions = require("../../../testUtils/mergeTestDescriptions");

const rule = require("..");
const { messages, ruleName } = rule;

const sharedTests = {
  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "a { color: rgba(0, 0, 0, 0); }"
    },
    {
      code: "a { something: black, white, gray; }"
    },
    {
      code: "a { padding: 000; }"
    },
    {
      code: 'a::before { content: "#ababa"; }'
    },
    {
      code: "a { border-#$side: 0; }",
      description: "ignore sass-like interpolation"
    },
    {
      code: "a { box-sizing: #$type-box; }",
      description: "ignore sass-like interpolation"
    },
    {
      code:
        "@font-face {\n" +
        "font-family: dashicons;\n" +
        'src: url(data:application/font-woff;charset=utf-8;base64, ABCDEF==) format("woff"),\n' +
        'url(../fonts/dashicons.ttf) format("truetype"),\n' +
        'url(../fonts/dashicons.svg#dashicons) format("svg");\n' +
        "font-weight: normal;\n" +
        "font-style: normal;\n" +
        "}"
    }
  ]
};

testRule(
  rule,
  mergeTestDescriptions(sharedTests, {
    ruleName,
    config: [true],
    fix: true,
    reject: [
      {
        code: "a { color: #12345; }",
        message: messages.rejected("#12345"),
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { color: #123456a; }",
        message: messages.rejected("#123456a"),
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { color: #cccccc; }",
        message: messages.rejected("#cccccc"),
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { something: #00c, red, white; }",
        message: messages.rejected("#00c"),
        line: 1,
        column: 16,
        unfixable: true
      },
      {
        code: "a { something: black, #fff1a1, rgb(250, 250, 0); }",
        message: messages.rejected("#fff1a1"),
        line: 1,
        column: 23,
        unfixable: true
      },
      {
        code: "a { something:black,white,#12345a; }",
        message: messages.rejected("#12345a"),
        line: 1,
        column: 27,
        unfixable: true
      },
      {
        code: "a { color: #ffff; }",
        message: messages.rejected("#ffff"),
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { color: #ffffffaa; }",
        message: messages.rejected("#ffffffaa"),
        line: 1,
        column: 12,
        unfixable: true
      }
    ]
  })
);

testRule(
  rule,
  mergeTestDescriptions(sharedTests, {
    ruleName,
    config: ["rgb"],
    fix: true,
    reject: [
      {
        code: "a { color: #12345; }",
        message: messages.rejected("#12345"),
        description: "Invalid Hex with Fix Option will be rejected",
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { color: #123456a; }",
        message: messages.rejected("#123456a"),
        description: "Invalid Hex with Fix Option will be rejected",
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { something: #00c, red, white; }",
        message: messages.rejected("#00c"),
        line: 1,
        column: 16,
        fixed: "a { something: rgb(0, 0, 204), red, white; }"
      },
      {
        code: "a { something:black,white,#12345a; }",
        message: messages.rejected("#12345a"),
        line: 1,
        column: 27,
        fixed: "a { something:black,white,rgb(18, 52, 90); }"
      },
      {
        code: "a { color: #ffff; }",
        message: messages.rejected("#ffff"),
        line: 1,
        column: 12,
        fixed: "a { color: rgb(255, 255, 255); }"
      },
      {
        code: "a { color: #ffffffaa; }",
        message: messages.rejected("#ffffffaa"),
        line: 1,
        column: 12,
        fixed: "a { color: rgba(255, 255, 255, 0.67); }"
      }
    ]
  })
);

testRule(
  rule,
  mergeTestDescriptions(sharedTests, {
    ruleName,
    config: ["hsl"],
    fix: true,
    reject: [
      {
        code: "a { color: #12345; }",
        message: messages.rejected("#12345"),
        description: "Invalid Hex with Fix Option will be rejected",
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { color: #123456a; }",
        message: messages.rejected("#123456a"),
        description: "Invalid Hex with Fix Option will be rejected",
        line: 1,
        column: 12,
        unfixable: true
      },
      {
        code: "a { something: #00c, red, white; }",
        message: messages.rejected("#00c"),
        line: 1,
        column: 16,
        fixed: "a { something: hsl(240, 100%, 40%), red, white; }"
      },
      {
        code: "a { something:black,white,#12345a; }",
        message: messages.rejected("#12345a"),
        line: 1,
        column: 27,
        fixed:
          "a { something:black,white,hsl(211.70000000000005, 66.7%, 21.2%); }"
      },
      {
        code: "a { color: #ffff; }",
        message: messages.rejected("#ffff"),
        line: 1,
        column: 12,
        fixed: "a { color: hsl(0, 0%, 100%); }"
      },
      {
        code: "a { color: #ffffffaa; }",
        message: messages.rejected("#ffffffaa"),
        line: 1,
        column: 12,
        fixed: "a { color: hsla(0, 0%, 100%, 0.67); }"
      }
    ]
  })
);
