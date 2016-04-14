import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["lower"],
  skipBasicChecks: true,

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a:hover { color: pink; }",
  }, {
    code: "a:focus { color: pink; }",
  }, {
    code: "a:before { color: pink; }",
  }, {
    code: "a:BEFORE { color: pink; }",
  }, {
    code: "a:after { color: pink; }",
  }, {
    code: "a:AFTER { color: pink; }",
  }, {
    code: "a:first-letter { color: pink; }",
  }, {
    code: "a:FIRST-LETTER { color: pink; }",
  }, {
    code: "a:first-line { color: pink; }",
  }, {
    code: "a:FIRST-LINE { color: pink; }",
  }, {
    code: "a::before { color: pink; }",
  }, {
    code: "a::BEFORE { color: pink; }",
  }, {
    code: "a::some-pseudo-element { }",
  }, {
    code: "a::SOME-PSEUDO-ELEMENT { }",
  }, {
    code: "p:first-child:before { }",
  }, {
    code: "p:first-child:BEFORE { }",
  }, {
    code: "h1:not(h2, h3) { }",
  }, {
    code: "p:nth-child(3n+0) { }",
  }, {
    code: "p:nth-child(odd) { }",
  }, {
    code: "input::-moz-placeholder { color: pink; }",
  }, {
    code: "input::-MOZ-PLACEHOLDER { color: pink; }",
  }, {
    code: ":root { background: #ff0000; }",
  }, {
    code: "a:some-pseudo-class { }",
  }, {
    code: ":some-pseudo-class { }",
  }, {
    code: "input[type=file]:active::-webkit-file-upload-button { }",
  }, {
    code: "input[type=file]:active::-WEBKIT-FILE-UPLOAD-BUTTON { }",
  }, {
    code: ":-ms-input-placeholder { }",
  } ],

  reject: [ {
    code: "a:Hover { color: pink; }",
    message: messages.expected(":Hover", ":hover"),
    line: 1,
    column: 2,
  }, {
    code: "a:hOvEr { color: pink; }",
    message: messages.expected(":hOvEr", ":hover"),
    line: 1,
    column: 2,
  }, {
    code: "a:HOVER { color: pink; }",
    message: messages.expected(":HOVER", ":hover"),
    line: 1,
    column: 2,
  }, {
    code: "p:First-child:before { }",
    message: messages.expected(":First-child", ":first-child"),
    line: 1,
    column: 2,
  }, {
    code: "p:First-child:BEFORE { }",
    message: messages.expected(":First-child", ":first-child"),
    line: 1,
    column: 2,
  }, {
    code: "h1:Not(h2, h3) { }",
    message: messages.expected(":Not", ":not"),
    line: 1,
    column: 3,
  }, {
    code: "h1:nOt(h2, h3) { }",
    message: messages.expected(":nOt", ":not"),
    line: 1,
    column: 3,
  }, {
    code: "h1:NOT(h2, h3) { }",
    message: messages.expected(":NOT", ":not"),
    line: 1,
    column: 3,
  }, {
    code: ":Root { background: #ff0000; }",
    message: messages.expected(":Root", ":root"),
    line: 1,
    column: 1,
  }, {
    code: ":rOoT { background: #ff0000; }",
    message: messages.expected(":rOoT", ":root"),
    line: 1,
    column: 1,
  }, {
    code: ":ROOT { background: #ff0000; }",
    message: messages.expected(":ROOT", ":root"),
    line: 1,
    column: 1,
  }, {
    code: "a:Some-pseudo-class { }",
    message: messages.expected(":Some-pseudo-class", ":some-pseudo-class"),
    line: 1,
    column: 2,
  }, {
    code: "a:sOmE-pSeUdO-cLaSs { }",
    message: messages.expected(":sOmE-pSeUdO-cLaSs", ":some-pseudo-class"),
    line: 1,
    column: 2,
  }, {
    code: "a:SOME-PSEUDO-CLASS { }",
    message: messages.expected(":SOME-PSEUDO-CLASS", ":some-pseudo-class"),
    line: 1,
    column: 2,
  }, {
    code: ":Some-pseudo-class { }",
    message: messages.expected(":Some-pseudo-class", ":some-pseudo-class"),
    line: 1,
    column: 1,
  }, {
    code: ":sOmE-pSeUdO-cLaSs { }",
    message: messages.expected(":sOmE-pSeUdO-cLaSs", ":some-pseudo-class"),
    line: 1,
    column: 1,
  }, {
    code: ":SOME-PSEUDO-CLASS { }",
    message: messages.expected(":SOME-PSEUDO-CLASS", ":some-pseudo-class"),
    line: 1,
    column: 1,
  }, {
    code: "input[type=file]:Active::-webkit-file-upload-button { }",
    message: messages.expected(":Active", ":active"),
    line: 1,
    column: 17,
  }, {
    code: "input[type=file]:Active::-WEBKIT-FILE-UPLOAD-BUTTON { }",
    message: messages.expected(":Active", ":active"),
    line: 1,
    column: 17,
  }, {
    code: ":-Ms-input-placeholder { }",
    message: messages.expected(":-Ms-input-placeholder", ":-ms-input-placeholder"),
    line: 1,
    column: 1,
  }, {
    code: ":-mS-iNpUt-PlAcEhOlDer { }",
    message: messages.expected(":-mS-iNpUt-PlAcEhOlDer", ":-ms-input-placeholder"),
    line: 1,
    column: 1,
  }, {
    code: ":-MS-INPUT-PLACEHOLDER { }",
    message: messages.expected(":-MS-INPUT-PLACEHOLDER", ":-ms-input-placeholder"),
    line: 1,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["upper"],
  skipBasicChecks: true,

  accept: [ {
    code: "a { color: pink; }",
  }, {
    code: "a:HOVER { color: pink; }",
  }, {
    code: "a:FOCUS { color: pink; }",
  }, {
    code: "a:before { color: pink; }",
  }, {
    code: "a:BEFORE { color: pink; }",
  }, {
    code: "a:after { color: pink; }",
  }, {
    code: "a:AFTER { color: pink; }",
  }, {
    code: "a:first-letter { color: pink; }",
  }, {
    code: "a:FIRST-LETTER { color: pink; }",
  }, {
    code: "a:first-line { color: pink; }",
  }, {
    code: "a:FIRST-LINE { color: pink; }",
  }, {
    code: "a::before { color: pink; }",
  }, {
    code: "a::BEFORE { color: pink; }",
  }, {
    code: "a::some-pseudo-element { }",
  }, {
    code: "a::SOME-PSEUDO-ELEMENT { }",
  }, {
    code: "p:FIRST-CHILD:before { }",
  }, {
    code: "p:FIRST-CHILD:BEFORE { }",
  }, {
    code: "h1:NOT(h2, h3) { }",
  }, {
    code: "p:NTH-CHILD(3n+0) { }",
  }, {
    code: "p:NTH-CHILD(odd) { }",
  }, {
    code: "input::-moz-placeholder { color: pink; }",
  }, {
    code: "input::-MOZ-PLACEHOLDER { color: pink; }",
  }, {
    code: ":ROOT { background: #ff0000; }",
  }, {
    code: "a:SOME-PSEUDO-CLASS { }",
  }, {
    code: ":SOME-PSEUDO-CLASS { }",
  }, {
    code: "input[type=file]:ACTIVE::-webkit-file-upload-button { }",
  }, {
    code: "input[type=file]:ACTIVE::-WEBKIT-FILE-UPLOAD-BUTTON { }",
  }, {
    code: ":-MS-INPUT-PLACEHOLDER { }",
  } ],

  reject: [ {
    code: "a:Hover { color: pink; }",
    message: messages.expected(":Hover", ":HOVER"),
    line: 1,
    column: 2,
  }, {
    code: "a:hOvEr { color: pink; }",
    message: messages.expected(":hOvEr", ":HOVER"),
    line: 1,
    column: 2,
  }, {
    code: "a:hover { color: pink; }",
    message: messages.expected(":hover", ":HOVER"),
    line: 1,
    column: 2,
  }, {
    code: "p:First-child:before { }",
    message: messages.expected(":First-child", ":FIRST-CHILD"),
    line: 1,
    column: 2,
  }, {
    code: "p:First-child:BEFORE { }",
    message: messages.expected(":First-child", ":FIRST-CHILD"),
    line: 1,
    column: 2,
  }, {
    code: "h1:Not(h2, h3) { }",
    message: messages.expected(":Not", ":NOT"),
    line: 1,
    column: 3,
  }, {
    code: "h1:nOt(h2, h3) { }",
    message: messages.expected(":nOt", ":NOT"),
    line: 1,
    column: 3,
  }, {
    code: "h1:not(h2, h3) { }",
    message: messages.expected(":not", ":NOT"),
    line: 1,
    column: 3,
  }, {
    code: ":Root { background: #ff0000; }",
    message: messages.expected(":Root", ":ROOT"),
    line: 1,
    column: 1,
  }, {
    code: ":rOoT { background: #ff0000; }",
    message: messages.expected(":rOoT", ":ROOT"),
    line: 1,
    column: 1,
  }, {
    code: ":root { background: #ff0000; }",
    message: messages.expected(":root", ":ROOT"),
    line: 1,
    column: 1,
  }, {
    code: "a:Some-pseudo-class { }",
    message: messages.expected(":Some-pseudo-class", ":SOME-PSEUDO-CLASS"),
    line: 1,
    column: 2,
  }, {
    code: "a:sOmE-pSeUdO-cLaSs { }",
    message: messages.expected(":sOmE-pSeUdO-cLaSs", ":SOME-PSEUDO-CLASS"),
    line: 1,
    column: 2,
  }, {
    code: "a:some-pseudo-class { }",
    message: messages.expected(":some-pseudo-class", ":SOME-PSEUDO-CLASS"),
    line: 1,
    column: 2,
  }, {
    code: ":Some-pseudo-class { }",
    message: messages.expected(":Some-pseudo-class", ":SOME-PSEUDO-CLASS"),
    line: 1,
    column: 1,
  }, {
    code: ":sOmE-pSeUdO-cLaSs { }",
    message: messages.expected(":sOmE-pSeUdO-cLaSs", ":SOME-PSEUDO-CLASS"),
    line: 1,
    column: 1,
  }, {
    code: ":some-pseudo-class { }",
    message: messages.expected(":some-pseudo-class", ":SOME-PSEUDO-CLASS"),
    line: 1,
    column: 1,
  }, {
    code: "input[type=file]:Active::-webkit-file-upload-button { }",
    message: messages.expected(":Active", ":ACTIVE"),
    line: 1,
    column: 17,
  }, {
    code: "input[type=file]:Active::-WEBKIT-FILE-UPLOAD-BUTTON { }",
    message: messages.expected(":Active", ":ACTIVE"),
    line: 1,
    column: 17,
  }, {
    code: ":-Ms-input-placeholder { }",
    message: messages.expected(":-Ms-input-placeholder", ":-MS-INPUT-PLACEHOLDER"),
    line: 1,
    column: 1,
  }, {
    code: ":-mS-iNpUt-PlAcEhOlDer { }",
    message: messages.expected(":-mS-iNpUt-PlAcEhOlDer", ":-MS-INPUT-PLACEHOLDER"),
    line: 1,
    column: 1,
  }, {
    code: ":-ms-input-placeholder { }",
    message: messages.expected(":-ms-input-placeholder", ":-MS-INPUT-PLACEHOLDER"),
    line: 1,
    column: 1,
  } ],
})

