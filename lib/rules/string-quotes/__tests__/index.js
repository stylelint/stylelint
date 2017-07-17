"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["single"],
  skipBasicChecks: true,

  accept: [
    {
      code: ""
    },
    {
      code: "a {}"
    },
    {
      code: "@import url(foo.css);"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: "a::before { content: 'foo'; }"
    },
    {
      code: "a { background: url('foo'); }"
    },
    {
      code: "a[id='foo'] {}"
    },
    {
      code: "a::before { content: 'foo\"horse\"'cow''; }",
      description: "string in strings"
    },
    {
      code: 'a { /* "horse" */ }',
      description: "ignores comment"
    }
  ],

  reject: [
    {
      code: 'a::before { content: "foo"; }',
      message: messages.expected("single"),
      line: 1,
      column: 22
    },
    {
      code: 'a::before\n{\n  content: "foo";\n}',
      message: messages.expected("single"),
      line: 3,
      column: 12
    },
    {
      code: 'a[id="foo"] {}',
      message: messages.expected("single"),
      line: 1,
      column: 6
    },
    {
      code: 'a\n{ background: url("foo"); }',
      message: messages.expected("single"),
      line: 2,
      column: 19
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["double"],
  skipBasicChecks: true,

  accept: [
    {
      code: ""
    },
    {
      code: "a {}"
    },
    {
      code: "@import url(foo.css);"
    },
    {
      code: "a { color: pink; }"
    },
    {
      code: 'a::before { content: "foo"; }'
    },
    {
      code: 'a { background: url("foo"); }'
    },
    {
      code: 'a[id="foo"] {}'
    },
    {
      code: 'a::before { content: "foo"horse"\'cow\'"; }',
      description: "string in strings"
    },
    {
      code: "a { /* 'horse' */ }",
      description: "ignores comment"
    }
  ],

  reject: [
    {
      code: "a::before { content: 'foo'; }",
      message: messages.expected("double"),
      line: 1,
      column: 22
    },
    {
      code: "a::before\n{\n  content: 'foo';\n}",
      message: messages.expected("double"),
      line: 3,
      column: 12
    },
    {
      code: "a[id='foo'] {}",
      message: messages.expected("double"),
      line: 1,
      column: 6
    },
    {
      code: "a { background: url('foo'); }",
      message: messages.expected("double"),
      line: 1,
      column: 21
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["double"],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "a {\n  // 'horse'\n}",
      description: "ignores single-line SCSS comment"
    }
  ],

  reject: [
    {
      code: "a::before {\n  // 'horse'\n  content: 'thing'; }",
      description: "pays attention when single-line SCSS comment ends",
      message: messages.expected("double"),
      line: 3,
      column: 12
    },
    {
      code: "a::before {\n// one\n// two\n// three\n  content: 'thing'; }",
      description: "accurate position after // comments",
      message: messages.expected("double"),
      line: 5,
      column: 12
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["double"],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code: "a {\n  // 'horse'\n}",
      description: "ignores single-line Less comment"
    }
  ],

  reject: [
    {
      code: "a::before {\n  // 'horse'\n  content: 'thing'; }",
      description: "pays attention when single-line Less comment ends",
      message: messages.expected("double"),
      line: 3,
      column: 12
    },
    {
      code: "a::before {\n// one\n// two\n// three\n  content: 'thing'; }",
      description: "accurate position after // comments",
      message: messages.expected("double"),
      line: 5,
      column: 12
    }
  ]
});
