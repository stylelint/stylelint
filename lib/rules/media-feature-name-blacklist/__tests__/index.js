"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["max-width", "--wide-viewport", "width", "/^my-/", "color"],

  accept: [
    {
      code: "@media (min-width: 50em) { }"
    },
    {
      code: "@media (MaX-wIdTh: 50em) { }"
    },
    {
      code: "@media (MiN-wIdTh: 50em) { }"
    },
    {
      code: "@media (--wide-viewport) { }",
      description: "ignore custom media query"
    },
    {
      code: "@media (/* max-width: 50em */ min-width: 50em) { }",
      description: "ignore comments"
    },
    {
      code: "@media (width <= 50em) { }",
      description: "ignore media features in a range context"
    },
    {
      code: "@media (400px < width < 1000px) { }",
      description: "ignore media features in a range context"
    },
    {
      code: "@media (monochrome) { }",
      description: "boolean feature name"
    }
  ],

  reject: [
    {
      code: "@media (max-width: 50em) { }",
      message: messages.rejected("max-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media print and (max-width: 50em) { }",
      message: messages.rejected("max-width"),
      line: 1,
      column: 19
    },
    {
      code:
        "@media handheld and (min-width: 20em), screen and (max-width: 20em) { }",
      message: messages.rejected("max-width"),
      line: 1,
      column: 52
    },
    {
      code: "@media (my-width: 50em) { }",
      message: messages.rejected("my-width"),
      line: 1,
      column: 9
    },
    {
      code: "@media (color) { }",
      message: messages.rejected("color"),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [/^my-/],

  accept: [
    {
      code: "@media (min-width: 50em) { }"
    }
  ],

  reject: [
    {
      code: "@media (my-width: 50em) { }",
      message: messages.rejected("my-width"),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["feature-name"],
  syntax: "less",

  accept: [
    {
      code: "@media @feature-name and (orientation: landscape) { }"
    },
    {
      code: "@media @feature-name { }"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["feature-name", "width"],
  syntax: "scss",

  accept: [
    {
      code: "@media not all and ($feature-name) { }"
    },
    {
      code: "@media not all and ($FEATURE-NAME) { }"
    },
    {
      code: "@media not all and (#{feature-name}) { }"
    },
    {
      code: "@media not all and (#{FEATURE-NAME}) { }"
    },
    {
      code: "@media ($feature-name: $value) { }"
    },
    {
      code: "@media ($FEATURE-NAME: $value) { }"
    },
    {
      code: "@media (#{$feature-name}: $value) { }"
    },
    {
      code: "@media (#{$FEATURE-NAME}: $value) { }"
    },
    {
      code: "@media ('min-' + $width: $value) { }"
    },
    {
      code: "@media ('MIN-' + $WIDTH: $value) { }"
    },
    {
      code: "@media ($value + 'width': $value) { }"
    },
    {
      code: "@media ($VALUE + 'WIDTH': $value) { }"
    },
    {
      code: "@media (#{$width}: $value) { }"
    },
    {
      code: "@media (#{$WIDTH}: $value) { }"
    },
    {
      code: "@media #{$feature-name} { }"
    }
  ]
});
