"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [20],

  accept: [ {
    code: "a { color: 0; }",
  }, {
    code: "a {  color   : 0 ; }",
  }, {
    code: "a { color: 0;\n  top: 0; }",
  }, {
    code: "@media print {\n  a {\n    color: pink;\n }\n}",
  }, {
    code: "a {\n background: url(somethingsomethingsomethingsomething);\n}",
  }, {
    code: "a {\n background: uRl(somethingsomethingsomethingsomething);\n}",
  }, {
    code: "a {\n background: URL(somethingsomethingsomethingsomething);\n}",
  }, {
    code: "a {\n  background: url(\n  somethingsomethingsomethingsomething\n  );\n}",
  }, {
    code: "a {\n  background: uRl(\n  somethingsomethingsomethingsomething\n  );\n}",
  }, {
    code: "a {\n  background: URL(\n  somethingsomethingsomethingsomething\n  );\n}",
  }, {
    code: "a { margin: 0 2px; }\r\n",
  }, {
    code: "a { margin: 0 2px; }\r\na { margin: 4px 0; }\n",
  }, {
    code: "@import url(\"somethingsomethingsomethingsomething.css\") print;",
  }, {
    code: "@import 'somethingsomethingsomethingsomething.css';",
  }, {
    code: "@import 'svg-something<id=\"horse\">' projection;",
  } ],

  reject: [ {
    code: "a {   color   : 0  ;}",
    message: messages.expected(20),
    line: 1,
    column: 21,
  }, {
    code: "a { color: 0; top: 0; }",
    message: messages.expected(20),
    line: 1,
    column: 23,
  }, {
    code: "a { color: 0;\n  top: 0; bottom: 0; right: 0; \n  left: 0; }",
    message: messages.expected(20),
    line: 2,
    column: 31,
  }, {
    code: "a { color: 0;\n  top: 0;\n  left: 0; bottom: 0; right: 0; }",
    message: messages.expected(20),
    line: 3,
    column: 33,
  }, {
    code: "@media print {\n  a {\n    color: pink; background: orange;\n }\n}",
    message: messages.expected(20),
    line: 3,
    column: 36,
  }, {
    code: "@media (min-width: 30px) and screen {}",
    message: messages.expected(20),
    line: 1,
    column: 38,
  }, {
    code: "a { margin: 0 2rem; }\r\n",
    message: messages.expected(20),
    line: 1,
    column: 21,
  }, {
    code: "@import url(\"somethingsomethingsomethingsomething.css\") projection, tv;",
    message: messages.expected(20),
    line: 1,
    column: 71,
  }, {
    code: "@import 'somethingsomethingsomethingsomething.css' projection, tv;",
    message: messages.expected(20),
    line: 1,
    column: 66,
  }, {
    code: "@import 'svg-something<id=\"horse\">' screens, tv;",
    message: messages.expected(20),
    line: 1,
    column: 48,
  }, {
    code: "a { background-image: url('some ignored url'); }",
    message: messages.expected(20),
    line: 1,
    column: 48,
  }, {
    code: "a {\n    /* Lorem ipsum dolor sit amet. The comment Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium officia fugiat unde deserunt sit, tenetur! Incidunt similique blanditiis placeat ad quia possimus libero, reiciendis excepturi non esse deserunt a odit. */\n}",
    message: messages.expected(20),
    line: 2,
    column: 272,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [20],

  reject: [{
    code: "a {\n    // Lorem ipsum dolor sit amet. The comment Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium officia fugiat unde deserunt sit, tenetur! Incidunt similique blanditiis placeat ad quia possimus libero, reiciendis excepturi non esse deserunt a odit.\n}",
    message: messages.expected(20),
    line: 2,
    column: 269,
  }],
})

testRule(rule, {
  ruleName,
  config: [30],

  accept: [ {
    code: "a { color: 0;\n  top: 0; left: 0; right: 0; \n  bottom: 0; }",
  }, {
    code: "@import url(\"somethingsomethingsomethingsomething.css\") print;",
  }, {
    code: "@import url(\"somethingsomethingsomethingsomething.css\") projection, tv;",
  }, {
    code: "@import url(\"chrome:\/\/somethingsomethingsomethingsomething\/\");",
  }, {
    code: "@import \"somethingsomethingsomethingsomething.css\" screen, projection;",
  } ],

  reject: [ {
    code: "a { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }",
    message: messages.expected(30),
    line: 2,
    column: 47,
  }, {
    code: "@import url(\"somethingsomethingsomethingsomething.css\") projection, screen;",
    message: messages.expected(30),
    line: 1,
    column: 75,
  }, {
    code: "@import \"somethingsomethingsomethingsomething.css\" screen, projection, tv;",
    message: messages.expected(30),
    line: 1,
    column: 74,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 20, { ignore: "non-comments" } ],

  accept: [ {
    code: "a { color: 0; top: 0; bottom: 0; }",
  }, {
    code: "a { color: 0; top: 0; /* too long comment here */ bottom: 0; }",
  }, {
    code: "/* short nuff */",
  }, {
    code: "/* short\nnuff */",
  }, {
    code: "/**\n * each line\n * short nuff\n */",
  }, {
    code: "a { color: 0; }\n/* short nuff */\nb {}",
  }, {
    code: "a {}\n/**\n * each line\n * short nuff\n */\nb {}",
  }, {
    code: "a { /* this comment is too long for the max length */ }",
  } ],

  reject: [ {
    code: "/* comment that is too long */",
    message: messages.expected(20),
    line: 1,
    column: 30,
  }, {
    code: "a {}\n  /* comment that is too long */\nb {}",
    message: messages.expected(20),
    line: 2,
    column: 32,
  }, {
    code: "/* this comment is too long for the max length */",
    message: messages.expected(20),
    line: 1,
    column: 49,
  }, {
    code: "a {}\n/**\n * each line\n * short nuff\n * except this one which is too long\n */\nb {}",
    message: messages.expected(20),
    line: 5,
    column: 36,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 20, { ignore: "comments" } ],

  accept: [ {
    code: "/* comment that is too long */",
  }, {
    code: "       /* comment that is too long */",
  }, {
    code: "/* short */ a { color: 0; }",
  }, {
    code: "a {}\n/* comment that is too long\n*/ a { color: 0; top: 0; }",
  }, {
    code: "/**\n comment that is too long #1\n comment that is too long #2 */",
  } ],

  reject: [ {
    code: "a { color: 0; } /* comment that is too long */",
    message: messages.expected(20),
    line: 1,
    column: 46,
  }, {
    code: "a { /* this comment is too long for the max length */ }",
    message: messages.expected(20),
    line: 1,
    column: 55,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 30, { ignorePattern: "/^my-/" } ],

  accept: [{
    code: "my-property: has-a-really-long-declaration-value-for-some-reason",
  }],

})

testRule(rule, {
  ruleName,
  config: [ 30, { ignorePattern: "/@import\\s+/" } ],

  accept: [{
    code: "@import \"../../../something/something/something/something.css\" screen, projection, tv;",
  }],

  reject: [ {
    code: "a { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }",
    message: messages.expected(30),
    line: 2,
    column: 47,
  }, {
    code: "@import \"../../../something/something/something/something.css\";\na { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }",
    message: messages.expected(30),
    line: 3,
    column: 47,
  } ],
})
