"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: ".foo { color: green; }"
    },
    {
      code: ".foo { COLoR: green; }"
    },
    {
      code: ".foo { fill: black; }"
    },
    {
      code: ".foo { -webkit-align-self: center; }"
    },
    {
      code: ".foo { align-self: center; }"
    },
    {
      code: ".foo { --bg-color: white; }",
      description: "ignore standard CSS variables"
    },
    {
      code: ".foo { -moz-align-self: center; }",
      description: "ignore vendor prefixes"
    },
    {
      code: ".foo { *width: 100px; }",
      description: "ignore CSS hacks"
    }
  ],

  reject: [
    {
      code: ".foo { colr: blue; }",
      message: messages.rejected("colr"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { COLR: blue; }",
      message: messages.rejected("COLR"),
      line: 1,
      column: 8
    },
    {
      code: ".foo {\n  colr: blue;\n}",
      message: messages.rejected("colr"),
      line: 2,
      column: 3
    },
    {
      code: ".foo { *wdth: 100px; }",
      message: messages.rejected("wdth"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { --custom-property-set: { colr: blue; } }",
      message: messages.rejected("colr"),
      line: 1,
      column: 33
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [true],

  accept: [
    {
      code: ".foo { $bgColor: white; }",
      description: "ignore SCSS variables"
    },
    {
      code: ".foo { #{$prop}: black; }",
      description: "ignore property interpolation"
    },
    {
      code: ".foo { border: { style: solid; } }",
      description: "ignore nested properties"
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "less",
  config: [true],

  accept: [
    {
      code: ".foo { @bgColor: white; }",
      description: "ignore LESS variables"
    },
    {
      code: ".foo { @{prop}: black; }",
      description: "ignore property interpolation"
    },
    {
      code: ".foo { transform+: rotate(15deg); }",
      descritpion: "Append property value with space usign +"
    },
    {
      code: ".foo { transform+_: rotate(15deg); }",
      descritpion: "Append property value with space using +_"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreProperties: ["-moz-overflow-scrolling", "/^my-/"],
      checkPrefixed: true
    }
  ],

  accept: [
    {
      code: ".foo { -webkit-overflow-scrolling: auto; }"
    },
    {
      code: ".foo { -moz-overflow-scrolling: auto; }"
    },
    {
      code: ".foo { my-property: 1; }"
    },
    {
      code: ".foo { my-other-property: 1; }"
    }
  ],

  reject: [
    {
      code: ".foo { overflow-scrolling: auto; }",
      message: messages.rejected("overflow-scrolling"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { not-my-property: 1; }",
      message: messages.rejected("not-my-property"),
      line: 1,
      column: 8
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { checkPrefixed: true }],

  accept: [
    {
      code: ".foo { -webkit-overflow-scrolling: auto; }"
    },
    {
      code: ".foo { -moz-box-flex: 0; }"
    }
  ],

  reject: [
    {
      code: ".foo { -moz-overflow-scrolling: auto; }",
      message: messages.rejected("-moz-overflow-scrolling"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { -moz-align-self: center; }",
      message: messages.rejected("-moz-align-self"),
      line: 1,
      column: 8
    }
  ]
});
