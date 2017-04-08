"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ".foo { background: linear-gradient(to top, #fff, #000; )}",
  }, {
    code: ".foo { background: lInEaR-gRaDiEnT(to top, #fff, #000; )}",
  }, {
    code: ".foo { background: LINEAR-GRADIENT(to top, #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(to bottom, #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(  to right, #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(to left  , #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient( to top left, #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(\n\tto left top, \n\t#fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(to bottom right, #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(to right bottom, #fff, #000; )}",
  }, {
    code: ".foo { background: linear-gradient(45deg, #fff, #000); }",
  }, {
    code: ".foo { background: linear-gradient(100grad, #fff, #000); }",
  }, {
    code: ".foo { background: linear-gradient(0.25turn, #fff, #000); }",
  }, {
    code: ".foo { background: linear-gradient(1.57rad, #fff, #000); }",
  }, {
    code: ".foo { background: linear-gradient(#fff, #000); }",
  }, {
    code: ".foo { background: linear-gradient(black, white); }",
  }, {
    code: ".foo { background: linear-gradient(rgba(255, 255, 255, 0.5) 0%, #000); }",
  }, {
    code: ".foo { background: -webkit-linear-gradient(top, #fff, #000); }",
  }, {
    code: ".foo { background: -moz-linear-gradient(top, #fff, #000); }",
  }, {
    code: ".foo { background: -o-linear-gradient(top, #fff, #000); }",
  }, {
    code: ".foo { background: url(foo.png), -webkit-linear-gradient(bottom, #fff, #000 ); }",
  }, {
    code: ".foo { background: -webkit-linear-gradient(bottom, #fff, #000 ), url(foo.png); }",
  }, {
    code: ".foo { background: url(foo.png), -moz-linear-gradient(bottom, #fff, #000 ); }",
  }, {
    code: ".foo { background: -moz-linear-gradient(bottom, #fff, #000 ), url(foo.png); }",
  }, {
    code: ".foo { background: url(foo.png), -o-linear-gradient(bottom, #fff, #000 ); }",
  }, {
    code: ".foo { background: -o-linear-gradient(bottom, #fff, #000 ), url(foo.png); }",
  }, {
    code: ".foo { background: url(foo.png), -webkit-linear-gradient(bottom, #fff, #000 ), url(bar.png); }",
  }, {
    code: ".foo { background: url(foo.png), -moz-linear-gradient(bottom, #fff, #000 ), url(bar.png); }",
  }, {
    code: ".foo { background: url(foo.png), -o-linear-gradient(bottom, #fff, #000 ), url(bar.png); }",
  } ],

  reject: [ {
    code: ".foo { background: linear-gradient(bottom, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: lInEaR-gRaDiEnT(bottom, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: LINEAR-GRADIENT(bottom, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(bOtToM, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(BOTTOM, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(top, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(left, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(right, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(to top top, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(45, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(0.25, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: linear-gradient(1.577, #fff, #000; )}",
    message: messages.rejected,
    line: 1,
    column: 36,
  }, {
    code: ".foo { background: -webkit-linear-gradient(to bottom, #fff, #000 ); }",
    message: messages.rejected,
    line: 1,
    column: 44,
  }, {
    code: ".foo { background: -moz-linear-gradient(to bottom, #fff, #000 ); }",
    message: messages.rejected,
    line: 1,
    column: 41,
  }, {
    code: ".foo { background: -o-linear-gradient(to bottom, #fff, #000 ); }",
    message: messages.rejected,
    line: 1,
    column: 39,
  }, {
    code: ".foo { background: url(foo.png), -webkit-linear-gradient(to bottom, #fff, #000); }",
    message: messages.rejected,
    line: 1,
    column: 58,
  }, {
    code: ".foo { background: url(foo.png), -moz-linear-gradient(to bottom, #fff, #000); }",
    message: messages.rejected,
    line: 1,
    column: 55,
  }, {
    code: ".foo { background: url(foo.png), -o-linear-gradient(to bottom, #fff, #000); }",
    message: messages.rejected,
    line: 1,
    column: 53,
  }, {
    code: ".foo { background: -webkit-linear-gradient(to bottom, #fff, #000), url(foo.png); }",
    message: messages.rejected,
    line: 1,
    column: 44,
  }, {
    code: ".foo { background: url(foo.png), -moz-linear-gradient(to bottom, #fff, #000), url(foo.png); }",
    message: messages.rejected,
    line: 1,
    column: 55,
  }, {
    code: ".foo { background: -o-linear-gradient(to bottom, #fff, #000 ), url(foo.png); }",
    message: messages.rejected,
    line: 1,
    column: 39,
  }, {
    code: ".foo { background: url(foo.png), -webkit-linear-gradient(to bottom, #fff, #000), url(bar.png); }",
    message: messages.rejected,
    line: 1,
    column: 58,
  }, {
    code: ".foo { background: url(foo.png), -moz-linear-gradient(to bottom, #fff, #000), url(bar.png); }",
    message: messages.rejected,
    line: 1,
    column: 55,
  }, {
    code: ".foo { background: url(foo.png), -o-linear-gradient(to bottom, #fff, #000), url(bar.png); }",
    message: messages.rejected,
    line: 1,
    column: 53,
  } ],
})
