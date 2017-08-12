"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

// Testing plain selectors, different combinators
testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: 'a.class#id[ type = "value"]::before { top: 0; }'
    },
    {
      code: 'a[ type = "value"].class[data-val] { top: 0; }'
    },
    {
      code: "a b { top: 0; }"
    },
    {
      code: " a   b { top: 0; }"
    },
    {
      code: " a>  b { top: 0; }"
    },
    {
      code: " a  >  b { top: 0; }"
    },
    {
      code: " a  >b { top: 0; }"
    },
    {
      code: "a b, a b.c { top: 0; }"
    },
    {
      code: "a { b { top: 0; }}"
    },
    {
      code: "a { top: 0; d { top: 0; }}"
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
    }
  ],

  reject: [
    {
      code: "a b c { top: 0; }",
      message: messages.expected("a b c", 2),
      line: 1,
      column: 1
    },
    {
      code: "#id > .cl + .cl2 { top: 0; }",
      message: messages.expected("#id > .cl + .cl2", 2),
      line: 1,
      column: 1
    },
    {
      code: "a c, d + e h { top: 0; }",
      message: messages.expected("d + e h", 2),
      line: 1,
      column: 6
    },
    {
      code: "a ~ h + d { top: 0; }",
      message: messages.expected("a ~ h + d", 2),
      line: 1,
      column: 1
    }
  ]
});

// Testing :not, attr selectors
testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: ":not( a b ) {}",
      description:
        "Standalone :not(), number of compound selectors <= max inside it"
    },
    {
      code: "a b:not(c d) {}"
    },
    {
      code: '[type="text"] {top: 1px;}',
      description: "Single attr selector, complies."
    },
    {
      code: 'a [type="text"] {}',
      description: "Type selector and a single attr selector, complies."
    },
    {
      code: ' [type="text"]#id.classname l {}',
      description: "attr selector with class and id selectors, complies."
    }
  ],

  reject: [
    {
      code: ":not(a b c) { top: 0; }",
      description:
        "Standalone :not(), number of compound selectors > max inside it",
      message: messages.expected("a b c", 2),
      line: 1,
      column: 6
    },
    {
      code: "a b > c:not( d e ) { top: 0; }",
      description: "number of compound selectors > max outside of :not()",
      message: messages.expected("a b > c:not( d e )", 2),
      line: 1,
      column: 1
    },
    {
      code: "a b :not(d) { top: 0; }",
      description:
        "Standalone :not, number of compound selectors > max outside of :not()",
      message: messages.expected("a b :not(d)", 2),
      line: 1,
      column: 1
    },
    {
      code: "a b :not(d) { top: 0; }",
      description:
        "Standalone attr selector, number of compound selectors > max outside of :not()",
      message: messages.expected("a b :not(d)", 2),
      line: 1,
      column: 1
    }
  ]
});

// Testing nested selectors
testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: ".cd .de,\n.ef > b {}"
    },
    {
      code: "a { b {} }",
      description: "standard nesting"
    },
    {
      code: "div:hover { .de {} }",
      description: "element, pseudo-class, nested class"
    },
    {
      code: ".ab, .cd { & > .de {} }",
      description: "initial (unnecessary) parent selector"
    },
    {
      code: ".cd { .de > & {} }",
      description: "necessary parent selector"
    },
    {
      code: ".cd { @media print { .de {} } }",
      description: "nested rule within nested media query"
    },
    {
      code: "@media print { .cd { .de {} } }",
      description: "media query > rule > rule"
    }
  ],

  reject: [
    {
      code: ".thing div,\n.burgers .bacon a {}",
      message: messages.expected(".burgers .bacon a", 2),
      line: 2,
      column: 1
    },
    {
      code: ".cd { .de { .fg {} } }",
      message: messages.expected(".cd .de .fg", 2)
    },
    {
      code: ".cd { .de { & > .fg {} } }",
      message: messages.expected(".cd .de > .fg", 2)
    },
    {
      code: ".cd { .de { &:hover > .fg {} } }",
      message: messages.expected(".cd .de:hover > .fg", 2)
    },
    {
      code: ".cd { .de { .fg > & {} } }",
      message: messages.expected(".fg > .cd .de", 2)
    },
    {
      code: "a { b { c {} } }",
      description: "standard nesting",
      message: messages.expected("a b c", 2)
    },
    {
      code: "a b { c { top: 10px; } }",
      description: "standard nesting with declaration",
      message: messages.expected("a b c", 2)
    },
    {
      code: "a b { c { d {} } }",
      description: "standard nesting with declaration and more nested rule",
      message: messages.expected("a b c", 2)
    },
    {
      code: "a b { c { top: 10px; @media print {} } }",
      description: "standard nesting with declaration and more nested rule",
      message: messages.expected("a b c", 2)
    },
    {
      code: "a b { c { @media print { top: 10px; } } }",
      description: "standard nesting with declaration and more nested rule",
      message: messages.expected("a b c", 2)
    },
    {
      code: "a { @media print { b > c { d {} } } }",
      description:
        "The rule fails, but nesting even deeper with more compound selectors,",
      message: messages.expected("a b > c", 2)
    },
    {
      code: ".a { @media print { & .b > .c { & + .d {} } } }",
      description:
        "The rule fails, but nesting even deeper with more compound selectors, parent ref.,",
      message: messages.expected(".a .b > .c", 2)
    },
    {
      code: "@media print { li { & + .ab { .cd { top: 10px; } } } }",
      description:
        "The rule fails, but nesting even deeper with more compound selectors, has declarations",
      message: messages.expected("li + .ab .cd", 2)
    }
  ]
});

// Testing interpolation
testRule(rule, {
  ruleName,
  config: [1],
  syntax: "scss",

  accept: [
    {
      code: "#hello #{$test} {}",
      description: "ignore rules with variable interpolation"
    },
    {
      code: ".foo { margin: { left: 5px; top: 10px; }; }",
      description: "nested properties"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [1],
  syntax: "less",

  accept: [
    {
      code: "#hello @{test} {}",
      description: "ignore rules with variable interpolation"
    },
    {
      code: ".setFont(@size) { font-size: @size; }",
      description: "ignore mixins"
    },
    {
      code: ".test { .setFont(12px) }",
      description: "ignore called mixins"
    }
  ]
});
