"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

// Sanity checks
testRule(rule, {
  ruleName,
  config: [0],

  accept: [
    {
      code: "foo {}"
    },
    {
      code: ".bar {}"
    },
    {
      code: "foo .bar {}"
    },
    {
      code: "[foo] {}"
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
      code: "#foo {}",
      message: messages.expected("#foo", 0),
      line: 1,
      column: 1
    },
    {
      code: ".bar #foo {}",
      message: messages.expected(".bar #foo", 0),
      line: 1,
      column: 1
    },
    {
      code: ".bar > #foo {}",
      message: messages.expected(".bar > #foo", 0),
      line: 1,
      column: 1
    },
    {
      code: "#foo.bar {}",
      message: messages.expected("#foo.bar", 0),
      line: 1,
      column: 1
    },
    {
      code: ".foo, .bar, #foo.baz {}",
      message: messages.expected("#foo.baz", 0),
      line: 1,
      column: 13
    },
    {
      code: "#foo [lang^=en] {}",
      message: messages.expected("#foo [lang^=en]", 0),
      line: 1,
      column: 1
    },
    {
      code: "#foo[lang^=en] {}",
      message: messages.expected("#foo[lang^=en]", 0),
      line: 1,
      column: 1
    },
    {
      code: "* #foo {}",
      message: messages.expected("* #foo", 0),
      line: 1,
      column: 1
    },
    {
      code: "#foo * {}",
      message: messages.expected("#foo *", 0),
      line: 1,
      column: 1
    },
    {
      code: "*#foo {}",
      message: messages.expected("*#foo", 0),
      line: 1,
      column: 1
    },
    {
      code: "#foo:hover {}",
      message: messages.expected("#foo:hover", 0),
      line: 1,
      column: 1
    },
    {
      code: ":not(#foo) {}",
      message: messages.expected("#foo", 0),
      line: 1,
      column: 6
    }
  ]
});

// Standard tests
testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: "#foo {}",
      description: "fewer than max id selectors"
    },
    {
      code: "#foo:hover {}",
      description: "pseudo selectors"
    },
    {
      code: "#foo #bar {}",
      description: "compound selector"
    },
    {
      code: "#foo, \n#bar {}",
      description: "multiple selectors: fewer than max id selectors"
    },
    {
      code: "#foo #bar, \n#bar #foo {}",
      description: "multiple selectors: exactly max id selectors"
    },
    {
      code: "#foo #bar:not(#baz) {}",
      description: ":not(): outside and inside"
    },
    {
      code: "#foo { #bar {} }",
      description: "nested selectors"
    },
    {
      code: "#foo { #bar > & {} }",
      description: "nested selectors: parent selector"
    },
    {
      code: "#foo, #bar { & > #foo {} }",
      description: "nested selectors: superfluous parent selector"
    },
    {
      code: "@media print { #foo #bar {} }",
      description: "media query: parent"
    },
    {
      code: "#foo { @media print { #bar {} } }",
      description: "media query: nested"
    }
  ],

  reject: [
    {
      code: "#foo #bar #baz {}",
      description: "compound selector: greater than max id selectors",
      message: messages.expected("#foo #bar #baz", 2),
      line: 1,
      column: 1
    },
    {
      code: "#foo, \n#bar #baz #foo {}",
      description: "multiple selectors: greater than max id selectors",
      message: messages.expected("#bar #baz #foo", 2),
      line: 2,
      column: 1
    },
    {
      code: "#foo #bar #baz:not(#quux) {}",
      description: ":not(): greater than max id selectors, outside",
      message: messages.expected("#foo #bar #baz:not(#quux)", 2),
      line: 1,
      column: 1
    },
    {
      code: "#foo { &:hover > #bar #baz {} }",
      description: "nested selectors: greater than max id selectors",
      message: messages.expected("#foo:hover > #bar #baz", 2),
      line: 1,
      column: 8
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "@keyframes spin { #{50% - $n} {} }"
    },
    {
      code:
        '@for $n from 1 through 10 { .n-#{$n} { content: "n: #{1 + 1}"; } }',
      description: "ignore sass interpolation inside @for"
    },
    {
      code:
        '@for $n from 1 through 10 { .n#{$n}-#{$n} { content: "n: #{1 + 1}"; } }',
      description:
        "ignore multiple sass interpolations in a selector inside @for"
    },
    {
      code:
        '@for $n from 1 through 10 { .n#{$n}n#{$n} { content: "n: #{1 + 1}"; } }',
      description:
        "ignore multiple sass interpolations in a selector inside @for"
    },
    {
      code: '@each $n in $vals { .n-#{$n} { content: "n: #{1 + 1}"; } }',
      description: "ignore sass interpolation inside @each"
    },
    {
      code: '@while $n < 10 { .n-#{$n} { content: "n: #{1 + 1}"; } }',
      description: "ignore sass interpolation inside @while"
    },
    {
      code: "div:nth-child(#{map-get($foo, bar)}) {}",
      description: "ignore sass map-get interpolation"
    },
    {
      code: "@for $n from 1 through 10 { .n-#{$n} #foo {} }",
      description: "ignore sass interpolation + id inside @for"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,
  syntax: "less",

  accept: [
    {
      code:
        '.for(@n: 1) when (@n <= 10) { .n-@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
      description: "ignore Less interpolation inside .for"
    },
    {
      code:
        '.for(@n: 1) when (@n <= 10) { .n-@{n}-@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
      description:
        "ignore multiple Less interpolations in a selector inside .for"
    },
    {
      code:
        '.for(@n: 1) when (@n <= 10) { .n-@{n}n@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
      description:
        "ignore multiple Less interpolations in a selector inside .for"
    },
    {
      code:
        '.each(@vals, @n: 1) when (@n <= length(@vals)) { @val: extract(@vals, @n); .n-@{val} { content: %("n: %d", 1 + 1); } .each(@vals, @n + 1); }',
      description: "ignore Less interpolation inside .each"
    },
    {
      code:
        '.while(@n: 0) when (@n < 10) { .n-@{n} { content: %("n: %d", 1 + 1); } .while(@n + 1) }',
      description: "ignore Less interpolation inside .while"
    },
    {
      code: ".for(@n: 1) when (@n <= 10) { .n-@{n} #foo {} .for(@n + 1) }",
      description: "ignore Less interpolation + id inside .for"
    }
  ]
});
