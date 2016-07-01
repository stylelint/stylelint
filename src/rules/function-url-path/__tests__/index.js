import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["absolute"],

  accept: [ {
    code: "@import url();",
  }, {
    code: "@import url('');",
  }, {
    code: "@import url(\"\");",
  }, {
    code: "a { background: url('/path/to/file.jpg'); }",
  }, {
    code: "a { background: url('//www.google.com/file.jpg'); }",
  }, {
    code: "a { background: url('https://www.google.com/file.jpg'); }",
  }, {
    code: "a { background: url('http://www.google.com/file.jpg'); }",
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('/path/to/foo.ttf'); }",
  }, {
    code: "a { background: some-url(); }",
    description: "ignore contain url function",
  }, {
    code: "a { background: url($image); }",
    description: "ignore variable",
  }, {
    code: "a { background: url(@image); }",
    description: "ignore variable",
  }, {
    code: "a { background: url(var(--image)); }",
    description: "ignore variable",
  } ],

  reject: [ {
    code: "a { background: url(./); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(http.jpg); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(file.jpg); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(./file.jpg); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(../file.jpg); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: URL(../file.jpg); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url('../file.jpg'); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(\"../file.jpg\"); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('./file.jpg'); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["relative"],
  skipBasicChecks: true,

  accept: [ {
    code: "@import url();",
  }, {
    code: "@import url('');",
  }, {
    code: "@import url(\"\");",
  }, {
    code: "a { background: url(file.jpg); }",
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { background: url(./file.jpg); }",
  }, {
    code: "a { background: url(../file.jpg); }",
  }, {
    code: "a { background: URL(../file.jpg); }",
  }, {
    code: "a { background: url('../file.jpg'); }",
  }, {
    code: "a { background: url(\"../file.jpg\"); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('./path/to/foo.ttf'); }",
  }, {
    code: "a { background: some-url(); }",
    description: "ignore contain url function",
  }, {
    code: "a { background: url($image); }",
    description: "ignore variable",
  }, {
    code: "a { background: url(@image); }",
    description: "ignore variable",
  }, {
    code: "a { background: url(var(--image)); }",
    description: "ignore variable",
  } ],

  reject: [ {
    code: "a { background: url(/); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: URL(/file.jpg); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url('/file.jpg'); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(\"/file.jpg\"); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url('//www.google.com/file.jpg'); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('/file.jpg'); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  } ],
})
