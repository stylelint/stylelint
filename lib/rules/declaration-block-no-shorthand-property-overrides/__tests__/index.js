"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "a { padding: 10px; }"
    },
    {
      code: "a { padding: 10px; padding-left: 20px; }"
    },
    {
      code: "@media (color) { padding: 10px; padding-left: 20px; }"
    },
    {
      code: "a { @media (color) { padding: 10px; padding-left: 20px; }}"
    },
    {
      code: "a { padding-left: 10px; { b { padding: 20px; }}}",
      description: "nested related properties"
    },
    {
      code:
        "a { border-top-width: 1px; top: 0; bottom: 3px; border-bottom: 2px solid blue; }"
    },
    {
      code:
        "a { transition-property: opacity; } a { transition: opacity 1s linear; }"
    },
    {
      code:
        "a { -webkit-transition-property: opacity; transition: opacity 1s linear; }"
    },
    {
      code:
        "a { transition-property: opacity; -webkit-transition: opacity 1s linear; }"
    }
  ],

  reject: [
    {
      code: "a { padding-left: 10px; padding: 20px; }",
      message: messages.rejected("padding", "padding-left")
    },
    {
      code: "a { pAdDiNg-lEfT: 10Px; pAdDiNg: 20Px; }",
      message: messages.rejected("pAdDiNg", "pAdDiNg-lEfT")
    },
    {
      code: "a { PADDING-LEFT: 10PX; PADDING: 20PX; }",
      message: messages.rejected("PADDING", "PADDING-LEFT")
    },
    {
      code:
        "a { padding-left: 10px; { b { padding-top: 10px; padding: 20px; }}}",
      description: "override within nested rule",
      message: messages.rejected("padding", "padding-top")
    },
    {
      code:
        "a { border-top-width: 1px; top: 0; bottom: 3px; border: 2px solid blue; }",
      message: messages.rejected("border", "border-top-width")
    },
    {
      code:
        "a { transition-property: opacity; transition: opacity 1s linear; }",
      message: messages.rejected("transition", "transition-property")
    },
    {
      code: "a { background-repeat: no-repeat; background: url(lion.png); }",
      message: messages.rejected("background", "background-repeat")
    },
    {
      code:
        "@media (color) { background-repeat: no-repeat; background: url(lion.png); }",
      message: messages.rejected("background", "background-repeat")
    },
    {
      code:
        "a { @media (color) { background-repeat: no-repeat; background: url(lion.png); }}",
      message: messages.rejected("background", "background-repeat")
    },
    {
      code:
        "a { -webkit-transition-property: opacity; -webkit-transition: opacity 1s linear; }",
      message: messages.rejected(
        "-webkit-transition",
        "-webkit-transition-property"
      )
    },
    {
      code:
        "a { -WEBKIT-transition-property: opacity; -webKIT-transition: opacity 1s linear; }",
      message: messages.rejected(
        "-webKIT-transition",
        "-WEBKIT-transition-property"
      )
    }
  ]
});
