"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "a { color: pink; } b { color: red; }"
    },
    {
      code: "a { color: pink; }b { color: red; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink;}",
      message: messages.expectedBefore(),
      line: 1,
      column: 16
    },
    {
      code: "a { color: pink;  }",
      message: messages.expectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "a { color: pink;\n}",
      message: messages.expectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;\r\n}",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;\t}",
      message: messages.expectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink; } b { color: red;}",
      message: messages.expectedBefore(),
      line: 1,
      column: 34
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a { color: pink;}"
    },
    {
      code: "a { color: pink;} b { color: red;}"
    },
    {
      code: "a { color: pink;}b { color: red;}"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;  }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 18
    },
    {
      code: "a { color: pink;\n}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;\r\n}",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;\t}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;} b { color: red; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 34
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "a { color: pink; }"
    },
    {
      code: "a { color: pink; } b { color: red; }"
    },
    {
      code: "a { color: pink; }b { color: red; }"
    },
    {
      code: "a,\nb { color: pink; } c { color: red; }",
      description: "multi-line rule, single-line block"
    },
    {
      code: "a { color: pink;\ntop: 0;}"
    },
    {
      code: "a { color: pink;\n\ntop: 0;}",
      description: "CRLF"
    },
    {
      code: "a { color: pink;\ntop: 0;  } b { color: red; }"
    },
    {
      code: "a { color: pink;\ntop: 0;\n}b { color: red; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink;}",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 16
    },
    {
      code: "a,\nb { color: pink;}",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 16
    },
    {
      code: "a,\r\nb { color: pink;}",
      description: "CRLF",
      message: messages.expectedBeforeSingleLine(),
      line: 2,
      column: 16
    },
    {
      code: "a { color: pink;  }",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 18
    },
    {
      code: "a { color: pink;\t}",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink; } b { color: red;}",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 34
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "a { color: pink;}"
    },
    {
      code: "a { color: pink;} b { color: red;}"
    },
    {
      code: "a { color: pink;}b { color: red;}"
    },
    {
      code: "a,\nb { color: pink;} b { color: red;}",
      description: "multi-line rule, single-line block"
    },
    {
      code: "a { color: pink;\ntop: 0; }"
    },
    {
      code: "a { color: pink;\r\ntop: 0; }",
      description: "CRLF"
    },
    {
      code: "a { color: pink;\ntop: 0;  } b { color: red;}"
    },
    {
      code: "a { color: pink;\ntop: 0;\n}b { color: red;}"
    }
  ],

  reject: [
    {
      code: "a { color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 17
    },
    {
      code: "a,\nb { color: pink; }",
      message: messages.rejectedBeforeSingleLine(),
      line: 2,
      column: 17
    },
    {
      code: "a,\r\nb { color: pink; }",
      description: "CRLF",
      message: messages.rejectedBeforeSingleLine(),
      line: 2,
      column: 17
    },
    {
      code: "a { color: pink;  }",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 18
    },
    {
      code: "a { color: pink;\t}",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 17
    },
    {
      code: "a { color: pink;} b { color: red;\t}",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 34
    },
    {
      code: "a { color: pink;  } b { color: red;}",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 18
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [
    {
      code: "a { color: pink;\ntop: 0; }"
    },
    {
      code: "a { color: pink;\ntop: 0; } b { color: red; }"
    },
    {
      code: "a { color: pink;\ntop: 0; }b { color: red; }"
    },
    {
      code: "a { color: pink;\r\ntop: 0; }b { color: red; }",
      description: "CRLF"
    },
    {
      code: "a { color: pink;}"
    },
    {
      code: "a { color: pink;  } b { color: red; }"
    },
    {
      code: "a { color: pink;\t}b { color: red; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink;\ntop: 0;}",
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 7
    },
    {
      code: "a { color: pink;\ntop: 0;  }",
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 9
    },
    {
      code: "a { color: pink;\ntop: 0;\t}",
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 8
    },
    {
      code: "a { color: pink; } b { color: red;\ntop: 0;}",
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 7
    },
    {
      code: "a { color: pink;\ntop: 0;} b { color: red; }",
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 7
    },
    {
      code: "a { color: pink;\r\ntop: 0;} b { color: red; }",
      description: "CRLF",
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 7
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [
    {
      code: "a { color: pink;\ntop: 0;}"
    },
    {
      code: "a { color: pink;\ntop: 0;} b { color: red;}"
    },
    {
      code: "a { color: pink;\r\ntop: 0;} b { color: red;}",
      description: "CRLF"
    },
    {
      code: "a { color: pink;\ntop: 0;}b { color: red;}"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: "a { color: pink;  } b { color: red; }"
    },
    {
      code: "a { color: pink;\t}b { color: red; }"
    }
  ],

  reject: [
    {
      code: "a { color: pink;\ntop: 0; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 2,
      column: 8
    },
    {
      code: "a { color: pink;\ntop: 0;  }",
      message: messages.rejectedBeforeMultiLine(),
      line: 2,
      column: 9
    },
    {
      code: "a { color: pink;\ntop: 0;\t}",
      message: messages.rejectedBeforeMultiLine(),
      line: 2,
      column: 8
    },
    {
      code: "a { color: pink;\r\ntop: 0;\t}",
      description: "CRLF",
      message: messages.rejectedBeforeMultiLine(),
      line: 2,
      column: 8
    },
    {
      code: "a { color: pink; } b { color: red;\ntop: 0; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 2,
      column: 8
    },
    {
      code: "a { color: pink;\ntop: 0; } b { color: red; }",
      message: messages.rejectedBeforeMultiLine(),
      line: 2,
      column: 8
    }
  ]
});
