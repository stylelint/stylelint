"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a { color: #fff; } b { color: #000; }",
  }, {
    code: "a {\n  background-image: url(../images/white.png);\n  color: #fff;\n}",
  } ],

  reject: [ {
    code: "h1 {\n  color: black;\n  color: #010101;\n}",
    message: messages.rejected("#010101", "black"),
    line: 3,
    column: 10,
  }, {
    code: "h1 {\n  color: rgb(0, 0, 0);\n  color: #010101;\n}",
    message: messages.rejected("#010101", "rgb(0, 0, 0)"),
    line: 3,
    column: 10,
  }, {
    code: "h1 {\n  color: black;\n  color: rgb(0, 0, 0);\n}",
    message: messages.rejected("rgb(0, 0, 0)", "black"),
    line: 3,
    column: 10,
  }, {
    code: `@-webkit-keyframes spin {
      /* This comment used to break things */
      0% {
        -webkit-transform: rotate(0deg);
        color: #010101;
      }
      100% {
        -webkit-transform: rotate(360deg);
        /* It should still pick this one up */
        background: #000000;
      }
    }`,

    message: messages.rejected("#000000", "#010101"),
    line: 10,
    column: 21,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { whitelist: [[ "#000000", "#020202" ]] } ],
  skipBasicChecks: true,

  reject: [{
    code: ".classname {\n  background-image: -webkit-linear-gradient(rgba(0,0,0,1), #020202);\n  color: #000000;\n}",
    message: messages.rejected("#000000", "rgba(0,0,0,1)"),
    line: 3,
    column: 10,
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: ["#000000"] } ],
  skipBasicChecks: true,

  accept: [{
    code: "h1 {\n  color: black;\n  color: #010101;\n}",
  }],
})

testRule(rule, {
  ruleName,
  config: [ true, { threshold: 0 } ],
  skipBasicChecks: true,

  accept: [{
    code: "h1 {\n  color: black;\n  color: #010101;\n}",
  }],
})
