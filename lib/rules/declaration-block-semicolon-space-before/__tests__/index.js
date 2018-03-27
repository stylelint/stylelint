"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "color: pink ;",
      description: "declaration on root"
    },
    {
      code: "a { color: pink ; }"
    },
    {
      code: 'a::before { content: ";a" ; }'
    },
    {
      code: "a { color: pink ; top: 0 ; }"
    },
    {
      code: "a { color: pink ; top: 0}"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 15
    },
    {
      code: "a { color: pink  ; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink\t; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink\n; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink\r\n; }",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink ; top: 0; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 24
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "color: pink;",
      description: "declaration on root"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: 'a::before { content: ";a"; }'
    },
    {
      code: "a { color: pink; top: 0; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink ; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink  ; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink\t; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink\n; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink\r\n; }",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink; top: 0 ; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 24
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "color: pink ;",
      description: "declaration on root"
    },
    {
      code: "a { color: pink ; }"
    },
    {
      code: 'a::before { content: ";a" ; }'
    },
    {
      code: "a { color: pink ; top: 0 ; }"
    },
    {
      code: "a,\nb { color: pink ; top: 0 ; }",
      description: "multi-line rule, single-line declaration-block"
    },
    {
      code: "a {\n  color: pink;\n  top: 0;\n}"
    },
    {
      code: "a {\r\n  color: pink;\r\n  top: 0;\r\n}",
      description: "CRLF"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 15
    },
    {
      code: "a,\nb { color: pink; }",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 15
    },
    {
      code: "a,\r\nb { color: pink; }",
      description: "CRLF",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 15
    },
    {
      code: "a { color: pink  ; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink\t; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink ; top: 0; }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 24
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "color: pink;",
      description: "declaration on root"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: 'a::before { content: ";a"; }'
    },
    {
      code: "a { color: pink; top: 0; }"
    },
    {
      code: "a,\nb { color: pink; top: 0; }",
      description: "multi-line rule, single-line declaration-block"
    },
    {
      code: "a {\n  color: pink ;\n  top: 0 ;\n}"
    }
  ],

  reject: [
    {
      code: "a { color: pink ; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 16
    },
    {
      code: "a,\nb { color: pink ; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 2,
      column: 16
    },
    {
      code: "a,\r\nb { color: pink ; }",
      description: "CRLF",
      message: messages.rejectedBeforeSingleLine(),
      line: 2,
      column: 16
    },
    {
      code: "a { color: pink  ; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink\t; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink; top: 0 ; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 24
    }
  ]
});
