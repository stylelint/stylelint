import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "@import url('foo.css');",
  }, {
    code: "@document url('http://www.w3.org/');",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=\"); }",
  }, {
    code: "a { background: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { cursor: url('data:image/ico;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=') }",
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=') url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=') }",
  }, {
    code: "a { list-style: square url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=') }",
  }, {
    code: "a { background: url(); }",
    description: "ignore empty url function",
  }, {
    code: "a { background: url(''); }",
    description: "ignore empty url function",
  }, {
    code: "a { background: url(\"\"); }",
    description: "ignore empty url function",
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
    code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('foo.ttf'); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"foo.ttf'\"); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "a { background: url('foo.png'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { cursor: url('foo.ico'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { list-style: square url('foo.png') }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background-image: url('foo.png'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='), url('bar.png'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background-image: url('foo.png'), url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.expected,
    line: 1,
    column: 5,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "@import url('foo.css');",
  }, {
    code: "@document url('http://www.w3.org/');",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('foo.ttf'); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"foo.ttf\"); }",
  }, {
    code: "a { background: url('image.png'); }",
  }, {
    code: "a { cursor: url('image.ico'); }",
  }, {
    code: "a { background-image: url('image.png') }",
  }, {
    code: "a { background-image: url('image.png') url('image2.png') }",
  }, {
    code: "a { list-style: square url('image.png') }",
  }, {
    code: "a { background: url(); }",
    description: "ignore empty url function",
  }, {
    code: "a { background: url(''); }",
    description: "ignore empty url function",
  }, {
    code: "a { background: url(\"\"); }",
    description: "ignore empty url function",
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
    code: "@font-face { font-family: 'foo'; src: url(data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='\"); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "a { background: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { cursor: url('data:image/ico;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { list-style: square url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=') }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=), url(bar.png); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background-image: url(foo.png), url(data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  } ],
})
