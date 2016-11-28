"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a {} b {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\nb {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\r\nb {}",
    description: "non-nested node ignored and CRLF",
  }, {
    code: "@media {\n\n  a {}\n\n}",
  }, {
    code: "@media {\r\n\r\n  a {}\r\n\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n\r\n  a {}\n\r\n}",
    description: "Mixed",
  }, {
    code: "@media {\n\n  a {}\n\n  b{}\n\n}",
  }, {
    code: "@media {\n\n\ta {}\n\n\tb{}\n}",
  }, {
    code: "@media {\r\n\r\n\ta {}\r\n\r\n\tb{}\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n\n\ta {}}",
  }, {
    code: "@media {\n\na {}\n/* comment */\n\nb {}}",
  }, {
    code: "@media {\r\n\r\na {}\r\n/* comment */\r\n\r\nb {}}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media { b {} }",
    message: messages.expected,
  }, {
    code: "@media {\n\n  b {} a {} }",
    message: messages.expected,
  }, {
    code: "@media {\r\n\r\n  b {} a {} }",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "@media {\n\n  b {}\n  a {}\n\n}",
    message: messages.expected,
  }, {
    code: "@media {\n  b {}\n\n  a {}\n\n}",
    message: messages.expected,
  }, {
    code: "@media {\r\n  b {}\r\n\r\n  a {}\r\n\r\n}",
    description: "CRLF",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],

  accept: [ {
    code: "a {} b {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\nb {}",
    description: "non-nested node ignored",
  }, {
    code: "@media {\n  a {}\n\n}",
  }, {
    code: "@media {\r\n  a {}\r\n\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n  a {}\n\n  b{}\n\n}",
  }, {
    code: "@media {\n\ta {}\n\n\tb{}\n}",
  }, {
    code: "@media {\n\ta {}}",
  }, {
    code: "@media {\r\n\ta {}}",
    description: "CRLF",
  }, {
    code: "@media {\na {}\n/* comment */\n\nb {}}",
  }, {
    code: "@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media {\n\n  a {}\n}",
    message: messages.rejected,
  }, {
    code: "@media {\n\n  a {}\n\n  b{}\n}",
    message: messages.rejected,
  }, {
    code: "@media {\r\n\r\n  a {}\r\n\r\n  b{}\r\n}",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "@media {\n  b {} a {} }",
    message: messages.expected,
  }, {
    code: "@media {\r\n  b {} a {} }",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "@media {\n  b {}\n  a {}\n\n}",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "@media {\n  /* foo */\n  a {}\n}",
  }, {
    code: "@media {\r\n  /* foo */\r\n  a {}\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n  /* foo */\n\n  a {}\n}",
  }, {
    code: "@media {\r\n  /* foo */\r\n\r\n  a {}\r\n}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media {\n\n  a{}\n  b {}\n\n}",
    message: messages.expected,
  }, {
    code: "@media {\r\n\r\n  a{}\r\n  b {}\r\n\r\n}",
    description: "CRLF",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "a {} b {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\nb {}",
    description: "non-nested node ignored",
  }, {
    code: "@media {\n  a {}\n}",
  }, {
    code: "@media {\r\n  a {}\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n  a {} b{}\n}",
  }, {
    code: "@media {\n\ta {}\n\tb{}\n}",
  }, {
    code: "@media {\r\n\ta {}\r\n\tb{}\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n\ta {}}",
  }, {
    code: "@media {\na {}\n/* comment */\nb {}}",
  }, {
    code: "@media {\r\na {}\r\n/* comment */\r\nb {}}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media {\n\n  a {}\n\n}",
    message: messages.rejected,
  }, {
    code: "@media {\n  a {}\n\n  b{}\n\n}",
    message: messages.rejected,
  }, {
    code: "@media {\ta {}\n\n\tb{}\n}",
    message: messages.rejected,
  }, {
    code: "@media {\ta {}\r\n\r\n\tb{}\r\n}",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "@media {\n\n\ta {}}",
    message: messages.rejected,
  }, {
    code: "@media {\na {}\n/* comment */\n\nb {}}",
    message: messages.rejected,
  }, {
    code: "@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}",
    description: "CRLF",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { ignore: ["after-comment"] } ],
  skipBasicChecks: true,

  accept: [ {
    code: "@media {\n  /* foo */\n  a {}\n}",
  }, {
    code: "@media {\n  /* foo */\n\n  a {}\n}",
  }, {
    code: "@media {\r\n  /* foo */\r\n\r\n  a {}\r\n}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media {\n  a{}\n\n  b {}\n}",
    message: messages.rejected,
  }, {
    code: "@media {\r\n  a{}\r\n\r\n  b {}\r\n}",
    description: "CRLF",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [ {
    code: "@media { a { color:pink; } b { top: 0; } }",
    description: "single-line ignored",
  }, {
    code: "a {} b {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\nb {}",
    description: "non-nested node ignored",
  }, {
    code: "@media {\n\n  a {\n    color: pink;\n}\n\n}",
  }, {
    code: "@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}",
  }, {
    code: "@media {\n\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}",
  }, {
    code: "@media {\r\n\r\n\ta {\r\n\t\tcolor: pink; }\r\n\r\n\tb{\r\n\t\ttop: 0; }\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}",
  } ],

  reject: [ {
    code: "@media {\n  a {\n    color: pink;\n}\n\n}",
    message: messages.expected,
  }, {
    code: "@media {\n\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}",
    message: messages.expected,
  }, {
    code: "@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "@media {\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}",
    message: messages.expected,
  }, {
    code: "@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}",
    message: messages.expected,
  }, {
    code: "@media {\r\n\r\na {\r\n\t\tcolor: pink; }\r\n/* comment */\r\nb {\r\n\t\ttop: 0; }}",
    description: "CRLF",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always-multi-line", { except: ["first-nested"] } ],

  accept: [ {
    code: "@media { a { color:pink; } b { top: 0; } }",
    description: "single-line ignored",
  }, {
    code: "a {} b {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\nb {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\r\nb {}",
    description: "non-nested node ignored and CRLF",
  }, {
    code: "@media {\n  a {\n    color: pink;\n}\n\n}",
  }, {
    code: "@media {\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}",
  }, {
    code: "@media {\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}",
  }, {
    code: "@media {\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}",
  }, {
    code: "@media {\r\na {\r\n\t\tcolor: pink; }\r\n/* comment */\r\n\r\nb {\r\n\t\ttop: 0; }}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media {\n\n  a {\n    color: pink;\n}\n\n}",
    message: messages.rejected,
  }, {
    code: "@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}",
    message: messages.expected,
  }, {
    code: "@media {\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}",
    description: "CRLF",
    message: messages.expected,
  }, {
    code: "@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [ {
    code: "@media {\n\na { color:pink; }\n\nb { top: 0; } }",
    description: "single-line ignored",
  }, {
    code: "@media {\r\n\r\na { color:pink; }\r\n\r\nb { top: 0; } }",
    description: "single-line ignored and CRLF",
  }, {
    code: "a {} b {}",
    description: "non-nested node ignored",
  }, {
    code: "a {}\nb {}",
    description: "non-nested node ignored",
  }, {
    code: "@media {\n  a {\n    color: pink;\n}\n}",
  }, {
    code: "@media {\r\n  a {\r\n    color: pink;\r\n}\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n}",
  }, {
    code: "@media {\ta {\n\t\tcolor: pink; }\n\tb{\n\t\ttop: 0; }\n}",
  }, {
    code: "@media {\ta {\r\n\t\tcolor: pink; }\r\n\tb{\r\n\t\ttop: 0; }\r\n}",
    description: "CRLF",
  }, {
    code: "@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}",
  } ],

  reject: [ {
    code: "@media {\n\n  a {\n    color: pink;\n}\n\n}",
    message: messages.rejected,
  }, {
    code: "@media {\n\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}",
    message: messages.rejected,
  }, {
    code: "@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}",
    description: "CRLF",
    message: messages.rejected,
  }, {
    code: "@media {\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}",
    message: messages.rejected,
  }, {
    code: "@media { a {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}",
    message: messages.rejected,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["always"],

  accept: [ {
    code: "a { .mixin-call(); }",
    description: "Less mixin call ignored",
  }, {
    code: "a { &:extend(.class); }",
    description: "Less extends ignored",
  } ],
})
