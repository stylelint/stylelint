"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const stylelint = require("../../../standalone")

const rule = rules[ruleName]

it("deprecation warning", () => {
  const config = {
    rules: {
      [ruleName]: "always",
    },
  }

  const code = ""

  return stylelint({ code, config }).then(output => {
    const result = output.results[0]
    expect(result.deprecations.length).toEqual(1)
    expect(result.deprecations[0].text).toEqual(`\'${ruleName}\' has been deprecated and in 8.0 will be removed. Instead use either the 'function-url-scheme-blacklist' or 'function-url-scheme-whitelist' rule.`)
    expect(result.deprecations[0].reference).toEqual(`https://stylelint.io/user-guide/rules/${ruleName}/`)
  })
})

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "@import url('foo.css');",
  }, {
    code: "@import url( 'foo.css' );",
  }, {
    code: "@import url(  'foo.css'  );",
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
    code: "a { background: uRl('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { background: URL('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { background: url('dAtA:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
  }, {
    code: "a { background: url('DATA:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
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
    code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('foo.ttf'); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( 'foo.ttf' ); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"foo.ttf'\"); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( \"foo.ttf'\" ); }",
    message: messages.expected,
    line: 1,
    column: 34,
  }, {
    code: "a { background: url('foo.png'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: uRl('foo.png'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: URL('foo.png'); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url( 'foo.png' ); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(  'foo.png'  ); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url( 'foo.png' ); }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(  'foo.png'  ); }",
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
    code: "@import url( 'foo.css' );",
  }, {
    code: "@import url(  'foo.css'  );",
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
    code: "a { background: uRl('image.png'); }",
  }, {
    code: "a { background: URL('image.png'); }",
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
    code: "@font-face { font-family: 'foo'; src: url( data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs= ); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url('data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( 'data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=' ); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='\"); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( \"data:font/ttf;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='\" ); }",
    message: messages.rejected,
    line: 1,
    column: 34,
  }, {
    code: "a { background: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url('dAtA:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url('DATA:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url( 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=' ); }",
    message: messages.rejected,
    line: 1,
    column: 5,
  }, {
    code: "a { background: url(  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='  ); }",
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
