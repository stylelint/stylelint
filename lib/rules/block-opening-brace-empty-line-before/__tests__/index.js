"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a\n\n{ color: pink; }"
    },
    {
      code: "a\n\n{\ncolor: pink;\n}"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 1
    },
    {
      code: "a\n{ color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "a\n\n{ color: pink; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [
    {
      code: "a\n\n{\ncolor: pink;\n}"
    }
  ],

  reject: [
    {
      code: "a {\ncolor: pink;\n}",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 1
    },
    {
      code: "a\n{\ncolor: pink;\n}",
      message: messages.expectedBeforeMultiLine(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "a\n{ color: pink; }"
    }
  ],

  reject: [
    {
      code: "a\n\n{ color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [
    {
      code: "a\n{\ncolor: pink;\n}"
    }
  ],

  reject: [
    {
      code: "a\n\n{\ncolor: pink;\n}",
      message: messages.rejectedBeforeMultiLine(),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "a\n{ color: pink; }"
    },
    {
      code: "a\n{\ncolor: pink;\n}"
    }
  ],

  reject: [
    {
      code: "a\n\n{ color: pink; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 1
    },
    {
      code: "a\n\n{\ncolor: pink;\n}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 1
    }
  ]
});
