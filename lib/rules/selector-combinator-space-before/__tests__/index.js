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
      code: "a + a {}",
      description: "space before and after + combinator"
    },
    {
      code: "a > a {}",
      description: "space before and after > combinator"
    },
    {
      code: "a ~ a {}",
      description: "space before and after ~ combinator"
    },
    {
      code: "a >>> a {}",
      description: "shadow-piercing descendant combinator"
    },
    {
      code: ".foo ~ a + bar {}",
      description: "multiple spaced combinators"
    },
    {
      code: "a +a {}",
      description: "space before and none after + combinator"
    },
    {
      code: "a >a {}",
      description: "space before and none after > combinator"
    },
    {
      code: "a ~a {}",
      description: "space before and none after ~ combinator"
    },
    {
      code: "a >>>a {}",
      description: "space before and none after >>> combinator"
    },
    {
      code: "a +\na {}",
      description: "space before and newline after + combinator"
    },
    {
      code: "a +\r\na {}",
      description: "space before and CRLF after + combinator"
    },
    {
      code: "a >\na {}",
      description: "space before and newline after > combinator"
    },
    {
      code: "a ~\na {}",
      description: "space before and newline after ~ combinator"
    },
    {
      code: "a ~\r\na {}",
      description: "space before and CRLF after ~ combinator"
    },
    {
      code: "a >>>\na {}",
      description: "space before and newline after >>> combinator"
    },
    {
      code: "a >>>\r\na {}",
      description: "space before and CRLF after >>> combinator"
    },
    {
      code: "a ~a +bar {}",
      description: "multiple combinators with space before and none after"
    },
    {
      code: ".foo:nth-child(2n+1) {}",
      description: "unspaced + in nth-child argument"
    },
    {
      code: ".foo:nth-child(2n-1) {}",
      description: "unspaced - in nth-child argument"
    },
    {
      code: "a[rel~='copyright'] {}",
      description: "attribute selector with ~="
    },
    {
      code: ".foo {\n\t> span,\n\t> b { color:pink; } }",
      description: "nested selectors starting with combinator"
    },
    {
      code: ".foo\\+bar {}",
      description: "escaped combinator-like character"
    },
    {
      code: "a [type='button'] {}",
      description: "combinator between selectors and attribute selector"
    },
    {
      code: "a  a {}",
      description: "combinator selector contain multiple spaces"
    },
    {
      code: "a\na {}",
      description: "combinator selector contain newline"
    },
    {
      code: "a\r\na {}",
      description: "combinator selector contain CRLF"
    },
    {
      code: "a\n\na {}",
      description: "combinator selector contain multiple newline"
    },
    {
      code: "a\r\n\r\na {}",
      description: "combinator selector contain multiple CRLF"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    },
    {
      code: "namespace|type#id > .foo {}",
      description: "qualified id with namespace"
    },
    {
      code: "namespace|type#id > .foo {}, space|customtype#id_withunder > a {}",
      description: "qualified id with namespace selector list"
    }
  ],

  reject: [
    {
      code: "a  +a {}",
      description: "two spaces before + combinator",
      message: messages.expectedBefore("+"),
      line: 1,
      column: 4
    },
    {
      code: "a\n+ a {}",
      description: "newline before + combinator",
      message: messages.expectedBefore("+"),
      line: 2,
      column: 1
    },
    {
      code: "a\r\n+ a {}",
      description: "CRLF before + combinator",
      message: messages.expectedBefore("+"),
      line: 2,
      column: 1
    },
    {
      code: "a+a {}",
      description: "no space before + combinator",
      message: messages.expectedBefore("+"),
      line: 1,
      column: 2
    },
    {
      code: "a>a {}",
      description: "no space before > combinator",
      message: messages.expectedBefore(">"),
      line: 1,
      column: 2
    },
    {
      code: "a~a {}",
      description: "no space before ~ combinator",
      message: messages.expectedBefore("~"),
      line: 1,
      column: 2
    },
    {
      code: "a + .foo.bar~ a {}",
      description: "multiple combinators: no space before ~ combinator",
      message: messages.expectedBefore("~"),
      line: 1,
      column: 13
    },
    {
      code: "#foo+ .foo.bar ~ a {}",
      description: "multiple combinators: no space before + combinator",
      message: messages.expectedBefore("+"),
      line: 1,
      column: 5
    },
    {
      code: "a>>> a {}",
      description: "shadow-piercing descendant combinator",
      message: messages.expectedBefore(">>>"),
      line: 1,
      column: 2
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "a+ a {}",
      description: "no space before one after + combinator"
    },
    {
      code: "a> a {}",
      description: "no space before one after > combinator"
    },
    {
      code: "a~ a {}",
      description: "no space before one after ~ combinator"
    },
    {
      code: "a>>> a {}",
      description: "shadow-piercing descendant combinator"
    },
    {
      code: ".foo~ a+ bar {}",
      description: "multiple combinators with no space after"
    },
    {
      code: "a+a {}",
      description: "no space before or after + combinator"
    },
    {
      code: "a>a {}",
      description: "no space before or after > combinator"
    },
    {
      code: "a~a {}",
      description: "no space before or after ~ combinator"
    },
    {
      code: "a+\na {}",
      description: "no space before and newline after + combinator"
    },
    {
      code: "a>\na {}",
      description: "no space before and newline after > combinator"
    },
    {
      code: "a>\r\na {}",
      description: "no space before and CRLF after > combinator"
    },
    {
      code: "a~\na {}",
      description: "no space before and newline after ~ combinator"
    },
    {
      code: "a>>>\na {}",
      description: "no space before and newline after >>> combinator"
    },
    {
      code: "a>>>\r\na {}",
      description: "no space before and CRLF after >>> combinator"
    },
    {
      code: ".foo:nth-child(2n + 1) {}",
      description: "spaced + in nth-child argument"
    },
    {
      code: ".foo:nth-child(2n - 1) {}",
      description: "spaced - in nth-child argument"
    },
    {
      code: "a[rel~='copyright'] {}",
      description: "attribute selector with ~="
    },
    {
      code: "a [type='button'] {}",
      description: "combinator between selectors and attribute selector"
    },
    {
      code: "a  a {}",
      description: "combinator selector contain multiple spaces"
    },
    {
      code: "a\na {}",
      description: "combinator selector contain newline"
    },
    {
      code: "a\r\na {}",
      description: "combinator selector contain CRLF"
    },
    {
      code: "a\n\na {}",
      description: "combinator selector contain multiple newline"
    },
    {
      code: "a\r\n\r\na {}",
      description: "combinator selector contain multiple CRLF"
    },
    {
      code: "namespace|type#id> .foo {}",
      description: "qualified id with namespace"
    }
  ],

  reject: [
    {
      code: "a +a {}",
      description: "space before + combinator",
      message: messages.rejectedBefore("+"),
      line: 1,
      column: 3
    },
    {
      code: "a >a {}",
      description: "space before > combinator",
      message: messages.rejectedBefore(">"),
      line: 1,
      column: 3
    },
    {
      code: "a ~a {}",
      description: "space before ~ combinator",
      message: messages.rejectedBefore("~"),
      line: 1,
      column: 3
    },
    {
      code: "a\n+a {}",
      description: "newline before + combinator",
      message: messages.rejectedBefore("+"),
      line: 2,
      column: 1
    },
    {
      code: "a\r\n+a {}",
      description: "CRLF before + combinator",
      message: messages.rejectedBefore("+"),
      line: 2,
      column: 1
    },
    {
      code: "a\n>a {}",
      description: "newline before > combinator",
      message: messages.rejectedBefore(">"),
      line: 2,
      column: 1
    },
    {
      code: "a\r\n>a {}",
      description: "CRLF before > combinator",
      message: messages.rejectedBefore(">"),
      line: 2,
      column: 1
    },
    {
      code: "a\n~a {}",
      description: "newline before ~ combinator",
      message: messages.rejectedBefore("~"),
      line: 2,
      column: 1
    },
    {
      code: "a\r\n~a {}",
      description: "CRLF before ~ combinator",
      message: messages.rejectedBefore("~"),
      line: 2,
      column: 1
    },
    {
      code: "a + .foo.bar~ a {}",
      description: "multiple combinators: space before + combinator",
      message: messages.rejectedBefore("+"),
      line: 1,
      column: 3
    },
    {
      code: "#foo+ .foo.bar ~ a {}",
      description: "multiple combinators: no space before ~ combinator",
      message: messages.rejectedBefore("~"),
      line: 1,
      column: 16
    },
    {
      code: "a >>> a {}",
      description: "space before >>> combinator",
      message: messages.rejectedBefore(">>>"),
      line: 1,
      column: 3
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["always"],

  accept: [
    {
      code: ".a when (@size>=60) and (@size<102) {}",
      description: "ignore constructs"
    }
  ],

  reject: [
    {
      code: "a  +a {}",
      description: "two spaces before + combinator",
      message: messages.expectedBefore("+")
    }
  ]
});
