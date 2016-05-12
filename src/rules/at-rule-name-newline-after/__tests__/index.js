import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],
  skipBasicChecks: true,

  accept: [ {
    code: "@charset\n\"UTF-8\";",
  }, {
    code: "@charset\r\n\"UTF-8\";",
  }, {
    code: "@import\n\"x.css\";",
  }, {
    code: "@import\r\n\"x.css\";",
  }, {
    code: "@import\n\"x.css\" screen and (orientation:landscape);",
  }, {
    code: "@import\r\n\"x.css\" screen and (orientation:landscape);",
  }, {
    code: "@import\nurl(\"x.css\");",
  }, {
    code: "@importn\r\nurl(\"x.css\");",
  }, {
    code: "@import\nurl(\"x.css\") screen and (orientation:landscape);",
  }, {
    code: "@import\r\nurl(\"x.css\") screen and (orientation:landscape);",
  }, {
    code: "@namespace\nurl(XML-namespace-URL);",
  }, {
    code: "@namespace\r\nurl(XML-namespace-URL);",
  }, {
    code: "@media\n(min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@media\n(min-width: 700px)\nand (orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px)\r\nand (orientation: landscape) { }",
  }, {
    code: "@media\n(min-width: 700px) and\n(orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px) and\r\n(orientation: landscape) { }",
  }, {
    code: "@media\n(min-width: 700px) and (orientation: landscape)  { }",
  }, {
    code: "@media\r\n(min-width: 700px) and (orientation: landscape)  { }",
  }, {
    code: "@media\n(min-width: 700px) and (orientation: landscape)\n{ }",
  }, {
    code: "@media\r\n(min-width: 700px) and (orientation: landscape)\n{ }",
  }, {
    code: "@media\n(min-width: 700px) and (orientation: landscape)\r\n{ }",
  }, {
    code: "@media\r\n(min-width: 700px) and (orientation: landscape)\r\n{ }",
  }, {
    code: "@media\n(min-width: 700px)  and (orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px)  and (orientation: landscape) { }",
  }, {
    code: "@media\n(min-width: 700px)\nand (orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px)\nand (orientation: landscape) { }",
  }, {
    code: "@media\n(min-width: 700px)\r\nand (orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px)\r\nand (orientation: landscape) { }",
  }, {
    code: "@supports\n(animation-name: test) { }",
  }, {
    code: "@supports\r\n(animation-name: test) { }",
  }, {
    code: "@keyframes\nidentifier { }",
  }, {
    code: "@keyframes\r\nidentifier { }",
  }, {
    code: "@keyframes\r\nidentifier\n{ }",
  }, {
    code: "@keyframes\r\nidentifier\r\n{ }",
  }, {
    code: "@viewport { }",
  }, {
    code: "@viewport{ }",
  }, {
    code: "@viewport\n{ }",
  }, {
    code: "@viewport\r\n{ }",
  }, {
    code: "@viewport\n\n{ }",
  }, {
    code: "@viewport\r\n\r\n{ }",
  }, {
    code: "@counter-style\nwinners-list { }",
  }, {
    code: "@counter-style\r\nwinners-list { }",
  }, {
    code: "@font-face { };",
  }, {
    code: "@unknown\n\"ident\";",
  }, {
    code: "@unknown\r\n\"ident\";",
  }, {
    code: "@unknown\nident { };",
  }, {
    code: "@unknown\r\nident { };",
  }, {
    code: "a { color: pink; @crazy-custom-at-rule; }",
  } ],

  reject: [ {
    code: "@charset \"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@charset\"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@charset  \"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@charset\n\n\"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@charset\r\n\r\n\"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@media\n\n(width <= 100px) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media\r\n\r\n(width <= 100px) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  },  {
    code: "@media (width <= 100px) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media(width <= 100px) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media  (width <= 100px) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px)\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px)\r\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media(min-width: 700px)\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media(min-width: 700px)\r\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px)\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px)\r\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@unknown \"ident\";",
    message: messages.expectedAfter("@unknown"),
    line: 1,
    column: 8,
  }, {
    code: "@unknown\"ident\";",
    message: messages.expectedAfter("@unknown"),
    line: 1,
    column: 8,
  }, {
    code: "@unknown\"ident\" { };",
    message: messages.expectedAfter("@unknown"),
    line: 1,
    column: 8,
  }, {
    code: "@unknown ident { };",
    message: messages.expectedAfter("@unknown"),
    line: 1,
    column: 8,
  }, {
    code: "@unknown  ident { };",
    message: messages.expectedAfter("@unknown"),
    line: 1,
    column: 8,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["always"],
  skipBasicChecks: true,

  accept: [ {
    code: "@nice-blue:#5B83AD;",
    description: "ignore variables",
  }, {
    code: "@nice-blue: #5B83AD;",
    description: "ignore variables",
  }, {
    code: "@nice-blue:\n#5B83AD;",
    description: "ignore variables",
  }, {
    code: "@variable: .bucket; .@{variable} { }",
    description: "ignore interpolation",
  }, {
    code: "@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }",
    description: "ignore passing rulesets to mixins",
  }, {
    code: "@my-ruleset: { .my-selector { background-color: black; } };",
  }, {
    code: ".class1 { .mixin(#ddd) }",
    description: "ignore mixins",
  }, {
    code: ".button { &-ok { } }",
    description: "ignore parent selectors",
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["always"],
  skipBasicChecks: true,

  accept: [ {
    code: "@mixin\nmixin() { @content; }; .colors { @include\nmixin { color: $color; }}",
    description: "ignore content blocks",
  }, {
    code: "@mixin\r\nmixin() { @content; }; .colors { @include\r\nmixin { color: $color; }}",
    description: "ignore content blocks",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [ {
    code: "@charset \"UTF-8\";",
  }, {
    code: "@charset \"UTF-8\"\n;",
  }, {
    code: "@charset \"UTF-8\"\r\n;",
  }, {
    code: "@charset  \"UTF-8\";",
  }, {
    code: "@charset\"UTF-8\";",
  }, {
    code: "@charset\n\"UTF-8\";",
  }, {
    code: "@charset\r\n\"UTF-8\";",
  }, {
    code: "@import\"x.css\";",
  }, {
    code: "@import \"x.css\";",
  }, {
    code: "@import \"x.css\" screen and (orientation:landscape);",
  }, {
    code: "@import url(\"x.css\");",
  }, {
    code: "@import\nurl(\"x.css\");",
  }, {
    code: "@import\r\nurl(\"x.css\");",
  }, {
    code: "@import url(\"x.css\") screen and (orientation:landscape);",
  }, {
    code: "@namespace url(XML-namespace-URL);",
  }, {
    code: "@media(min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@media (min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@media (min-width: 700px) and (orientation: landscape)  { }",
  }, {
    code: "@media (min-width: 700px) and (orientation: landscape)\n{ }",
  }, {
    code: "@media (min-width: 700px) and (orientation: landscape)\r\n{ }",
  }, {
    code: "@media (min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@media\n(min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@media\r\n(min-width: 700px) and (orientation: landscape) { }",
  }, {
    code: "@supports (animation-name: test) { }",
  }, {
    code: "@supports(animation-name: test) { }",
  }, {
    code: "@keyframes identifier { }",
  }, {
    code: "@viewport { }",
  }, {
    code: "@viewport{ }",
  }, {
    code: "@viewport\n{ }",
  }, {
    code: "@viewport\r\n{ }",
  }, {
    code: "@viewport\n\n{ }",
  }, {
    code: "@viewport\r\n\r\n{ }",
  }, {
    code: "@counter-style winners-list { }",
  }, {
    code: "@font-face { };",
  }, {
    code: "@unknown \"ident\";",
  }, {
    code: "@unknown\"ident\";",
  }, {
    code: "@unknown ident { };",
  } ],

  reject: [ {
    code: "@charset\n\n\"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@charset\r\n\r\n\"UTF-8\";",
    message: messages.expectedAfter("@charset"),
    line: 1,
    column: 8,
  }, {
    code: "@import url(\"x.css\")\nscreen and (orientation:landscape);",
    message: messages.expectedAfter("@import"),
    line: 1,
    column: 7,
  }, {
    code: "@import url(\"x.css\")\r\nscreen and (orientation:landscape);",
    message: messages.expectedAfter("@import"),
    line: 1,
    column: 7,
  }, {
    code: "@media\n\n(min-width: 700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media\r\n\r\n(min-width: 700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media(min-width: 700px)\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media(min-width: 700px)\r\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media  (min-width: 700px)\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media  (min-width: 700px)\n\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px)\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px)\r\nand (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px) and\n(orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px) and\r\n(orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (\nmin-width: 700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (\r\nmin-width: 700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px\n) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width: 700px\r\n) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width\n: 700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width\r\n: 700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width:\n700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  }, {
    code: "@media (min-width:\r\n700px) and (orientation: landscape) { }",
    message: messages.expectedAfter("@media"),
    line: 1,
    column: 6,
  } ],
})
