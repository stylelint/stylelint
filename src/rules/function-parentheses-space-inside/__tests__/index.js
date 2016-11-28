const messages = require("..").messages\nconst ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a::before { content: \"(a) ( a )\"; }",
  }, {
    code: "a::before { background: url( 'asdf(Vcxvsd)ASD' ); }",
  }, {
    code: "a { transform: translate( 1, 1 ); }",
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness( 50% ) ); }",
  }, {
    code: "$map: (key: value, key2: value2)",
    description: "SCSS map",
  }, {
    code: "$list: (value, value2)",
    description: "Sass list ignored",
  } ],

  reject: [ {
    code: "a { transform: translate(1, 1 ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate( 1, 1); }",
    message: messages.expectedClosing,
    line: 1,
    column: 30,
  }, {
    code: "a { transform: translate(  1, 1 ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate( 1, 1  ); }",
    message: messages.expectedClosing,
    line: 1,
    column: 32,
  }, {
    code: "a { color: color(rgb( 0, 0, 0 ) lightness( 50% ) ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 18,
  }, {
    code: "a { color: color( rgb(0, 0, 0 ) lightness( 50% ) ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 23,
  }, {
    code: "a { color: color( rgb( 0, 0, 0) lightness( 50% ) ); }",
    message: messages.expectedClosing,
    line: 1,
    column: 30,
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness(50% ) ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 44,
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness( 50%) ); }",
    message: messages.expectedClosing,
    line: 1,
    column: 47,
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness( 50% )); }",
    message: messages.expectedClosing,
    line: 1,
    column: 49,
  }, {
    code: "a::before { content: attr(data-foo ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 27,
  }, {
    code: "a::before { content: attr( data-foo); }",
    message: messages.expectedClosing,
    line: 1,
    column: 35,
  }, {
    code: "a { transform: translate(\n  1,\n  1 ); }",
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate( 1,\n  1\n\t); }",
    message: messages.expectedClosing,
    line: 3,
    column: 1,
  }, {
    code: "a { transform: translate(1,\r\n1 ); }",
    description: "CRLF",
    message: messages.expectedOpening,
    line: 1,
    column: 26,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [ {
    code: "a::before { content: \"(a) ( a )\"; }",
  }, {
    code: "a::before { background: url( 'asdf(Vcxvsd)ASD' ); }",
  }, {
    code: "a { transform: translate( 1, 1 ); }",
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness( 50% ) ); }",
  }, {
    code: "a { transform: translate(\n  1,\n  1\n); }",
  }, {
    code: "a { transform: translate(  \n  1,\n  1\n\t); }",
  }, {
    code: "a { transform: translate(1,\r\n1); }",
    description: "CRLF",
  }, {
    code: "a { color: color(rgb(0,\n0,\n0 ) lightness( 50% )); }",
  }, {
    code: "$map: (key: value, key2: value2)",
    description: "SCSS map",
  } ],

  reject: [ {
    code: "a { color: color(rgb(0,\n0,\n0 ) lightness(50% )); }",
    message: messages.expectedOpeningSingleLine,
    line: 3,
    column: 15,
  }, {
    code: "a { transform: translate(1, 1 ); }",
    message: messages.expectedOpeningSingleLine,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate( 1, 1); }",
    message: messages.expectedClosingSingleLine,
    line: 1,
    column: 30,
  }, {
    code: "a { transform: translate(  1, 1 ); }",
    message: messages.expectedOpeningSingleLine,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate( 1, 1  ); }",
    message: messages.expectedClosingSingleLine,
    line: 1,
    column: 32,
  }, {
    code: "a { color: color(rgb( 0, 0, 0 ) lightness( 50% ) ); }",
    message: messages.expectedOpeningSingleLine,
    line: 1,
    column: 18,
  }, {
    code: "a { color: color( rgb(0, 0, 0 ) lightness( 50% ) ); }",
    message: messages.expectedOpeningSingleLine,
    line: 1,
    column: 23,
  }, {
    code: "a { color: color( rgb( 0, 0, 0) lightness( 50% ) ); }",
    message: messages.expectedClosingSingleLine,
    line: 1,
    column: 30,
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness(50% ) ); }",
    message: messages.expectedOpeningSingleLine,
    line: 1,
    column: 44,
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness( 50%) ); }",
    message: messages.expectedClosingSingleLine,
    line: 1,
    column: 47,
  }, {
    code: "a { color: color( rgb( 0, 0, 0 ) lightness( 50% )); }",
    message: messages.expectedClosingSingleLine,
    line: 1,
    column: 49,
  }, {
    code: "a::before { content: attr(data-foo ); }",
    message: messages.expectedOpeningSingleLine,
    line: 1,
    column: 27,
  }, {
    code: "a::before { content: attr( data-foo); }",
    message: messages.expectedClosingSingleLine,
    line: 1,
    column: 35,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "a::before { content: \"(a) ( a )\"; }",
  }, {
    code: "a::before { background: url('asdf( Vcxvsd )ASD'); }",
  }, {
    code: "a::before { content: \"(a) ( a )\"; }",
  }, {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness(50%)); }",
  }, {
    code: "$map: ( key: value, key2: value2 )",
    description: "SCSS map",
  } ],

  reject: [ {
    code: "a { transform: translate( 1, 1); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(  1, 1); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(1, 1 ); }",
    message: messages.rejectedClosing,
    line: 1,
    column: 30,
  }, {
    code: "a { transform: translate(1, 1  ); }",
    message: messages.rejectedClosing,
    line: 1,
    column: 31,
  }, {
    code: "a { color: color( rgb(0, 0, 0) lightness(50%)); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 18,
  }, {
    code: "a { color: color(rgb( 0, 0, 0) lightness(50%)); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 22,
  }, {
    code: "a { color: color(rgb(0, 0, 0 ) lightness(50%)); }",
    message: messages.rejectedClosing,
    line: 1,
    column: 29,
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness( 50%)); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 41,
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness(50% )); }",
    message: messages.rejectedClosing,
    line: 1,
    column: 44,
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness(50%) ); }",
    message: messages.rejectedClosing,
    line: 1,
    column: 45,
  }, {
    code: "a::before { content: attr(data-foo ); }",
    message: messages.rejectedClosing,
    line: 1,
    column: 35,
  }, {
    code: "a::before { content: attr( data-foo); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate( 1,\n1); }",
    message: messages.rejectedOpening,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(1,\r\n  1\r\n); }",
    description: "CRLF",
    message: messages.rejectedClosing,
    line: 2,
    column: 5,
  }, {
    code: "a { color: color(rgb(0,\n0,\n0 ) lightness(50%)); }",
    message: messages.rejectedClosing,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [ {
    code: "a::before { content: \"(a) ( a )\"; }",
  }, {
    code: "a::before { background: url('asdf( Vcxvsd )ASD'); }",
  }, {
    code: "a::before { content: \"(a) ( a )\"; }",
  }, {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness(50%)); }",
  }, {
    code: "a { transform: translate( 1,\n1 ); }",
  }, {
    code: "a { transform: translate(\r\n  1,\r\n  1\r\n); }",
    description: "CRLF",
  }, {
    code: "a { color: color(rgb(0,\n0,\n0 ) lightness(50%)); }",
  }, {
    code: "$map: ( key: value, key2: value2 )",
    description: "SCSS map",
  } ],

  reject: [ {
    code: "a { color: color(rgb(0,\n0,\n0) lightness( 50%)); }",
    message: messages.rejectedOpeningSingleLine,
    line: 3,
    column: 14,
  }, {
    code: "a { transform: translate( 1, 1); }",
    message: messages.rejectedOpeningSingleLine,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(  1, 1); }",
    message: messages.rejectedOpeningSingleLine,
    line: 1,
    column: 26,
  }, {
    code: "a { transform: translate(1, 1 ); }",
    message: messages.rejectedClosingSingleLine,
    line: 1,
    column: 30,
  }, {
    code: "a { transform: translate(1, 1  ); }",
    message: messages.rejectedClosingSingleLine,
    line: 1,
    column: 31,
  }, {
    code: "a { color: color( rgb(0, 0, 0) lightness(50%)); }",
    message: messages.rejectedOpeningSingleLine,
    line: 1,
    column: 18,
  }, {
    code: "a { color: color(rgb( 0, 0, 0) lightness(50%)); }",
    message: messages.rejectedOpeningSingleLine,
    line: 1,
    column: 22,
  }, {
    code: "a { color: color(rgb(0, 0, 0 ) lightness(50%)); }",
    message: messages.rejectedClosingSingleLine,
    line: 1,
    column: 29,
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness( 50%)); }",
    message: messages.rejectedOpeningSingleLine,
    line: 1,
    column: 41,
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness(50% )); }",
    message: messages.rejectedClosingSingleLine,
    line: 1,
    column: 44,
  }, {
    code: "a { color: color(rgb(0, 0, 0) lightness(50%) ); }",
    message: messages.rejectedClosingSingleLine,
    line: 1,
    column: 45,
  }, {
    code: "a::before { content: attr(data-foo ); }",
    message: messages.rejectedClosingSingleLine,
    line: 1,
    column: 35,
  }, {
    code: "a::before { content: attr( data-foo); }",
    message: messages.rejectedOpeningSingleLine,
    line: 1,
    column: 27,
  } ],
})
