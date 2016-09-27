import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [[ "https", "data" ]],

  accept: [ {
    code: "a { background: url(); }",
  }, {
    code: "a { background: url(''); }",
  }, {
    code: "a { background: url(\"\"); }",
  }, {
    code: "a { background: url(:); }",
  }, {
    code: "a { background: url(://); }",
  }, {
    code: "a { background: url(//); }",
  }, {
    code: "a { background: url(/); }",
  }, {
    code: "a { background: url(./); }",
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
    code: "a { background: url('/path/to/file.jpg'); }",
  }, {
    code: "a { background: url(//www.example.com/file.jpg); }",
  }, {
    code: "a { background: url(\"//www.example.com/file.jpg\"); }",
  }, {
    code: "a { background: url('https://www.example.com/file.jpg'); }",
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { background-image: url('https://example.com:3000'); }",
  }, {
    code: "a { background-image: url('//example.com:3000'); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('/path/to/foo.ttf'); }",
  }, {
    code: "a { background: url(HTTPS://example.com/file.jpg); }",
    description: "ignore case",
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
    code: "a { background: url(http://#{$host}/path); }",
    description: "ignore interpolation",
  }, {
    code: "a { background: url('http://@{host}/path'); }",
    description: "ignore interpolation",
  }, {
    code: "a { background: url(http://$(host)/path); }",
    description: "ignore interpolation",
  }, {
    code: "a { background: url(var(--image)); }",
    description: "ignore variable",
  }, {
    code: "a { background: url(example.com); }",
    description: "schemeless url",
  }, {
    code: "a { background: url(example.com:3000); }",
    description: "schemeless url and port",
  }, {
    code: "a { background: url(https://example.com:3000); }",
    description: "url with scheme and port",
  } ],

  reject: [ {
    code: "a { background: url(http://www.example.com/file.jpg); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url('http://www.example.com/file.jpg'); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url(\"http://www.example.com/file.jpg\"); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url('http://example.com:3000'); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('http://www.example.com/file.jpg'); }",
    message: messages.rejected("http"),
    line: 1,
    column: 43,
  }, {
    code: "a { background: no-repeat center/80% url('http://www.example.com/file.jpg'); }",
    message: messages.rejected("http"),
    line: 1,
    column: 42,
  } ],
})

testRule(rule, {
  ruleName,
  config: [[]],

  accept: [ {
    code: "a { background: url('/path/to/file.jpg'); }",
  }, {
    code: "a { background: url(//www.example.com/file.jpg); }",
  }, {
    code: "a { background: url(\"//www.example.com/file.jpg\"); }",
  }, {
    code: "a { background: url(example.com:3000); }",
  } ],

  reject: [ {
    code: "a { background: url('https://www.example.com/file.jpg'); }",
    message: messages.rejected("https"),
    line: 1,
    column: 21,
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected("data"),
    line: 1,
    column: 27,
  } ],
})

testRule(rule, {
  ruleName,
  config: [""],

  accept: [ {
    code: "a { background: url('/path/to/file.jpg'); }",
  }, {
    code: "a { background: url(//www.example.com/file.jpg); }",
  }, {
    code: "a { background: url(\"//www.example.com/file.jpg\"); }",
  }, {
    code: "a { background: url(example.com:3000); }",
  } ],

  reject: [ {
    code: "a { background: url('https://www.example.com/file.jpg'); }",
    message: messages.rejected("https"),
    line: 1,
    column: 21,
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected("data"),
    line: 1,
    column: 27,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["https"],

  accept: [{
    code: "a { background: url(https://example.com/file.jpg); }",
  }],

  reject: [{
    code: "a { background: url(http://example.com/file.jpg); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  }],
})

testRule(rule, {
  ruleName,
  config: [["HTTPS"]],

  accept: [ {
    code: "a { background: url(https://example.com/file.jpg); }",
  }, {
    code: "a { background: url(HTTPS://example.com/file.jpg); }",
  } ],

  reject: [ {
    code: "a { background: url(http://example.com/file.jpg); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url(HTTP://example.com/file.jpg); }",
    message: messages.rejected("http"),
    line: 1,
    column: 21,
  } ],
})
