import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["lower"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a:before { color: pink; }",
  }, {
    code: "a:after { color: pink; }",
  }, {
    code: "a:first-letter { color: pink; }",
  }, {
    code: "a:first-line { color: pink; }",
  }, {
    code: "a:before, a[data-before='BEFORE'] { color: pink; }",
  }, {
    code: "a::before { color: pink; }",
  }, {
    code: "a::after { color: pink; }",
  }, {
    code: "a::first-letter { color: pink; }",
  }, {
    code: "a::first-line { color: pink; }",
  }, {
    code: "::selection { }",
  }, {
    code: "a::spelling-error { color: pink; }",
  }, {
    code: "a::grammar-error { color: pink; }",
  }, {
    code: "li::marker { font-variant-numeric: tabular-nums; }",
  }, {
    code: "a::some-pseudo-element { }",
  }, {
    code: "p:first-child:before { }",
  }, {
    code: "h1:not(h2, h3) { }",
  }, {
    code: "h1:NOT(h2, h3) { }",
  }, {
    code: "a:focus { }",
  }, {
    code: "a:FOCUS { }",
  }, {
    code: "input::-moz-placeholder { color: pink; }",
  } ],

  reject: [ {
    code: "a:Before { color: pink; }",
    message: messages.expected(":Before", ":before"),
    line: 1,
    column: 2,
  }, {
    code: "a:bEfOrE { color: pink; }",
    message: messages.expected(":bEfOrE", ":before"),
    line: 1,
    column: 2,
  }, {
    code: "a:BEFORE { color: pink; }",
    message: messages.expected(":BEFORE", ":before"),
    line: 1,
    column: 2,
  }, {
    code: "a:After { color: pink; }",
    message: messages.expected(":After", ":after"),
    line: 1,
    column: 2,
  }, {
    code: "a:First-letter { color: pink; }",
    message: messages.expected(":First-letter", ":first-letter"),
    line: 1,
    column: 2,
  }, {
    code: "a:First-line { color: pink; }",
    message: messages.expected(":First-line", ":first-line"),
    line: 1,
    column: 2,
  }, {
    code: "a::Before { color: pink; }",
    message: messages.expected("::Before", "::before"),
    line: 1,
    column: 2,
  }, {
    code: "a::bEfOrE { color: pink; }",
    message: messages.expected("::bEfOrE", "::before"),
    line: 1,
    column: 2,
  }, {
    code: "a::BEFORE { color: pink; }",
    message: messages.expected("::BEFORE", "::before"),
    line: 1,
    column: 2,
  }, {
    code: "a::After { color: pink; }",
    message: messages.expected("::After", "::after"),
    line: 1,
    column: 2,
  }, {
    code: "a::First-letter { color: pink; }",
    message: messages.expected("::First-letter", "::first-letter"),
    line: 1,
    column: 2,
  }, {
    code: "a::First-line { color: pink; }",
    message: messages.expected("::First-line", "::first-line"),
    line: 1,
    column: 2,
  }, {
    code: "::Selection { }",
    message: messages.expected("::Selection", "::selection"),
    line: 1,
    column: 1,
  }, {
    code: "::sElEcTiOn { }",
    message: messages.expected("::sElEcTiOn", "::selection"),
    line: 1,
    column: 1,
  }, {
    code: "::SELECTION { }",
    message: messages.expected("::SELECTION", "::selection"),
    line: 1,
    column: 1,
  }, {
    code: "a::Spelling-error { color: pink; }",
    message: messages.expected("::Spelling-error", "::spelling-error"),
    line: 1,
    column: 2,
  }, {
    code: "a::Grammar-error { color: pink; }",
    message: messages.expected("::Grammar-error", "::grammar-error"),
    line: 1,
    column: 2,
  }, {
    code: "li::Marker { font-variant-numeric: tabular-nums; }",
    message: messages.expected("::Marker", "::marker"),
    line: 1,
    column: 3,
  }, {
    code: "a::Some-pseudo-element { }",
    message: messages.expected("::Some-pseudo-element", "::some-pseudo-element"),
    line: 1,
    column: 2,
  }, {
    code: "a::sOmE-pSeUdO-eLeMenT { }",
    message: messages.expected("::sOmE-pSeUdO-eLeMenT", "::some-pseudo-element"),
    line: 1,
    column: 2,
  }, {
    code: "a::SOME-PSEUDO-ELEMENT { }",
    message: messages.expected("::SOME-PSEUDO-ELEMENT", "::some-pseudo-element"),
    line: 1,
    column: 2,
  }, {
    code: "p:first-child:Before { }",
    message: messages.expected(":Before", ":before"),
    line: 1,
    column: 14,
  }, {
    code: "p:First-child:Before { }",
    message: messages.expected(":Before", ":before"),
    line: 1,
    column: 14,
  }, {
    code: "p:first-child::Before { }",
    message: messages.expected("::Before", "::before"),
    line: 1,
    column: 14,
  }, {
    code: "p:First-child::Before { }",
    message: messages.expected("::Before", "::before"),
    line: 1,
    column: 14,
  }, {
    code: "input::-MOZ-PLACEHOLDER { color: pink; }",
    message: messages.expected("::-MOZ-PLACEHOLDER", "::-moz-placeholder"),
    line: 1,
    column: 6,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["upper"],

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a:BEFORE { color: pink; }",
  }, {
    code: "a:AFTER { color: pink; }",
  }, {
    code: "a:FIRST-LETTER { color: pink; }",
  }, {
    code: "a:FIRST-LINE { color: pink; }",
  }, {
    code: "a:BEFORE, a[data-before='before'] { color: pink; }",
  }, {
    code: "a::BEFORE { color: pink; }",
  }, {
    code: "a::AFTER { color: pink; }",
  }, {
    code: "a::FIRST-LETTER { color: pink; }",
  }, {
    code: "a::FIRST-LINE { color: pink; }",
  }, {
    code: "::SELECTION { }",
  }, {
    code: "a::SPELLING-ERROR { color: pink; }",
  }, {
    code: "a::GRAMMAR-ERROR { color: pink; }",
  }, {
    code: "li::MARKER { font-variant-numeric: tabular-nums; }",
  }, {
    code: "a::SOME-PSEUDO-ELEMENT { }",
  }, {
    code: "p:first-child:BEFORE { }",
  }, {
    code: "h1:not(h2, h3) { }",
  }, {
    code: "h1:NOT(h2, h3) { }",
  }, {
    code: "a:focus { }",
  }, {
    code: "a:FOCUS { }",
  }, {
    code: "input::-MOZ-PLACEHOLDER { color: pink; }",
  } ],

  reject: [ {
    code: "a:Before { color: pink; }",
    message: messages.expected(":Before", ":BEFORE"),
    line: 1,
    column: 2,
  }, {
    code: "a:bEfOrE { color: pink; }",
    message: messages.expected(":bEfOrE", ":BEFORE"),
    line: 1,
    column: 2,
  }, {
    code: "a:before { color: pink; }",
    message: messages.expected(":before", ":BEFORE"),
    line: 1,
    column: 2,
  }, {
    code: "a:After { color: pink; }",
    message: messages.expected(":After", ":AFTER"),
    line: 1,
    column: 2,
  }, {
    code: "a:First-letter { color: pink; }",
    message: messages.expected(":First-letter", ":FIRST-LETTER"),
    line: 1,
    column: 2,
  }, {
    code: "a:First-line { color: pink; }",
    message: messages.expected(":First-line", ":FIRST-LINE"),
    line: 1,
    column: 2,
  }, {
    code: "a::Before { color: pink; }",
    message: messages.expected("::Before", "::BEFORE"),
    line: 1,
    column: 2,
  }, {
    code: "a::bEfOrE { color: pink; }",
    message: messages.expected("::bEfOrE", "::BEFORE"),
    line: 1,
    column: 2,
  }, {
    code: "a::before { color: pink; }",
    message: messages.expected("::before", "::BEFORE"),
    line: 1,
    column: 2,
  }, {
    code: "a::After { color: pink; }",
    message: messages.expected("::After", "::AFTER"),
    line: 1,
    column: 2,
  }, {
    code: "a::First-letter { color: pink; }",
    message: messages.expected("::First-letter", "::FIRST-LETTER"),
    line: 1,
    column: 2,
  }, {
    code: "a::First-line { color: pink; }",
    message: messages.expected("::First-line", "::FIRST-LINE"),
    line: 1,
    column: 2,
  }, {
    code: "::Selection { }",
    message: messages.expected("::Selection", "::SELECTION"),
    line: 1,
    column: 1,
  }, {
    code: "::sElEcTiOn { }",
    message: messages.expected("::sElEcTiOn", "::SELECTION"),
    line: 1,
    column: 1,
  }, {
    code: "::selection { }",
    message: messages.expected("::selection", "::SELECTION"),
    line: 1,
    column: 1,
  }, {
    code: "a::Spelling-error { color: pink; }",
    message: messages.expected("::Spelling-error", "::SPELLING-ERROR"),
    line: 1,
    column: 2,
  }, {
    code: "a::Grammar-error { color: pink; }",
    message: messages.expected("::Grammar-error", "::GRAMMAR-ERROR"),
    line: 1,
    column: 2,
  }, {
    code: "li::Marker { font-variant-numeric: tabular-nums; }",
    message: messages.expected("::Marker", "::MARKER"),
    line: 1,
    column: 3,
  }, {
    code: "a::Some-pseudo-element { }",
    message: messages.expected("::Some-pseudo-element", "::SOME-PSEUDO-ELEMENT"),
    line: 1,
    column: 2,
  }, {
    code: "a::sOmE-pSeUdO-eLeMenT { }",
    message: messages.expected("::sOmE-pSeUdO-eLeMenT", "::SOME-PSEUDO-ELEMENT"),
    line: 1,
    column: 2,
  }, {
    code: "a::some-pseudo-element { }",
    message: messages.expected("::some-pseudo-element", "::SOME-PSEUDO-ELEMENT"),
    line: 1,
    column: 2,
  }, {
    code: "p:first-child:Before { }",
    message: messages.expected(":Before", ":BEFORE"),
    line: 1,
    column: 14,
  }, {
    code: "p:First-child:Before { }",
    message: messages.expected(":Before", ":BEFORE"),
    line: 1,
    column: 14,
  }, {
    code: "p:first-child::Before { }",
    message: messages.expected("::Before", "::BEFORE"),
    line: 1,
    column: 14,
  }, {
    code: "p:First-child::Before { }",
    message: messages.expected("::Before", "::BEFORE"),
    line: 1,
    column: 14,
  }, {
    code: "input::-moz-placeholder { color: pink; }",
    message: messages.expected("::-moz-placeholder", "::-MOZ-PLACEHOLDER"),
    line: 1,
    column: 6,
  } ],
})

