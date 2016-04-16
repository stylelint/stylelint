import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["lower"],

  accept: [ {
    code: "a { }",
  }, {
    code: "a { display: block; }",
  }, {
    code: "a { border-radius: 8px; }",
  }, {
    code: "a:hover { display: block; }",
  }, {
    code: "a:focus { display: block; }",
  }, {
    code: "a:other { display: block; }",
  }, {
    code: "a::before { display: block; }",
  }, {
    code: "a::other { display: block; }",
  }, {
    code: ":root { --custom-property-set: {} }",
  }, {
    code: ":root { --custom-property-name: red; }",
  }, {
    code: ":root { --custom-PropertyName: red; }",
  }, {
    code: "a { -webkit-animation-duration: 3s; }",
  }, {
    code: "@media screen and (orientation: landscape) { width: 500px; }",
  }, {
    code: "a { property: value; }",
    description: "non-standard property",
  } ],

  reject: [ {
    code: "a { Display: block; }",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 5,
  }, {
    code: "a { DisplaY: block; }",
    message: messages.expected("DisplaY", "display"),
    line: 1,
    column: 5,
  }, {
    code: "a { DISPLAY: block; }",
    message: messages.expected("DISPLAY", "display"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-Radius: block; }",
    message: messages.expected("border-Radius", "border-radius"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-RADIUS: block; }",
    message: messages.expected("border-RADIUS", "border-radius"),
    line: 1,
    column: 5,
  }, {
    code: "a { BORDER-radius: block; }",
    message: messages.expected("BORDER-radius", "border-radius"),
    line: 1,
    column: 5,
  }, {
    code: "a { BORDER-RADIUS: block; }",
    message: messages.expected("BORDER-RADIUS", "border-radius"),
    line: 1,
    column: 5,
  }, {
    code: "a { -WEBKIT-animation-duration: 3s; }",
    message: messages.expected("-WEBKIT-animation-duration", "-webkit-animation-duration"),
    line: 1,
    column: 5,
  }, {
    code: "a { -webkit-Animation-duration: 3s; }",
    message: messages.expected("-webkit-Animation-duration", "-webkit-animation-duration"),
    line: 1,
    column: 5,
  }, {
    code: "a:hover { Display: block; }",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 11,
  }, {
    code: "a:focus { Display: block; }",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 11,
  }, {
    code: "a:other { Display: block; }",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 11,
  }, {
    code: "a::before { Display: block; }",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 13,
  }, {
    code: "a::other { Display: block; }",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 12,
  }, {
    code: "@media screen and (orientation: landscape) { Width: 500px; }",
    message: messages.expected("Width", "width"),
    line: 1,
    column: 46,
  }, {
    code: "a { Property: value; }",
    description: "non-standard property",
    message: messages.expected("Property", "property"),
    line: 1,
    column: 5,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["lower"],

  accept: [ {
    code: "$width: 5em;",
    description: "ignore variable",
  }, {
    code: "$Width: 5em;",
    description: "ignore variable",
  }, {
    code: "$map: (width: 100px);",
    description: "ignore map",
  }, {
    code: "$map: (Width: 100px);",
    description: "ignore map",
  }, {
    code: "a { font: (italic bold 10px/8px) }",
    description: "list",
  }, {
    code: "&-sidebar { border: 1px solid; }",
    description: "referencing parent selectors",
  }, {
    code: "a { font: { size: 30em; } }",
    description: "nested properties",
  }, {
    code: "p.#{$name} { #{$attr}-color: blue; }",
    description: "ignore interpolation",
  }, {
    code: "p.#{$name} { #{$Attr}-color: blue; }",
    description: "ignore interpolation",
  }, {
    code: "p.#{$name} { #{$attr}-Color: blue; }",
    description: "ignore interpolation",
  }, {
    code: "#context a%extreme { color: red; }",
    description: "extend only selectors",
  }, {
    code: ".parent { @at-root { .child1 { display: block; } } }",
    description: "as-root",
  }, {
    code: "@mixin large-text { font-size: 20px; }",
    description: "inside mixin",
  }, {
    code: "p { @if 1 + 1 == 2 { border: 1px solid;  } }",
    description: "inside custom at-rule",
  } ],

  reject: [ {
    code: "&-sidebar { Border: 1px solid; }",
    description: "referencing parent selectors",
    message: messages.expected("Border", "border"),
    line: 1,
    column: 13,
  }, {
    code: "a { Font: (italic bold 10px/8px) }",
    message: messages.expected("Font", "font"),
    line: 1,
    column: 5,
  }, {
    code: "a { font: { Size: 30em; } }",
    description: "nested properties",
    message: messages.expected("Size", "size"),
    line: 1,
    column: 13,
  }, {
    code: "#context a%extreme { Color: red; }",
    description: "extend only selectors",
    message: messages.expected("Color", "color"),
    line: 1,
    column: 22,
  }, {
    code: ".parent { @at-root { .child1 { Display: block; } } }",
    description: "as-root",
    message: messages.expected("Display", "display"),
    line: 1,
    column: 32,
  }, {
    code: "@mixin large-text { Font-size: 20px; }",
    description: "inside mixin",
    message: messages.expected("Font-size", "font-size"),
    line: 1,
    column: 21,
  }, {
    code: "p { @if 1 + 1 == 2 { Border: 1px solid;  } }",
    description: "inside custom at-rule",
    message: messages.expected("Border", "border"),
    line: 1,
    column: 22,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["lower"],

  accept: [ {
    code: "@variable: 10px",
  }, {
    code: "@Variable: 10px",
  }, {
    code: "@VARIABLE: 10px",
  }, {
    code: "a { color: @light-blue; }",
  }, {
    code: "a { .bordered; }",
    description: "ignore mixin",
  }, {
    code: "a { .Bordered; }",
    description: "ignore mixin",
  }, {
    code: "a { .Bordered(5px); }",
    description: "ignore mixin",
  }, {
    code: ".mixin(@color: black) { color: @color; }",
    description: "inside mixin",
  }, {
    code: ".@{my-selector} { font-weight: bold; }",
    description: "with selector interpolation",
  }, {
    code: ".widget { @{property}: #0ee; }",
    description: "ignore property interpolation",
  }, {
    code: ".widget { @{Property}: #0ee; }",
    description: "ignore property interpolation",
  }, {
    code: "a { box-shadow+: inset 0 0 10px #555; }",
    description: "mergeable property",
  }, {
    code: "a { box-shadow+_: inset 0 0 10px #555; }",
    description: "mergeable property with space",
  }, {
    code: ".bucket { tr & { color: blue; } }",
    description: "nested selector",
  } ],

  reject: [ {
    code: "a { Color: @light-blue; }",
    message: messages.expected("Color", "color"),
    line: 1,
    column: 5,
  }, {
    code: ".@{my-selector} { Font-weight: bold; }",
    description: "selector interpolation",
    message: messages.expected("Font-weight", "font-weight"),
    line: 1,
    column: 19,
  }, {
    code: ".mixin(@color: black) { Color: @color; }",
    description: "inside mixin",
    message: messages.expected("Color", "color"),
    line: 1,
    column: 25,
  }, {
    code: "a { Box-shadow+: inset 0 0 10px #555; }",
    description: "mergeable property",
    message: messages.expected("Box-shadow+", "box-shadow+"),
    line: 1,
    column: 5,
  }, {
    code: "a { Transform+_: scale(2); }",
    description: "mergeable property with space",
    message: messages.expected("Transform+_", "transform+_"),
    line: 1,
    column: 5,
  }, {
    code: "@media screen { @media (min-width: 768px) { Color: red; }}",
    description: "nested directives",
    message: messages.expected("Color", "color"),
    line: 1,
    column: 45,
  }, {
    code: ".bucket { tr & { Color: blue; } }",
    description: "nested selector",
    message: messages.expected("Color", "color"),
    line: 1,
    column: 18,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["upper"],

  accept: [ {
    code: "a { }",
  }, {
    code: "a { DISPLAY: block; }",
  }, {
    code: "a { BORDER-RADIUS: 8px; }",
  }, {
    code: "a:hover { DISPLAY: block; }",
  }, {
    code: "a:focus { DISPLAY: block; }",
  }, {
    code: "a:other { DISPLAY: block; }",
  }, {
    code: "a::before { DISPLAY: block; }",
  }, {
    code: "a::other { DISPLAY: block; }",
  }, {
    code: ":root { --custom-property-set: {} }",
  }, {
    code: ":root { --custom-property-name: red; }",
  }, {
    code: ":root { --custom-PropertyName: red; }",
  }, {
    code: "a { -WEBKIT-ANIMATION-DURATION: 3s; }",
  }, {
    code: "@media screen and (orientation: landscape) { WIDTH: 500px; }",
  }, {
    code: "a { PROPERTY: value; }",
    description: "non-standard property",
  } ],

  reject: [ {
    code: "a { Display: block; }",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 5,
  }, {
    code: "a { DisplaY: block; }",
    message: messages.expected("DisplaY", "DISPLAY"),
    line: 1,
    column: 5,
  }, {
    code: "a { display: block; }",
    message: messages.expected("display", "DISPLAY"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-Radius: block; }",
    message: messages.expected("border-Radius", "BORDER-RADIUS"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-RADIUS: block; }",
    message: messages.expected("border-RADIUS", "BORDER-RADIUS"),
    line: 1,
    column: 5,
  }, {
    code: "a { BORDER-radius: block; }",
    message: messages.expected("BORDER-radius", "BORDER-RADIUS"),
    line: 1,
    column: 5,
  }, {
    code: "a { border-radius: block; }",
    message: messages.expected("border-radius", "BORDER-RADIUS"),
    line: 1,
    column: 5,
  }, {
    code: "a { -WEBKIT-animation-duration: 3s; }",
    message: messages.expected("-WEBKIT-animation-duration", "-WEBKIT-ANIMATION-DURATION"),
    line: 1,
    column: 5,
  }, {
    code: "a { -webkit-Animation-duration: 3s; }",
    message: messages.expected("-webkit-Animation-duration", "-WEBKIT-ANIMATION-DURATION"),
    line: 1,
    column: 5,
  }, {
    code: "a:hover { Display: block; }",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 11,
  }, {
    code: "a:focus { Display: block; }",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 11,
  }, {
    code: "a:other { Display: block; }",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 11,
  }, {
    code: "a::before { Display: block; }",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 13,
  }, {
    code: "a::other { Display: block; }",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 12,
  }, {
    code: "@media screen and (orientation: landscape) { Width: 500px; }",
    message: messages.expected("Width", "WIDTH"),
    line: 1,
    column: 46,
  }, {
    code: "a { Property: value; }",
    description: "non-standard property",
    message: messages.expected("Property", "PROPERTY"),
    line: 1,
    column: 5,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: ["upper"],

  accept: [ {
    code: "$width: 5em;",
    description: "ignore variable",
  }, {
    code: "$Width: 5em;",
    description: "ignore variable",
  }, {
    code: "$map: (width: 100px);",
    description: "ignore map",
  }, {
    code: "$map: (Width: 100px);",
    description: "ignore map",
  }, {
    code: "a { FONT: (italic bold 10px/8px) }",
    description: "list",
  }, {
    code: "&-sidebar { BORDER: 1px solid; }",
    description: "referencing parent selectors",
  }, {
    code: "a { font: { SIZE: 30em; } }",
    description: "nested properties",
  }, {
    code: "p.#{$name} { #{$attr}-color: blue; }",
    description: "ignore interpolation",
  }, {
    code: "p.#{$name} { #{$Attr}-color: blue; }",
    description: "ignore interpolation",
  }, {
    code: "p.#{$name} { #{$attr}-Color: blue; }",
    description: "ignore interpolation",
  }, {
    code: "#context a%extreme { COLOR: red; }",
    description: "extend only selectors",
  }, {
    code: ".parent { @at-root { .child1 { DISPLAY: block; } } }",
    description: "as-root",
  }, {
    code: "@mixin large-text { FONT-SIZE: 20px; }",
    description: "inside mixin",
  }, {
    code: "p { @if 1 + 1 == 2 { BORDER: 1px solid;  } }",
    description: "inside custom at-rule",
  } ],

  reject: [ {
    code: "&-sidebar { Border: 1px solid; }",
    description: "referencing parent selectors",
    message: messages.expected("Border", "BORDER"),
    line: 1,
    column: 13,
  }, {
    code: "a { Font: (italic bold 10px/8px) }",
    message: messages.expected("Font", "FONT"),
    line: 1,
    column: 5,
  }, {
    code: "a { font: { Size: 30em; } }",
    description: "nested properties",
    message: messages.expected("Size", "SIZE"),
    line: 1,
    column: 13,
  }, {
    code: "#context a%extreme { Color: red; }",
    description: "extend only selectors",
    message: messages.expected("Color", "COLOR"),
    line: 1,
    column: 22,
  }, {
    code: ".parent { @at-root { .child1 { Display: block; } } }",
    description: "as-root",
    message: messages.expected("Display", "DISPLAY"),
    line: 1,
    column: 32,
  }, {
    code: "@mixin large-text { Font-size: 20px; }",
    description: "inside mixin",
    message: messages.expected("Font-size", "FONT-SIZE"),
    line: 1,
    column: 21,
  }, {
    code: "p { @if 1 + 1 == 2 { Border: 1px solid;  } }",
    description: "inside custom at-rule",
    message: messages.expected("Border", "BORDER"),
    line: 1,
    column: 22,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["upper"],

  accept: [ {
    code: "@variable: 10px",
  }, {
    code: "@Variable: 10px",
  }, {
    code: "@VARIABLE: 10px",
  }, {
    code: "a { COLOR: @light-blue; }",
  }, {
    code: "a { .bordered; }",
    description: "ignore mixin",
  }, {
    code: "a { .Bordered; }",
    description: "ignore mixin",
  }, {
    code: "a { .Bordered(5px); }",
    description: "ignore mixin",
  }, {
    code: ".mixin(@color: black) { COLOR: @color; }",
    description: "inside mixin",
  }, {
    code: ".@{my-selector} { FONT-WEIGHT: bold; }",
    description: "with selector interpolation",
  }, {
    code: ".widget { @{property}: #0ee; }",
    description: "ignore property interpolation",
  }, {
    code: ".widget { @{Property}: #0ee; }",
    description: "ignore property interpolation",
  }, {
    code: "a { BOX_SHADOW+: inset 0 0 10px #555; }",
    description: "mergeable property",
  }, {
    code: "a { BOX-SHADOW+_: inset 0 0 10px #555; }",
    description: "mergeable property with space",
  }, {
    code: ".bucket { tr & { COLOR: blue; } }",
    description: "nested selector",
  } ],

  reject: [ {
    code: "a { Color: @light-blue; }",
    message: messages.expected("Color", "COLOR"),
    line: 1,
    column: 5,
  }, {
    code: ".@{my-selector} { Font-weight: bold; }",
    description: "selector interpolation",
    message: messages.expected("Font-weight", "FONT-WEIGHT"),
    line: 1,
    column: 19,
  }, {
    code: ".mixin(@color: black) { Color: @color; }",
    description: "inside mixin",
    message: messages.expected("Color", "COLOR"),
    line: 1,
    column: 25,
  }, {
    code: "a { Box-shadow+: inset 0 0 10px #555; }",
    description: "mergeable property",
    message: messages.expected("Box-shadow+", "BOX-SHADOW+"),
    line: 1,
    column: 5,
  }, {
    code: "a { Transform+_: scale(2); }",
    description: "mergeable property with space",
    message: messages.expected("Transform+_", "TRANSFORM+_"),
    line: 1,
    column: 5,
  }, {
    code: "@media screen { @media (min-width: 768px) { Color: red; }}",
    description: "nested directives",
    message: messages.expected("Color", "COLOR"),
    line: 1,
    column: 45,
  }, {
    code: ".bucket { tr & { Color: blue; } }",
    description: "nested selector",
    message: messages.expected("Color", "COLOR"),
    line: 1,
    column: 18,
  } ],
})
