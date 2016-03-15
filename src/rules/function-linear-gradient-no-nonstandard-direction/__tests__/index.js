/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/mochaStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [{
    code: ".foo { background: linear-gradient(to top, #fff, #000; )}",
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
  }],

  reject: [{
    code: ".foo { background: linear-gradient(bottom, #fff, #000; )}",
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
  }],
})