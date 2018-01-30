"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,
  fix: true,
  accept: [
    {
      code: "@foo;\na {}"
    },
    {
      code: "@import 'x.css';\na {}"
    },
    {
      code: "@iMpOrT 'x.css';\na {}"
    },
    {
      code: "@IMPORT 'x.css';\na {}"
    },
    {
      code: "@charset 'UTF-8';\na {}"
    },
    {
      code: "@charset 'UTF-8';\n@import 'x.css'"
    },
    {
      code: "@charset 'UTF-8';\n@import 'x.css'\na {}"
    },
    {
      code: "@namespace url(XML-namespace-URL);\na {}"
    },
    {
      code: "@import 'x.css'); /* comment */\n"
    },
    {
      code: "@import 'x.css');/* comment */\n"
    },
    {
      code: "@import 'x.css');   /* comment */\n"
    },
    {
      code: "@import 'x.css');\t/* comment */\n"
    },
    {
      code: "@import 'x.css'); \t/* comment */\n"
    },
    {
      code: "@charset 'UTF-8';\n@media {}"
    },
    {
      code: "@import 'x.css';\r\n",
      description: "windows"
    },
    {
      code: "@import 'x.css'; /* comment */\r\n",
      description: "windows"
    },
    {
      code: "@import 'x.css';",
      description: "single blockless rule"
    },
    {
      code: "a{\n@extend .b;\n@extend .c\n}",
      description: "non-standard nested rule"
    },
    {
      code: "@font-face {}; a {}",
      description: "ignore at-rule with block"
    }
  ],

  reject: [
    {
      code: "@mixin foo; a {}",
      fixed: "@mixin foo;\n a {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 12
    },
    {
      code: "@mIxIn foo; a {}",
      fixed: "@mIxIn foo;\n a {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 12
    },
    {
      code: "@MIXIN foo; a {}",
      fixed: "@MIXIN foo;\n a {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 12
    },
    {
      code: '@import url("x.css"); @charset "UTF-8";',
      fixed: '@import url("x.css");\n @charset "UTF-8";',
      message: messages.expectedAfter(),
      line: 1,
      column: 22
    },
    {
      code: '@charset "UTF-8"; a {};',
      fixed: '@charset "UTF-8";\n a {};',
      message: messages.expectedAfter(),
      line: 1,
      column: 18
    },
    {
      code: "a{\n@extend .b; @extend .c\n}",
      fixed: "a{\n@extend .b;\n @extend .c\n}",
      message: messages.expectedAfter(),
      line: 2,
      column: 12
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
