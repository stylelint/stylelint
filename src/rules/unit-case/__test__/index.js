import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["lower"],

  accept: [ {
    code: "a { line-height: 1; }",
  }, {
    code: "a { color: #000; }",
  }, {
    code: "a { font-size: 100%; }",
  }, {
    code: "a { width: 10px; }",
  }, {
    code: "a { margin: 0 10em 5rem 2in; }",
  }, {
    code: "a { background-position: top right, 1em 5vh; }",
  }, {
    code: "a { top: calc(10em - 3em); }",
  }, {
    code: "a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }",
  }, {
    code: "a { transform: rotate(90deg); }",
  }, {
    code: "a { color: green; }",
    description: "ignore keyword",
  }, {
    code: "a { color: green10PX; }",
    description: "ignore unit within keyword",
  }, {
    code: "a { width: /* 100PX */ 1em; }",
    description: "ignore unit within comments",
  }, {
    code: "a::before { content: \"10PX\"}",
    description: "ignore unit within quotes",
  }, {
    code: "a { font-size: $fs10PX; }",
    description: "ignore preprocessor variable includes unit",
  }, {
    code: "a { font-size: @fs10PX; }",
    description: "ignore preprocessor variable includes unit",
  }, {
    code: "a { font-size: var(--some-fs-10PX); }",
    description: "ignore css variable includes unit",
  }, {
    code: "a { margin: url(13PX); }",
    description: "ignore url function",
  }, {
    code: "a { marginPX: 10px; }",
    description: "ignore property include unit",
  }, {
    code: "a10PX { margin: 10px; }",
    description: "ignore type selector include unit",
  }, {
    code: "#a10PX { margin: 10px; }",
    description: "ignore class selector include unit",
  }, {
    code: ".a10PX { margin: 10px; }",
    description: "ignore class selector include unit",
  }, {
    code: "input[type=10PX] { margin: 10px; }",
    description: "ignore class selector include unit",
  }, {
    code: "a:hover10PX { margin: 10px; }",
    description: "ignore pseudo-class include unit",
  }, {
    code: "a::before10PX { margin: 10px; }",
    description: "ignore pseudo-class include unit",
  }, {
    code: "a { margin: 13xpx; }",
    description: "work with unknown units",
  } ],

  reject: [ {
    code: "a { width: 10pX; }",
    message: messages.expected("pX", "px"),
    line: 1,
    column: 12,
  }, {
    code: "a { width: 10Px; }",
    message: messages.expected("Px", "px"),
    line: 1,
    column: 12,
  }, {
    code: "a { width: 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 12,
  }, {
    code: "a { margin: 10px 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 18,
  }, {
    code: "a { margin: calc(10px + 10PX); }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 25,
  }, {
    code: "a { margin: -webkit-calc(13PX + 10px); }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 26,
  }, {
    code: "a { margin: some-function(13PX + 10px); }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 27,
  }, {
    code: "root { --margin: 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 18,
  }, {
    code: "root { --margin: 10px + 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 25,
  }, {
    code: "a { margin: 13XPX; }",
    message: messages.expected("XPX", "xpx"),
    description: "work with unknown units",
    line: 1,
    column: 13,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["lower"],

  accept: [{
    code: "a { width: 1em; \n// width: 10PX\n }",
    description: "ignore unit within comments",
  }],

  reject: [ {
    code: "a { margin: 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: 10pX; }",
    message: messages.expected("pX", "px"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: 10Px; }",
    message: messages.expected("Px", "px"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: 10PX + 10px; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 13,
  }, {
    code: "a { $margin: 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 14,
  }, {
    code: "a { $margin: 10px + 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 21,
  }, {
    code: "a { margin: $margin + 10PX; }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 23,
  }, {
    code: "$breakpoints: ( small: 767px, medium: 992PX, large: 1200px );",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 39,
  }, {
    code: "a { font: (italic bold 10px/8PX) }",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 29,
  }, {
    code: "font: 14PX/#{$line-height};",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 7,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["lower"],

  accept: [{
    code: "a { width: 1em; \n// width: 10PX\n }",
    description: "ignore unit within comments",
  }],

  reject: [ {
    code: "@variable: 10PX",
    message: messages.expected("PX", "px"),
    line: 1,
    column: 12,
  }, {
    code: "@variable: 10pX",
    message: messages.expected("pX", "px"),
    line: 1,
    column: 12,
  }, {
    code: "@variable: 10Px",
    message: messages.expected("Px", "px"),
    line: 1,
    column: 12,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["upper"],

  accept: [ {
    code: "a { line-height: 1; }",
  }, {
    code: "a { color: #000; }",
  }, {
    code: "a { font-size: 100%; }",
  }, {
    code: "a { width: 10PX; }",
  }, {
    code: "a { margin: 0 10EM 5REM 2IN; }",
  }, {
    code: "a { background-position: top right, 1EM 5VH; }",
  }, {
    code: "a { top: calc(10EM - 3EM); }",
  }, {
    code: "a { background-image: linear-gradient(to right, white calc(100% - 50EM), silver); }",
  }, {
    code: "a { transform: rotate(90DEG); }",
  }, {
    code: "a { color: green; }",
    description: "ignore keyword",
  }, {
    code: "a { color: green10px; }",
    description: "ignore unit within keyword",
  }, {
    code: "a { width: /* 100px */ 1EM; }",
    description: "ignore unit within comments",
  }, {
    code: "a::before { content: \"10px\"}",
    description: "ignore unit within quotes",
  }, {
    code: "a { font-size: $fs10px; }",
    description: "ignore preprocessor variable includes unit",
  }, {
    code: "a { font-size: @fs10px; }",
    description: "ignore preprocessor variable includes unit",
  }, {
    code: "a { font-size: var(--some-fs-10px); }",
    description: "ignore css variable includes unit",
  }, {
    code: "a { margin: url(13px); }",
    description: "ignore url function",
  }, {
    code: "a { margin10px: 10PX; }",
    description: "ignore property include unit",
  }, {
    code: "a10px { margin: 10PX; }",
    description: "ignore type selector include unit",
  }, {
    code: "#a10px { margin: 10PX; }",
    description: "ignore class selector include unit",
  }, {
    code: ".a10px { margin: 10PX; }",
    description: "ignore class selector include unit",
  }, {
    code: "input[type=10px] { margin: 10PX; }",
    description: "ignore class selector include unit",
  }, {
    code: "a:hover10px { margin: 10PX; }",
    description: "ignore pseudo-class include unit",
  }, {
    code: "a::before10px { margin: 10PX; }",
    description: "ignore pseudo-class include unit",
  }, {
    code: "a { margin: 13XPX; }",
    description: "work with unknown units",
  } ],

  reject: [ {
    code: "a { width: 10pX; }",
    message: messages.expected("pX", "PX"),
    line: 1,
    column: 12,
  }, {
    code: "a { width: 10Px; }",
    message: messages.expected("Px", "PX"),
    line: 1,
    column: 12,
  }, {
    code: "a { width: 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 12,
  }, {
    code: "a { margin: 10PX 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 18,
  }, {
    code: "a { margin: calc(10PX + 10px); }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 25,
  }, {
    code: "a { margin: -webkit-calc(13px + 10PX); }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 26,
  }, {
    code: "a { margin: some-function(13px + 10PX); }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 27,
  }, {
    code: "root { --margin: 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 18,
  }, {
    code: "root { --margin: 10PX + 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 25,
  }, {
    code: "a { margin: 13xpx; }",
    message: messages.expected("xpx", "XPX"),
    description: "work with unknown units",
    line: 1,
    column: 13,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["upper"],

  accept: [{
    code: "a { width: 1EM; \n// width: 10px\n }",
    description: "ignore unit within comments",
  }],

  reject: [ {
    code: "a { margin: 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: 10pX; }",
    message: messages.expected("pX", "PX"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: 10Px; }",
    message: messages.expected("Px", "PX"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: 10px + 10PX; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 13,
  }, {
    code: "a { $margin: 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 14,
  }, {
    code: "a { $margin: 10PX + 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 21,
  }, {
    code: "a { margin: $margin + 10px; }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 23,
  }, {
    code: "$breakpoints: ( small: 767PX, medium: 992px, large: 1200PX );",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 39,
  }, {
    code: "a { font: (italic bold 10PX/8px) }",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 29,
  }, {
    code: "font: 14px/#{$line-height};",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 7,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["upper"],

  accept: [{
    code: "a { width: 1EM; \n// width: 10px\n }",
    description: "ignore unit within comments",
  }],

  reject: [ {
    code: "@variable: 10px",
    message: messages.expected("px", "PX"),
    line: 1,
    column: 12,
  }, {
    code: "@variable: 10pX",
    message: messages.expected("pX", "PX"),
    line: 1,
    column: 12,
  }, {
    code: "@variable: 10Px",
    message: messages.expected("Px", "PX"),
    line: 1,
    column: 12,
  } ],
})
