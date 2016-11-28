"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

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
  } ],

  reject: [ {
    code: ".foo { background: linear-gradient(bottom, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: lInEaR-gRaDiEnT(bottom, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: LINEAR-GRADIENT(bottom, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(bOtToM, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(BOTTOM, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(top, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(left, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(right, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(to top top, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(45, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(0.25, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: linear-gradient(1.577, #fff, #000; )}",
    message: messages.rejected,
  }, {
    code: ".foo { background: -webkit-linear-gradient(to bottom, #fff, #000 ); }",
    message: messages.rejected,
  }, {
    code: ".foo { background: -moz-linear-gradient(to bottom, #fff, #000 ); }",
    message: messages.rejected,
  }, {
    code: ".foo { background: -o-linear-gradient(to bottom, #fff, #000 ); }",
    message: messages.rejected,
  } ],
})
