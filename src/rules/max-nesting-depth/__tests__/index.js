import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [1],

  accept: [ {
    code: "a { b { top: 0; }}",
  }, {
    code: "@media print { a { b { top: 0; }}}",
  }, {
    code: "a { top: 0; b { top: 0; }}",
  }, {
    code: "a { @nest b { top: 0; }}",
  }, {
    code: "a { b { @include foo; } }",
    description: "at-rule without block",
  } ],

  reject: [ {
    code: "a { b { c { top: 0; }}}",
    message: messages.rejected(1),
  }, {
    code: "@media print { a { b { c { top: 0; }}}}",
    message: messages.rejected(1),
  }, {
    code: "a { top: 0; b { top: 0; c { top: 0; }}}",
    message: messages.rejected(1),
  }, {
    code: "a { b { top: 0; c { top: 0; }} top: 0; }",
    message: messages.rejected(1),
  }, {
    code: "a { @nest b { c { top: 0; }}}",
    message: messages.rejected(1),
  } ],
})

testRule(rule, {
  ruleName,
  config: [3],

  accept: [ {
    code: "a { b { c { d { top: 0; }}}}",
  }, {
    code: "@media print { a { b { c { d { top: 0; }}}}}",
  }, {
    code: "a { & > b { @media print { color: pink; }}}",
  }, {
    code: "a { & > b { & > c { @media print { color: pink; }}}}",
    description: messages.rejected(3),
  } ],

  reject: [{
    code: "a { b { c { d { e { top: 0; }}}}}",
    message: messages.rejected(3),
  }],
})

testRule(rule, {
  ruleName,
  config: [ 1, { ignore: ["at-rules-without-declaration-blocks"] } ],

  accept: [ {
    code: "a { b { top: 0; }}",
  }, {
    code: "a { @media print { b { top: 0; }}}",
  }, {
    code: "a { @nest b { c { top: 0; }}}",
  } ],

  reject: [ {
    code: "a { b { c { top: 0; }}}",
    message: messages.rejected(1),
  }, {
    code: "a { @media print { b { c { top: 0; }}}}",
    message: messages.rejected(1),
  }, {
    code: "a { @nest b { @nest c { top: 0; @nest d { bottom: 0; }}}}",
    message: messages.rejected(1),
  } ],
})
