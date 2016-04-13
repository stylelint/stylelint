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
    code: "a { color: #fff; }",
  }, {
    code: "a { color: #FFF; }",
  }, {
    code: "a { color: rgb(0, 255, 0); }",
  }, {
    code: "a { font-size: 100%; }",
  }, {
    code: "a { width: 10px; }",
  }, {
    code: "a { display: block; }",
  }, {
    code: "a:hover { display: block; }",
  }, {
    code: "a:other { display: block; }",
  }, {
    code: "a::before { display: block; }",
  }, {
    code: "a::other { display: block; }",
  }, {
    code: "a { display: block !import; }",
  }, {
    code: "a { transition: -webkit-transform 2s; }",
  }, {
    code: "a { background-position: top right, 1em 5vh; }",
  }, {
    code: "a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }",
  }, {
    code: "a { transform: rotate(90deg); }",
    description: "ignore function",
  }, {
    code: "a { transform: ROTATE(90deg); }",
    description: "ignore function",
  }, {
    code: "a { width: /* BLOCK */ 1em; }",
    description: "ignore value keyword within comments",
  }, {
    code: "a::before { content: \"BLOCK\"}",
    description: "ignore value keyword within quotes",
  }, {
    code: "a::before { content: \"TeSt tEsT\"}",
    description: "ignore value within quotes",
  }, {
    code: "a { font-size: $fsBLOCK; }",
    description: "ignore preprocessor variable includes value keyword",
  }, {
    code: "a { font-size: @fsBLOCK; }",
    description: "ignore preprocessor variable includes value keyword",
  }, {
    code: "a { font-size: var(--some-fs-BLOCK); }",
    description: "ignore css variable includes value keyword",
  }, {
    code: "a { background-url: url(BLOCK); }",
    description: "ignore url function",
  }, {
    code: "a { displayBLOCK: block; }",
    description: "ignore property include value keyword",
  }, {
    code: "aBLOCK { display: block; }",
    description: "ignore type selector include value keyword",
  }, {
    code: "#aBLOCK { display: block; }",
    description: "ignore class selector include value keyword",
  }, {
    code: ".aBLOCK { display: block; }",
    description: "ignore class selector include value keyword",
  }, {
    code: "input[type=BLOCK] { display: block; }",
    description: "ignore class selector include value keyword",
  }, {
    code: "a:hoverBLOCK { display: block; }",
    description: "ignore pseudo-class include value keyword",
  }, {
    code: "a::beforeBLOCK { display: block; }",
    description: "ignore pseudo-class include value keyword",
  }, {
    code: "a { display: super-block; }",
    description: "work with unknown value keyword",
  }, {
    code: "@media (min-width: 768px) { color: red; }",
  }, {
    code: "@media screen { color: green; @media (min-width: 768px) { color: red; } }",
  }, {
    code: "a { color: red; border: 5px solid currentColor; }",
  } ],

  reject: [ {
    code: "a { display: Block; }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 14,
  }, {
    code: "a { display: bLoCk; }",
    message: messages.expected("bLoCk", "block"),
    line: 1,
    column: 14,
  }, {
    code: "a { display: BLOCK; }",
    message: messages.expected("BLOCK", "block"),
    line: 1,
    column: 14,
  }, {
    code: "a:hover { display: Block; }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 20,
  }, {
    code: "a:other { display: Block; }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 20,
  }, {
    code: "a::before { display: Block; }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 22,
  }, {
    code: "a::other { display: Block; }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 21,
  }, {
    code: "a { display: block !Import; }",
    message: messages.expected("!Import", "!import"),
    line: 1,
    column: 20,
  }, {
    code: "a { display: block !iMpOrT; }",
    message: messages.expected("!iMpOrT", "!import"),
    line: 1,
    column: 20,
  }, {
    code: "a { display: block !IMPORT; }",
    message: messages.expected("!IMPORT", "!import"),
    line: 1,
    column: 20,
  }, {
    code: "a { background-position: Top right, 1em 5vh; }",
    message: messages.expected("Top", "top"),
    line: 1,
    column: 26,
  }, {
    code: "a { background-position: top Right, 1em 5vh; }",
    message: messages.expected("Right", "right"),
    line: 1,
    column: 30,
  }, {
    code: "a { transition: -Webkit-transform 2s; }",
    message: messages.expected("-Webkit-transform", "-webkit-transform"),
    line: 1,
    column: 17,
  }, {
    code: "a { transition: -webkit-Transform 2s; }",
    message: messages.expected("-webkit-Transform", "-webkit-transform"),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: linear-gradient(To right, white calc(100% - 50em), silver); }",
    message: messages.expected("To", "to"),
    line: 1,
    column: 39,
  }, {
    code: "a { background-image: linear-gradient(to Right, white calc(100% - 50em), silver); }",
    message: messages.expected("Right", "right"),
    line: 1,
    column: 42,
  }, {
    code: "a { background-image: linear-gradient(to right, white calc(100% - 50em), Silver); }",
    message: messages.expected("Silver", "silver"),
    line: 1,
    column: 74,
  }, {
    code: "a { display: Super-block; }",
    description: "work with unknown value keyword",
    message: messages.expected("Super-block", "super-block"),
    line: 1,
    column: 14,
  }, {
    code: "@media (min-width: 768px) { color: Red; }",
    message: messages.expected("Red", "red"),
    line: 1,
    column: 36,
  }, {
    code: "@media screen { color: green; @media (min-width: 768px) { color: Red; } }",
    message: messages.expected("Red", "red"),
    line: 1,
    column: 66,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["lower"],

  accept: [ {
    code: "a { width: 1em; \n// display: BLOCK\n }",
    description: "ignore unit within comments",
  }, {
    code: "a { $display: block; }",
  }, {
    code: "a { margin: 10PX + 10px; }",
  }, {
    code: "a { margin: $margin; }",
  }, {
    code: "a { margin: $mArGiN; }",
  }, {
    code: "a { margin: $MARGIN; }",
  }, {
    code: "a { margin: $margin + 10px; }",
  }, {
    code: "a { margin: $mArGiN + 10px; }",
  }, {
    code: "a { margin: $MARGIN + 10px; }",
  }, {
    code: "a { color: some-function(10px); }",
  }, {
    code: "a { color: Some-function(10px); }",
  }, {
    code: "a { color: some-Function(10px); }",
  }, {
    code: "p { font: #{$Font-size}/#{$line-height}; }",
  }, {
    code: "p { font: #{$font-Size}/#{$line-height}; }",
  }, {
    code: "p { font: #{$font-size}/#{$Line-height}; }",
  }, {
    code: "p { font: #{$font-size}/#{$line-Height}; }",
  }, {
    code: "a { background-color: spin(lighten($Base, 25%), 8); }",
  }, {
    code: "a { background-color: spin(Lighten($base, 25%), 8); }",
  }, {
    code: "a { background-color: Spin(lighten($base, 25%), 8); }",
  }, {
    code: ".content { .link { display: block; } }",
  }, {
    code: ".a { &-link { display: block } }",
  }, {
    code: "$map: (display-first: block, display-second: inline);",
  }, {
    code: "a { background-#{$variable}: property#{$variable}; }",
  }, {
    code: "a { background-#{$variable}: PROPERTY#{$variable}; }",
  } ],

  reject: [ {
    code: "a { $display: Block; }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 15,
  }, {
    code: "a { $display: bLoCk; }",
    message: messages.expected("bLoCk", "block"),
    line: 1,
    column: 15,
  }, {
    code: "a { $display: BLOCK; }",
    message: messages.expected("BLOCK", "block"),
    line: 1,
    column: 15,
  }, {
    code: "a { font: (italic Bold 10px/8PX) }",
    message: messages.expected("Bold", "bold"),
    line: 1,
    column: 19,
  }, {
    code: ".content { .link { display: Block; } }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 29,
  }, {
    code: ".a { &-link { display: Block } }",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 24,
  },{
    code: "$map: (Display-first: block, display-second: inline);",
    message: messages.expected("Display-first", "display-first"),
    line: 1,
    column: 8,
  }, {
    code: "$map: (display-first: Block, display-second: inline);",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 23,
  }, {
    code: "$map: (display-first: block, display-second: Inline);",
    message: messages.expected("Inline", "inline"),
    line: 1,
    column: 46,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["lower"],

  accept: [ {
    code: "a { width: 1em; \n// display: BLOCK\n }",
    description: "ignore unit within comments",
  }, {
    code: "a { @display: block; }",
  }, {
    code: "a { margin: 10PX + 10px; }",
  }, {
    code: "a { margin: @margin; }",
  }, {
    code: "a { margin: @mArGiN; }",
  }, {
    code: "a { margin: @MARGIN; }",
  }, {
    code: "a { margin: @margin + 10px; }",
  }, {
    code: "a { margin: @mArGiN + 10px; }",
  }, {
    code: "a { margin: @MARGIN + 10px; }",
  }, {
    code: ".bordered { border-bottom: solid 2px black; }",
    description: "inside mixin",
  }, {
    code: "#header { .navigation { display: block; } }",
    description: "nested",
  }, {
    code: "a { color: some-function(10px); }",
  }, {
    code: "a { color: Some-function(10px); }",
  }, {
    code: "a { color: some-Function(10px); }",
  }, {
    code: "a { background-color: spin(lighten(@Base, 25%), 8); }",
  }, {
    code: "a { background-color: spin(lighten(@Base, 25%), 8); }",
  }, {
    code: "a { background-color: Spin(Lighten(@Base, 25%), 8); }",
  }, {
    code: "@detached-ruleset: { background: red; };",
  }, {
    code: ".a { &-link { background: red; } };",
  } ],

  reject: [ {
    code: ".bordered { border-bottom: Solid 2px black; }",
    description: "inside mixin",
    message: messages.expected("Solid", "solid"),
    line: 1,
    column: 28,
  }, {
    code: ".bordered { border-bottom: solid 2px Black; }",
    description: "inside mixin",
    message: messages.expected("Black", "black"),
    line: 1,
    column: 38,
  }, {
    code: "#header { .navigation { display: Block; } }",
    description: "nested",
    message: messages.expected("Block", "block"),
    line: 1,
    column: 34,
  }, {
    code: "@detached-ruleset: { background: Red; };",
    message: messages.expected("Red", "red"),
    line: 1,
    column: 34,
  }, {
    code: ".a { &-link { background: Red; } };",
    message: messages.expected("Red", "red"),
    line: 1,
    column: 27,
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
    code: "a { color: #fff; }",
  }, {
    code: "a { color: #FFF; }",
  }, {
    code: "a { color: rgb(0, 255, 0); }",
  }, {
    code: "a { font-size: 100%; }",
  }, {
    code: "a { width: 10px; }",
  }, {
    code: "a { display: BLOCK; }",
  }, {
    code: "a:hover { display: BLOCK; }",
  }, {
    code: "a:other { display: BLOCK; }",
  }, {
    code: "a::before { display: BLOCK; }",
  }, {
    code: "a::other { display: BLOCK; }",
  }, {
    code: "a { display: BLOCK !IMPORT; }",
  }, {
    code: "a { transition: -WEBKIT-TRANSFORM 2s; }",
  }, {
    code: "a { background-position: TOP RIGHT, 1em 5vh; }",
  }, {
    code: "a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), SILVER); }",
  }, {
    code: "a { transform: rotate(90deg); }",
    description: "ignore function",
  }, {
    code: "a { transform: ROTATE(90deg); }",
    description: "ignore function",
  }, {
    code: "a { width: /* block */ 1em; }",
    description: "ignore value keyword within comments",
  }, {
    code: "a::before { content: \"block\"}",
    description: "ignore value keyword within quotes",
  }, {
    code: "a::before { content: \"TeSt tEsT\"}",
    description: "ignore value within quotes",
  }, {
    code: "a { font-size: $fsblock; }",
    description: "ignore preprocessor variable includes value keyword",
  }, {
    code: "a { font-size: @fsblock; }",
    description: "ignore preprocessor variable includes value keyword",
  }, {
    code: "a { font-size: var(--some-fs-block); }",
    description: "ignore css variable includes value keyword",
  }, {
    code: "a { background-url: url(block); }",
    description: "ignore url function",
  }, {
    code: "a { displayblock: BLOCK; }",
    description: "ignore property include value keyword",
  }, {
    code: "ablock { display: BLOCK; }",
    description: "ignore type selector include value keyword",
  }, {
    code: "#ablock { display: BLOCK; }",
    description: "ignore class selector include value keyword",
  }, {
    code: ".ablock { display: BLOCK; }",
    description: "ignore class selector include value keyword",
  }, {
    code: "input[type=block] { display: BLOCK; }",
    description: "ignore class selector include value keyword",
  }, {
    code: "a:hoverblock { display: BLOCK; }",
    description: "ignore pseudo-class include value keyword",
  }, {
    code: "a::beforeblock { display: BLOCK; }",
    description: "ignore pseudo-class include value keyword",
  }, {
    code: "a { display: SUPER-BLOCK; }",
    description: "work with unknown value keyword",
  }, {
    code: "@media (min-width: 768px) { color: RED; }",
  }, {
    code: "@media screen { color: GREEN; @media (min-width: 768px) { color: RED; } }",
  }, {
    code: "a { color: RED; border: 5px SOLID currentColor; }",
  } ],

  reject: [ {
    code: "a { display: Block; }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 14,
  }, {
    code: "a { display: bLoCk; }",
    message: messages.expected("bLoCk", "BLOCK"),
    line: 1,
    column: 14,
  }, {
    code: "a { display: block; }",
    message: messages.expected("block", "BLOCK"),
    line: 1,
    column: 14,
  }, {
    code: "a:hover { display: Block; }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 20,
  }, {
    code: "a:other { display: Block; }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 20,
  }, {
    code: "a::before { display: Block; }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 22,
  }, {
    code: "a::other { display: Block; }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 21,
  }, {
    code: "a { display: BLOCK !Import; }",
    message: messages.expected("!Import", "!IMPORT"),
    line: 1,
    column: 20,
  }, {
    code: "a { display: BLOCK !iMpOrT; }",
    message: messages.expected("!iMpOrT", "!IMPORT"),
    line: 1,
    column: 20,
  }, {
    code: "a { display: BLOCK !import; }",
    message: messages.expected("!import", "!IMPORT"),
    line: 1,
    column: 20,
  }, {
    code: "a { background-position: Top RIGHT, 1em 5vh; }",
    message: messages.expected("Top", "TOP"),
    line: 1,
    column: 26,
  }, {
    code: "a { background-position: TOP Right, 1em 5vh; }",
    message: messages.expected("Right", "RIGHT"),
    line: 1,
    column: 30,
  }, {
    code: "a { transition: -Webkit-transform 2s; }",
    message: messages.expected("-Webkit-transform", "-WEBKIT-TRANSFORM"),
    line: 1,
    column: 17,
  }, {
    code: "a { transition: -webkit-Transform 2s; }",
    message: messages.expected("-webkit-Transform", "-WEBKIT-TRANSFORM"),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: linear-gradient(To RIGHT, WHITE calc(100% - 50em), SILVER); }",
    message: messages.expected("To", "TO"),
    line: 1,
    column: 39,
  }, {
    code: "a { background-image: linear-gradient(TO Right, WHITE calc(100% - 50em), SILVER); }",
    message: messages.expected("Right", "RIGHT"),
    line: 1,
    column: 42,
  }, {
    code: "a { background-image: linear-gradient(TO RIGHT, WHITE calc(100% - 50em), Silver); }",
    message: messages.expected("Silver", "SILVER"),
    line: 1,
    column: 74,
  }, {
    code: "a { display: Super-block; }",
    description: "work with unknown value keyword",
    message: messages.expected("Super-block", "SUPER-BLOCK"),
    line: 1,
    column: 14,
  }, {
    code: "@media (min-width: 768px) { color: Red; }",
    message: messages.expected("Red", "RED"),
    line: 1,
    column: 36,
  }, {
    code: "@media screen { color: GREEN; @media (min-width: 768px) { color: Red; } }",
    message: messages.expected("Red", "RED"),
    line: 1,
    column: 66,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["upper"],

  accept: [ {
    code: "a { width: 1em; \n// display: block\n }",
    description: "ignore unit within comments",
  }, {
    code: "a { $display: BLOCK; }",
  }, {
    code: "a { margin: 10PX + 10px; }",
  }, {
    code: "a { margin: $margin; }",
  }, {
    code: "a { margin: $mArGiN; }",
  }, {
    code: "a { margin: $MARGIN; }",
  }, {
    code: "a { margin: $margin + 10px; }",
  }, {
    code: "a { margin: $mArGiN + 10px; }",
  }, {
    code: "a { margin: $MARGIN + 10px; }",
  }, {
    code: "a { color: some-function(10px); }",
  }, {
    code: "a { color: Some-function(10px); }",
  }, {
    code: "a { color: some-Function(10px); }",
  }, {
    code: "p { font: #{$Font-size}/#{$line-height}; }",
  }, {
    code: "p { font: #{$font-Size}/#{$line-height}; }",
  }, {
    code: "p { font: #{$font-size}/#{$Line-height}; }",
  }, {
    code: "p { font: #{$font-size}/#{$line-Height}; }",
  }, {
    code: "a { background-color: spin(lighten($Base, 25%), 8); }",
  }, {
    code: "a { background-color: spin(Lighten($base, 25%), 8); }",
  }, {
    code: "a { background-color: Spin(lighten($base, 25%), 8); }",
  }, {
    code: ".content { .link { display: BLOCK; } }",
  }, {
    code: ".a { &-link { display: BLOCK } }",
  }, {
    code: "$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: INLINE);",
  }, {
    code: "a { background-#{$variable}: property#{$variable}; }",
  }, {
    code: "a { background-#{$variable}: PROPERTY#{$variable}; }",
  } ],

  reject: [ {
    code: "a { $display: Block; }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 15,
  }, {
    code: "a { $display: bLoCk; }",
    message: messages.expected("bLoCk", "BLOCK"),
    line: 1,
    column: 15,
  }, {
    code: "a { $display: block; }",
    message: messages.expected("block", "BLOCK"),
    line: 1,
    column: 15,
  }, {
    code: "a { font: (ITALIC Bold 10px/8PX) }",
    message: messages.expected("Bold", "BOLD"),
    line: 1,
    column: 19,
  }, {
    code: ".content { .link { display: Block; } }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 29,
  }, {
    code: ".a { &-link { display: Block } }",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 24,
  }, {
    code: "$map: (display-first: BLOCK, DISPLAY-SECOND: INLINE);",
    message: messages.expected("display-first", "DISPLAY-FIRST"),
    line: 1,
    column: 8,
  }, {
    code: "$map: (DISPLAY-FIRST: Block, DISPLAY-SECOND: INLINE);",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 23,
  }, {
    code: "$map: (DISPLAY-FIRST: BLOCK, DISPLAY-SECOND: Inline);",
    message: messages.expected("Inline", "INLINE"),
    line: 1,
    column: 46,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["upper"],

  accept: [ {
    code: "a { width: 1em; \n// display: block\n }",
    description: "ignore unit within comments",
  }, {
    code: "a { @display: BLOCK; }",
  }, {
    code: "a { margin: 10PX + 10px; }",
  }, {
    code: "a { margin: @margin; }",
  }, {
    code: "a { margin: @mArGiN; }",
  }, {
    code: "a { margin: @MARGIN; }",
  }, {
    code: "a { margin: @margin + 10px; }",
  }, {
    code: "a { margin: @mArGiN + 10px; }",
  }, {
    code: "a { margin: @MARGIN + 10px; }",
  }, {
    code: ".bordered { border-bottom: SOLID 2px BLOCK; }",
    description: "inside mixin",
  }, {
    code: "#header { .navigation { display: BLOCK; } }",
    description: "nested",
  }, {
    code: "a { color: some-function(10px); }",
  }, {
    code: "a { color: Some-function(10px); }",
  }, {
    code: "a { color: some-Function(10px); }",
  }, {
    code: "a { background-color: spin(lighten(@Base, 25%), 8); }",
  }, {
    code: "a { background-color: spin(lighten(@Base, 25%), 8); }",
  }, {
    code: "a { background-color: Spin(Lighten(@Base, 25%), 8); }",
  }, {
    code: "@detached-ruleset: { background: RED; };",
  }, {
    code: ".a { &-link { background: RED; } };",
  } ],

  reject: [ {
    code: ".bordered { border-bottom: Solid 2px BLACK; }",
    description: "inside mixin",
    message: messages.expected("Solid", "SOLID"),
    line: 1,
    column: 28,
  }, {
    code: ".bordered { border-bottom: SOLID 2px Black; }",
    description: "inside mixin",
    message: messages.expected("Black", "BLACK"),
    line: 1,
    column: 38,
  }, {
    code: "#header { .navigation { display: Block; } }",
    description: "nested",
    message: messages.expected("Block", "BLOCK"),
    line: 1,
    column: 34,
  }, {
    code: "@detached-ruleset: { background: Red; };",
    message: messages.expected("Red", "RED"),
    line: 1,
    column: 34,
  }, {
    code: ".a { &-link { background: Red; } };",
    message: messages.expected("Red", "RED"),
    line: 1,
    column: 27,
  } ],
})
