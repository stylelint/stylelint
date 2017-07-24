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
      code: "/* comment */"
    },
    {
      code: "/* comment comment */"
    },
    {
      code: "/* comment\ncomment */"
    },
    {
      code: "/* comment\n\ncomment */"
    },
    {
      code: "/** comment */"
    },
    {
      code: "/**** comment ***/"
    },
    {
      code: "/*\ncomment\n*/"
    },
    {
      code: "/*\tcomment   */"
    },
    {
      code: "/*! copyright */"
    },
    {
      code: "/*# sourcemap */"
    },
    {
      code: "/*!\ncopyright */"
    },
    {
      code: "/*#\nsourcemap */"
    }
  ],

  reject: [
    {
      code: "/*comment */",
      message: messages.expectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/**comment **/",
      message: messages.expectedOpening,
      line: 1,
      column: 4
    },
    {
      code: "/* comment*/",
      message: messages.expectedClosing,
      line: 1,
      column: 10
    },
    {
      code: "/*comment comment */",
      message: messages.expectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/* comment comment*/",
      message: messages.expectedClosing,
      line: 1,
      column: 18
    },
    {
      code: "/*comment\n\ncomment */",
      message: messages.expectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/* comment\n\ncomment*/",
      message: messages.expectedClosing,
      line: 3,
      column: 7
    },
    {
      code: "/*!copyright */",
      message: messages.expectedOpening,
      line: 1,
      column: 3
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "/*comment*/"
    },
    {
      code: "/*comment comment*/"
    },
    {
      code: "/*comment\ncomment*/"
    },
    {
      code: "/*comment\n\ncomment*/"
    },
    {
      code: "/**comment*/"
    },
    {
      code: "/****comment***/"
    },
    {
      code: "/*! copyright */"
    },
    {
      code: "/*# sourcemap */"
    }
  ],

  reject: [
    {
      code: "/* comment*/",
      message: messages.rejectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/** comment*/",
      message: messages.rejectedOpening,
      line: 1,
      column: 4
    },
    {
      code: "/*comment */",
      message: messages.rejectedClosing,
      line: 1,
      column: 10
    },
    {
      code: "/*  comment*/",
      message: messages.rejectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/*comment  */",
      message: messages.rejectedClosing,
      line: 1,
      column: 11
    },
    {
      code: "/*\ncomment*/",
      message: messages.rejectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/*comment\n*/",
      message: messages.rejectedClosing,
      line: 1,
      column: 10
    },
    {
      code: "/* comment comment*/",
      message: messages.rejectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/*comment comment */",
      message: messages.rejectedClosing,
      line: 1,
      column: 18
    },
    {
      code: "/* comment\n\ncomment*/",
      message: messages.rejectedOpening,
      line: 1,
      column: 3
    },
    {
      code: "/*comment\n\ncomment */",
      message: messages.rejectedClosing,
      line: 3,
      column: 8
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "//comment",
      description: "single-line comment ignored"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "// comment",
      description: "single-line comment ignored"
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
      code: "//comment",
      description: "single-line comment ignored"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: "// comment",
      description: "single-line comment ignored"
    }
  ]
});
