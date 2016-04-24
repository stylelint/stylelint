import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["lower"],

  accept: [ {
    code: "a { margin: calc(5% - 10em); }",
  }, {
    code: "a { background-image: linear-gradient(to right, white calc(100% - 50em), silver); }",
  }, {
    code: "$map: (key: value,key2: value2)",
    description: "Sass map ignored",
  }, {
    code: "$map: (Key: Value, Key2: Value2)",
    description: "Sass map ignored",
  }, {
    code: "$list: (value, value2)",
    description: "Sass list ignored",
  }, {
    code: "$list: (Value, Value2)",
    description: "Sass list ignored",
  }, {
    code: "a::before { content: attr(data-foo\n); }",
  }, {
    code: "a { padding: calc(1px * 2) calc(1px * 2); }",
  }, {
    code: "a { padding: some-function(5px); }",
  }, {
    code: "a { background: -webkit-radial-gradient(red, green, blue); }",
  }, {
    code: "@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) lightness(50%)); } }",
  }, {
    code: "a { transform: translateX(0); }",
  }, {
    code: "a { transform: scaleX(0); }",
  }, {
    code: "a { transform: rotateX(0); }",
  }, {
    code: "a { transform: skewX(0); }",
  } ],

  reject: [ {
    code: "a { margin: Calc(5% - 10em); }",
    message: messages.expected("Calc", "calc"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: cAlC(5% - 10em); }",
    message: messages.expected("cAlC", "calc"),
    line: 1,
    column: 13,
  }, {
    code: "a { Margin: CALC(5% - 10em); }",
    message: messages.expected("CALC", "calc"),
    line: 1,
    column: 13,
  }, {
    code: "a { background-image: linear-gradient(to right, white Calc(100% - 50em), silver); }",
    message: messages.expected("Calc", "calc"),
    line: 1,
    column: 55,
  }, {
    code: "a { background-image: linear-gradient(to right, white cAlC(100% - 50em), silver); }",
    message: messages.expected("cAlC", "calc"),
    line: 1,
    column: 55,
  }, {
    code: "a { background-image: linear-gradient(to right, white CALC(100% - 50em), silver); }",
    message: messages.expected("CALC", "calc"),
    line: 1,
    column: 55,
  }, {
    code: "a::before { content: Attr(data-foo\n); }",
    message: messages.expected("Attr", "attr"),
    line: 1,
    column: 22,
  }, {
    code: "a::before { content: aTtR(data-foo\n); }",
    message: messages.expected("aTtR", "attr"),
    line: 1,
    column: 22,
  }, {
    code: "a::before { content: ATTR(data-foo\n); }",
    message: messages.expected("ATTR", "attr"),
    line: 1,
    column: 22,
  }, {
    code: "a { padding: Calc(1px * 2) calc(1px * 2); }",
    message: messages.expected("Calc", "calc"),
    line: 1,
    column: 14,
  }, {
    code: "a { padding: calc(1px * 2) Calc(1px * 2); }",
    message: messages.expected("Calc", "calc"),
    line: 1,
    column: 28,
  }, {
    code: "a { padding: Some-function(5px); }",
    message: messages.expected("Some-function", "some-function"),
    line: 1,
    column: 14,
  }, {
    code: "a { padding: some-Function(5px); }",
    message: messages.expected("some-Function", "some-function"),
    line: 1,
    column: 14,
  }, {
    code: "a { padding: SOME-FUNCTION(5px); }",
    message: messages.expected("SOME-FUNCTION", "some-function"),
    line: 1,
    column: 14,
  }, {
    code: "a { background: -WEBKIT-radial-gradient(red, green, blue); }",
    message: messages.expected("-WEBKIT-radial-gradient", "-webkit-radial-gradient"),
    line: 1,
    column: 17,
  }, {
    code: "@media (max-width: 10px) { a { color: Color(rgb(0, 0, 0) lightness(50%)); } }",
    message: messages.expected("Color", "color"),
    line: 1,
    column: 39,
  }, {
    code: "@media (max-width: 10px) { a { color: color(Rgb(0, 0, 0) lightness(50%)); } }",
    message: messages.expected("Rgb", "rgb"),
    line: 1,
    column: 45,
  }, {
    code: "@media (max-width: 10px) { a { color: color(rgb(0, 0, 0) Lightness(50%)); } }",
    message: messages.expected("Lightness", "lightness"),
    line: 1,
    column: 58,
  }, {
    code: "a { transform: TranslateX(0); }",
    message: messages.expected("TranslateX", "translateX"),
    line: 1,
    column: 16,
  }, {
    code: "a { transform: tRaNsLaTeX(0); }",
    message: messages.expected("tRaNsLaTeX", "translateX"),
    line: 1,
    column: 16,
  }, {
    code: "a { transform: TRANSLATEX(0); }",
    message: messages.expected("TRANSLATEX", "translateX"),
    line: 1,
    column: 16,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["upper"],

  accept: [ {
    code: "a { margin: CALC(5% - 10em); }",
  }, {
    code: "a { background-image: LINEAR-GRADIENT(to right, white CALC(100% - 50em), silver); }",
  }, {
    code: "$map: (key: value,key2: value2)",
    description: "Sass map ignored",
  }, {
    code: "$map: (Key: Value, Key2: Value2)",
    description: "Sass map ignored",
  }, {
    code: "$list: (value, value2)",
    description: "Sass list ignored",
  }, {
    code: "$list: (Value, Value2)",
    description: "Sass list ignored",
  }, {
    code: "a::before { content: ATTR(data-foo\n); }",
  }, {
    code: "a { padding: CALC(1px * 2) CALC(1px * 2); }",
  }, {
    code: "a { padding: SOME-FUNCTION(5px); }",
  }, {
    code: "a { background: -WEBKIT-RADIAL-GRADIENT(red, green, blue); }",
  }, {
    code: "@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) LIGHTNESS(50%)); } }",
  }, {
    code: "a { transform: TRANSLATEX(0); }",
  } ],

  reject: [ {
    code: "a { margin: Calc(5% - 10em); }",
    message: messages.expected("Calc", "CALC"),
    line: 1,
    column: 13,
  }, {
    code: "a { margin: cAlC(5% - 10em); }",
    message: messages.expected("cAlC", "CALC"),
    line: 1,
    column: 13,
  }, {
    code: "a { Margin: calc(5% - 10em); }",
    message: messages.expected("calc", "CALC"),
    line: 1,
    column: 13,
  }, {
    code: "a { background-image: LINEAR-GRADIENT(to right, white Calc(100% - 50em), silver); }",
    message: messages.expected("Calc", "CALC"),
    line: 1,
    column: 55,
  }, {
    code: "a { background-image: LINEAR-GRADIENT(to right, white cAlC(100% - 50em), silver); }",
    message: messages.expected("cAlC", "CALC"),
    line: 1,
    column: 55,
  }, {
    code: "a { background-image: LINEAR-GRADIENT(to right, white calc(100% - 50em), silver); }",
    message: messages.expected("calc", "CALC"),
    line: 1,
    column: 55,
  }, {
    code: "a::before { content: Attr(data-foo\n); }",
    message: messages.expected("Attr", "ATTR"),
    line: 1,
    column: 22,
  }, {
    code: "a::before { content: aTtR(data-foo\n); }",
    message: messages.expected("aTtR", "ATTR"),
    line: 1,
    column: 22,
  }, {
    code: "a::before { content: attr(data-foo\n); }",
    message: messages.expected("attr", "ATTR"),
    line: 1,
    column: 22,
  }, {
    code: "a { padding: Calc(1px * 2) CALC(1px * 2); }",
    message: messages.expected("Calc", "CALC"),
    line: 1,
    column: 14,
  }, {
    code: "a { padding: CALC(1px * 2) Calc(1px * 2); }",
    message: messages.expected("Calc", "CALC"),
    line: 1,
    column: 28,
  }, {
    code: "a { padding: Some-function(5px); }",
    message: messages.expected("Some-function", "SOME-FUNCTION"),
    line: 1,
    column: 14,
  }, {
    code: "a { padding: some-Function(5px); }",
    message: messages.expected("some-Function", "SOME-FUNCTION"),
    line: 1,
    column: 14,
  }, {
    code: "a { padding: some-function(5px); }",
    message: messages.expected("some-function", "SOME-FUNCTION"),
    line: 1,
    column: 14,
  }, {
    code: "a { background: -WEBKIT-radial-gradient(red, green, blue); }",
    message: messages.expected("-WEBKIT-radial-gradient", "-WEBKIT-RADIAL-GRADIENT"),
    line: 1,
    column: 17,
  }, {
    code: "@media (max-width: 10px) { a { color: Color(RGB(0, 0, 0) LIGHTNESS(50%)); } }",
    message: messages.expected("Color", "COLOR"),
    line: 1,
    column: 39,
  }, {
    code: "@media (max-width: 10px) { a { color: COLOR(Rgb(0, 0, 0) LIGHTNESS(50%)); } }",
    message: messages.expected("Rgb", "RGB"),
    line: 1,
    column: 45,
  }, {
    code: "@media (max-width: 10px) { a { color: COLOR(RGB(0, 0, 0) Lightness(50%)); } }",
    message: messages.expected("Lightness", "LIGHTNESS"),
    line: 1,
    column: 58,
  }, {
    code: "a { transform: TranslateX(0); }",
    message: messages.expected("TranslateX", "TRANSLATEX"),
    line: 1,
    column: 16,
  }, {
    code: "a { transform: tRaNsLaTeX(0); }",
    message: messages.expected("tRaNsLaTeX", "TRANSLATEX"),
    line: 1,
    column: 16,
  }, {
    code: "a { transform: translateX(0); }",
    message: messages.expected("translateX", "TRANSLATEX"),
    line: 1,
    column: 16,
  } ],
})
