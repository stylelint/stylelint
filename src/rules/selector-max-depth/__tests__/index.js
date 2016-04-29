import { testRule } from "../../../testUtils"

import rule, { ruleName, messages } from ".."

// Testing plain selectors, different combinators
testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
    code: "a.class#id[ type = \"value\"]::before { top: 0; }",
  }, {
    code: "a[ type = \"value\"].class[data-val] { top: 0; }",
  }, {
    code: "a b { top: 0; }",
  }, {
    code: " a   b { top: 0; }",
  }, {
    code: " a>  b { top: 0; }",
  }, {
    code: " a  >  b { top: 0; }",
  }, {
    code: " a  >b { top: 0; }",
  }, {
    code: "a b, a b.c { top: 0; }",
  }, {
    code: "a { b { top: 0; }}",
  }, {
    code: "a { top: 0; d { top: 0; }}",
  } ],
  
  reject: [ {
    code: "a b c { top: 0; }",
    message: messages.expected("a b c", 2),
    line: 1,
    column: 1,
  }, {
    code: "#id > .cl + .cl2 .foo { top: 0; }",
    message: messages.expected("#id > .cl + .cl2 .foo", 2),
    line: 1,
    column: 1,
  }, {
    code: "a c, d + e > f h { top: 0; }",
    message: messages.expected("d + e > f h", 2),
    line: 1,
    column: 6,
  } ],
})

// Testing :not, attr selectors
testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
    code: ":not( a b ) {}",
    description: "Standalone :not(), depth <= max inside it",
  }, {
    code: "a b:not(c d) {}",
  }, {
    code: "a +b, c d:not( e+ f >h ~g) {}",
  }, {
    code: "[type=\"text\"] {top: 1px;}",
    description: "Single attr selector, complies.",
  }, {
    code: "a [type=\"text\"] {}",
    description: "Type selector and a single attr selector, complies.",
  }, {
    code: " [type=\"text\"]#id.classname l {}",
    description: "attr selector with class and id selectors, complies.",
  } ],
  
  reject: [ {
    code: ":not(a b c) { top: 0; }",
    description: "Standalone :not(), depth > max inside it",
    message: messages.expected("a b c", 2),
    line: 1,
    column: 6,
  }, {
    code: "a b > c:not( d e ) { top: 0; }",
    description: "Depth > max outside of :not()",
    message: messages.expected("a b > c:not( d e )", 2),
    line: 1,
    column: 1,
  }, {
    code: "a b :not(d) { top: 0; }",
    description: "Standalone :not, depth > max outside of :not()",
    message: messages.expected("a b :not(d)", 2),
    line: 1,
    column: 1,
  }, {
    code: "a b :not(d) { top: 0; }",
    description: "Standalone attr selector, depth > max outside of :not()",
    message: messages.expected("a b :not(d)", 2),
    line: 1,
    column: 1,
  } ],
})

// Tesging nested selectors
testRule(rule, {
  ruleName,
  config: [2],

  accept: [ {
    code: ".cd .de,\n.ef > b {}",
  }, {
    code: "a { b {} }",
    description: "standard nesting",
  }, {
    code: "div:hover { .de {} }",
    description: "element, pseudo-class, nested class",
  }, {
    code: ".ab, .cd { & > .de {} }",
    description: "initial (unnecessary) parent selector",
  }, {
    code: ".cd { .de > & {} }",
    description: "necessary parent selector",
  }, {
    code: ".cd { @media print { .de {} } }",
    description: "nested rule within nested media query",
  }, {
    code: "@media print { .cd { .de {} } }",
    description: "media query > rule > rule",
  } ],

  reject: [ {
    code: ".thing div,\n.burgers .bacon a {}",
    message: messages.expected(".burgers .bacon a", 2),
    line: 2,
    column: 1,
  }, {
    code: ".cd { .de { .fg {} } }",
    message: messages.expected(".cd .de .fg", 2),
  }, {
    code: ".cd { .de { & > .fg {} } }",
    message: messages.expected(".cd .de > .fg", 2),
  }, {
    code: ".cd { .de { &:hover > .fg {} } }",
    message: messages.expected(".cd .de:hover > .fg", 2),
  }, {
    code: ".cd { .de { .fg > & {} } }",
    message: messages.expected(".fg > .cd .de", 2),
  }, {
    code: "a { @media print { b > c { d {} } } }",
    description: "The rule fails, but nesting even deeper with more selector depth,",
    message: messages.expected("a b > c d", 2),
  }, {
    code: ".a { @media print { & .b > .c { & + .d {} } } }",
    description: "The rule fails, but nesting even deeper with more selector depth, parent ref.,",
    message: messages.expected(".a .b > .c + .d", 2),
  }, {
    code: "@media print { li { & + .ab, .ef.ef { .cd { top: 10px; } } } }",
    description: "The rule fails, but nesting even deeper with more selector depth, has declarations",
    message: messages.expected("li .ef.ef .cd", 2),
  } ],
})

// Testing interpolation
testRule(rule, {
  ruleName,
  config: [1],
  syntax: "scss",

  accept: [{
    code: "#hello #{$test} {}",
    description: "ignore rules with variable interpolation",
  }],
})

testRule(rule, {
  ruleName,
  config: [1],
  syntax: "less",

  accept: [{
    code: "#hello @{test} {}",
    description: "ignore rules with variable interpolation",
  }],
})
