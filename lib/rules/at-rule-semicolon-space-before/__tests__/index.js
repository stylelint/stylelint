"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,

  accept: [
    {
      code: '@import "styles/mystyle" ;'
    },
    {
      code:
        '@font-face {\n font-family: "MyFont"; src: url("myfont.woff2") format("woff2");\n}'
    },
    {
      code:
        '@font-face {\n font-family: "MyFont"; src: url("myfont.woff2") format("woff2");\n};'
    },
    {
      code: "a { color: @brand-primary; }"
    },
    {
      code: '@myatrule "valuehassemicolon;" ;'
    },
    {
      code: "@import url(http://www.example.com/alocation;withsemicolon) ;"
    },
    {
      code: '@import /*my styles;*/ "styles/mystyle" ;'
    },
    {
      code: "@import\nurl('landscape.css')\nprojection ;"
    }
  ],

  reject: [
    {
      code: '@import "styles/mystyle";',
      message: messages.expectedBefore(),
      line: 1,
      column: 24
    },
    {
      code: '@import "styles/mystyle"  ;',
      message: messages.expectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: '@import "styles/mystyle"\t;',
      message: messages.expectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: '@import "styles/mystyle"\n;',
      message: messages.expectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: '@import "styles/mystyle"\r\n;',
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: "@import\nurl('landscape.css')\nprojection;",
      message: messages.expectedBefore(),
      line: 3,
      column: 10
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: '@import "styles/mystyle";'
    },
    {
      code:
        '@font-face {\n font-family: "MyFont" ; src: url("myfont.woff2") format("woff2") ;\n}'
    },
    {
      code:
        '@font-face {\n font-family: "MyFont" ; src: url("myfont.woff2") format("woff2") ;\n} ;'
    },
    {
      code: "a { color: @brand-primary ; }"
    },
    {
      code: '@myatrule "valuehassemicolon ;";'
    },
    {
      code: "@import url(http://www.example.com/alocation+;withsemicolon);"
    },
    {
      code: '@import /*my styles ;*/ "styles/mystyle";'
    },
    {
      code: "@import\nurl('landscape.css')\nprojection;"
    }
  ],

  reject: [
    {
      code: '@import "styles/mystyle" ;',
      message: messages.rejectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: '@import "styles/mystyle"  ;',
      message: messages.rejectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: '@import "styles/mystyle"\t;',
      message: messages.rejectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: '@import "styles/mystyle"\n;',
      message: messages.rejectedBefore(),
      line: 1,
      column: 25
    },
    {
      code: '@import "styles/mystyle"\r\n;',
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: "@import\nurl('landscape.css')\nprojection ;",
      message: messages.rejectedBefore(),
      line: 3,
      column: 11
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "less",

  accept: [
    {
      code: "@import 'x.css';",
      description: "ignore less @imports"
    }
  ]
});
