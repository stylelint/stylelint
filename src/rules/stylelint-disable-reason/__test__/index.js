import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always-before"],

  accept: [ {
    code: "/* reason */\n/* stylelint-disable */\na {}",
  }, {
    code: "a {}/* reason *//* stylelint-disable-line block-no-empty */",
  }, {
    code: "a { /* reason */ color: pink; /* stylelint-disable-line color-no-named */}",
  }, {
    code: "a { /* reason */ color: pink; /* reason */ /* stylelint-disable-line color-no-named */}",
  }, {
    code: "/* reason */a {}/* stylelint-disable-line block-no-empty */",
  } ],

  reject: [ {
    code: "/* stylelint-disable */",
    message: messages.expectedBefore,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\na {}",
    message: messages.expectedBefore,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\n/* reason */\na {}",
    message: messages.expectedBefore,
    line: 1,
    column: 1,
  }, {
    code: "/* reason */\n/* stylelint-disable block-no-empty */\n/* stylelint-disable no-browser-hacks */\na {}",
    message: messages.expectedBefore,
    line: 3,
    column: 1,
  }, {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    message: messages.expectedBefore,
    line: 1,
    column: 6,
  }, {
    code: "a { color: pink; /* stylelint-disable-line block-no-empty */}",
    message: messages.expectedBefore,
    line: 1,
    column: 18,
  }, {
    code: "a { /* reason */ display: block; color: pink; /* stylelint-disable-line block-no-empty */}",
    message: messages.expectedBefore,
    line: 1,
    column: 47,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-after"],

  accept: [ {
    code: "/* stylelint-disable */\n/* reason */\na {}",
  }, {
    code: "a {}/* stylelint-disable-line *//* reason block-no-empty */",
  } ],

  reject: [ {
    code: "/* stylelint-disable */",
    message: messages.expectedAfter,
    line: 1,
    column: 1,
  }, {
    code: "/* stylelint-disable */\na {}",
    message: messages.expectedAfter,
    line: 1,
    column: 1,
  }, {
    code: "/* reason */\n/* stylelint-disable */\na {}",
    message: messages.expectedAfter,
    line: 2,
    column: 1,
  }, {
    code: "/* stylelint-disable block-no-empty */\n/* reason */\n/* stylelint-disable no-browser-hacks */\na {}",
    message: messages.expectedAfter,
    line: 3,
    column: 1,
  }, {
    code: "a {} /* stylelint-disable-line block-no-empty */",
    message: messages.expectedAfter,
    line: 1,
    column: 6,
  } ],
})
