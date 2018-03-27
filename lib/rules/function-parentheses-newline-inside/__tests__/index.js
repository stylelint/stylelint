"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: 'a::before { content: "(a) ( a)"; }'
    },
    {
      code: "a::before { background: url(\n'asdf( Vcxvsd)ASD'\n); }"
    },
    {
      code: "a { transform: translate(\n1, 1\n); }"
    },
    {
      code: "a { transform: translate(\n\n1, 1\n\n); }"
    },
    {
      code: "a { transform: translate(\r\n1, 1\r\n); }",
      description: "CRLF"
    },
    {
      code: "a { transform: translate(\r\n\r\n1, 1\r\n\r\n); }",
      description: "CRLF"
    },
    {
      code: "a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }"
    },
    {
      code: "$map: (key: value,key2: value2)",
      description: "Sass map ignored"
    },
    {
      code: "$list: (value, value2)",
      description: "Sass list ignored"
    }
  ],

  reject: [
    {
      code: "a { transform: translate(1, 1\n); }",
      message: messages.expectedOpening,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(\n1, 1); }",
      message: messages.expectedClosing,
      line: 2,
      column: 4
    },
    {
      code: "a { transform: translate(  1, 1\n); }",
      message: messages.expectedOpening,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(\n1,\n1\t); }",
      message: messages.expectedClosing,
      line: 3,
      column: 2
    },
    {
      code: "a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }",
      message: messages.expectedOpening,
      line: 1,
      column: 18
    },
    {
      code: "a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }",
      message: messages.expectedOpening,
      line: 4,
      column: 13
    },
    {
      code: "a::before { content: attr(data-foo\n); }",
      message: messages.expectedOpening,
      line: 1,
      column: 27
    },
    {
      code: "a::before { content: attr(\n\tdata-foo); }",
      message: messages.expectedClosing,
      line: 2,
      column: 9
    },
    {
      code: "a { transform: translate(  1,\n  1\n); }",
      message: messages.expectedOpening,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(1,\r\n1\n); }",
      description: "CRLF",
      message: messages.expectedOpening,
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [
    {
      code: 'a::before { content: "(a) ( a)"; }'
    },
    {
      code: "a::before { background: url(\n'asdf( Vcxvsd)ASD'\n); }"
    },
    {
      code: "a { transform: translate(\n1, 1\n); }"
    },
    {
      code: "a { transform: translate(\r\n1, 1\r\n); }",
      description: "CRLF"
    },
    {
      code: "a { color: color(\nrgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }"
    },
    {
      code: "a { transform: translate(1, 1); }"
    },
    {
      code: "a { transform: translate(  1, 1\t); }"
    },
    {
      code: "$map: (key: value,\nkey2: value2)",
      description: "SCSS map"
    }
  ],

  reject: [
    {
      code: "a { transform: translate(1, 1\n); }",
      message: messages.expectedOpeningMultiLine,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(\n1, 1); }",
      message: messages.expectedClosingMultiLine,
      line: 2,
      column: 4
    },
    {
      code: "a { transform: translate(  1, 1\n); }",
      message: messages.expectedOpeningMultiLine,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(\n1,\n1\t); }",
      message: messages.expectedClosingMultiLine,
      line: 3,
      column: 2
    },
    {
      code: "a { color: color(rgb(\n0, 0, 0\n) lightness(\n50%\n)\n); }",
      message: messages.expectedOpeningMultiLine,
      line: 1,
      column: 18
    },
    {
      code: "a { color: color(\nrgb(\n0, 0, 0\n) lightness(50%\n)\n); }",
      message: messages.expectedOpeningMultiLine,
      line: 4,
      column: 13
    },
    {
      code: "a::before { content: attr(data-foo\n); }",
      message: messages.expectedOpeningMultiLine,
      line: 1,
      column: 27
    },
    {
      code: "a::before { content: attr(\n\tdata-foo); }",
      message: messages.expectedClosingMultiLine,
      line: 2,
      column: 9
    },
    {
      code: "a { transform: translate(  1,\n  1\n); }",
      message: messages.expectedOpeningMultiLine,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(1,\r\n1\n); }",
      description: "CRLF",
      message: messages.expectedOpeningMultiLine,
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [
    {
      code: 'a::before { content: "(a) ( a)"; }'
    },
    {
      code: "a::before { background: url('asdf(Vcxv\nsd\n)ASD'); }"
    },
    {
      code: "a { transform: translate(1, 1); }"
    },
    {
      code: "a { transform: translate(1,\r\n1); }",
      description: "CRLF"
    },
    {
      code: "a { color: color(rgb(0, 0, 0) lightness(50%)); }"
    },
    {
      code: "a { transform: translate(1,\n  1); }"
    },
    {
      code: "a { transform: translate(1,\n\t\t1); }"
    },
    {
      code: "$map: (\nkey: value,\nkey2: value2\n)",
      description: "SCSS map"
    }
  ],

  reject: [
    {
      code: "a { transform: translate(\n  1,\n  1); }",
      message: messages.rejectedOpeningMultiLine,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(  \n  1,\n  1); }",
      message: messages.rejectedOpeningMultiLine,
      line: 1,
      column: 26
    },
    {
      code: "a { transform: translate(1,\n  1\n); }",
      message: messages.rejectedClosingMultiLine,
      line: 2,
      column: 4
    },
    {
      code: "a { transform: translate(1,\r\n1\t); }",
      message: messages.rejectedClosingMultiLine,
      line: 2,
      column: 2
    },
    {
      code: "a { color: color(rgb(0,\r\n  0,\r\n  0\r\n) lightness(50%)); }",
      message: messages.rejectedClosingMultiLine,
      line: 3,
      column: 5
    },
    {
      code: "a { color: color(rgb(0, 0, 0) lightness(\n50%)); }",
      message: messages.rejectedOpeningMultiLine,
      line: 1,
      column: 41
    }
  ]
});
