"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a, b {}"
    },
    {
      code: "a, b, c {}"
    },
    {
      code: "a , b {}"
    },
    {
      code: "a\n, b {}"
    },
    {
      code: "a\r\n, b {}",
      description: "CRLF"
    },
    {
      code: 'a, b[data-foo="tr,tr"] {}',
      description: "string"
    },
    {
      code: "a:matches(:hover,:focus) {}",
      description: "comma inside :matches()"
    },
    {
      code: ":not(:hover,:focus) {}",
      description: "comma inside :not()"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    },
    {
      code: "a/*comment,comment*/, /*comment*/b {}",
      description: "comment"
    }
  ],

  reject: [
    {
      code: "a,b {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,  b {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\nb {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\r\nb {}",
      description: "CRLF",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\tb {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a, b,c {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 5
    },
    {
      code: "a, b,  c {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 5
    },
    {
      code: "a/*comment*/,/*comment*/b {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 13
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a,b {}"
    },
    {
      code: "a,b,c {}"
    },
    {
      code: "a ,b {}"
    },
    {
      code: "a\n,b {}"
    },
    {
      code: "a\r\n,b {}",
      description: "CRLF"
    },
    {
      code: 'a,b[data-foo="tr, tr"] {}',
      description: "string"
    },
    {
      code: "a:matches(:hover, :focus) {}",
      description: "comma inside :matches()"
    },
    {
      code: ":not(:hover, :focus) {}",
      description: "comma inside :not()"
    },
    {
      code: "a/*comment, comment*/,/*comment*/b {}",
      description: "comment"
    }
  ],

  reject: [
    {
      code: "a, b {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,  b {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\nb {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\r\nb {}",
      description: "CRLF",
      message: messages.rejectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,\tb {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 2
    },
    {
      code: "a,b, c {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 4
    },
    {
      code: "a,b,  c {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 4
    },
    {
      code: "a/*comment*/, /*comment*/b {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 13
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "a, b {}"
    },
    {
      code: "a, b {\n}",
      description: "single-line selector list, multi-line block"
    },
    {
      code: "a, b {\r\n}",
      description: "single-line selector list, multi-line block with CRLF"
    }
  ],

  reject: [
    {
      code: "a,b {}",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a,b {\n}",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a,b {\r\n}",
      description: "CRLF",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "a,b {}"
    },
    {
      code: "a,b {\n}",
      description: "single-line selector list, multi-line block"
    },
    {
      code: "a,b {\r\n}",
      description: "single-line selector list, multi-line block with CRLF"
    }
  ],

  reject: [
    {
      code: "a, b {}",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a, b {\n}",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 2
    },
    {
      code: "a, b {\r\n}",
      description: "CRLF",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: ".col( @a,@b ) {}",
      description: "mixin ending in a char"
    },
    {
      code: ".col3( @a,@b ) {}",
      description: "mixin ending in a number"
    }
  ]
});
