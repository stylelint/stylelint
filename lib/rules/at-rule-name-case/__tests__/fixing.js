"use strict"

const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["lower"],
  skipBasicChecks: true,

  fixingCases: [ {
    code: "@charset 'UTF-8';",
    same: true,
  }, {
    code: "@import 'test.css'",
    same: true,
  }, {
    code: "@namespace url(XML-namespace-URL);",
    same: true,
  }, {
    code: "@media screen {}",
    same: true,
  }, {
    code: "@media (min-width: 50em) {}",
    same: true,
  }, {
    code: "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
    same: true,
  }, {
    code: "@supports (animation-name: test) {}",
    same: true,
  }, {
    code: "@document url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')",
    same: true,
  }, {
    code: "@page :first { margin: 1cm; }",
    same: true,
  }, {
    code: "@keyframes { 0% { top: 0; } }",
    same: true,
  }, {
    code: "@-webkit-keyframes { 0% { top: 0; } }",
    same: true,
  }, {
    code: "@viewport { orientation: landscape; }",
    same: true,
  }, {
    code: "@counter-style win-list { system: fixed; symbols: url(gold-medal.svg) url(silver-medal.svg) ; suffix: ' ';}",
    same: true,
  }, {
    code: "@font-feature-values Font One { @styleset { nice-style: 12; } }",
    same: true,
  }, {
    code: "@Charset 'UTF-8';",
    expected: "@charset 'UTF-8';",
  }, {
    code: "@cHaRsEt 'UTF-8';",
    expected: "@charset 'UTF-8';",
  }, {
    code: "@CHARSET 'UTF-8';",
    expected: "@charset 'UTF-8';",
  }, {
    code: "@Media screen {}",
    expected: "@media screen {}",
  }, {
    code: "@mEdIa screen {}",
    expected: "@media screen {}",
  }, {
    code: "@MEDIA screen {}",
    expected: "@media screen {}",
  }, {
    code: "@media only screen and (min-width: 415px) { @Keyframes pace-anim { 100% { opacity: 0; } } }",
    expected: "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
  }, {
    code: "@media only screen and (min-width: 415px) { @kEyFrAmEs pace-anim { 100% { opacity: 0; } } }",
    expected: "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
  }, {
    code: "@media only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
    expected: "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
  }, {
    code: "@-WEBKIT-keyframes { 0% { top: 0; } }",
    expected: "@-webkit-keyframes { 0% { top: 0; } }",
  }, {
    code: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
    expected: "@-webkit-keyframes { 0% { top: 0; } }",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["upper"],
  skipBasicChecks: true,

  fixingCases: [ {
    code: "@CHARSET 'UTF-8';",
    same: true,
  }, {
    code: "@IMPORT 'test.css'",
    same: true,
  }, {
    code: "@NAMESPACE url(XML-namespace-URL);",
    same: true,
  }, {
    code: "@MEDIA screen {}",
    same: true,
  }, {
    code: "@MEDIA (min-width: 50em) {}",
    same: true,
  }, {
    code: "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
    same: true,
  }, {
    code: "@SUPPORTS (animation-name: test) {}",
    same: true,
  }, {
    code: "@DOCUMENT url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')",
    same: true,
  }, {
    code: "@PAGE :first { margin: 1cm; }",
    same: true,
  }, {
    code: "@KEYFRAMES { 0% { top: 0; } }",
    same: true,
  }, {
    code: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
    same: true,
  }, {
    code: "@VIEWPORT { orientation: landscape; }",
    same: true,
  }, {
    code: "@COUNTER-STYLE win-list { system: fixed; symbols: url(gold-medal.svg) url(silver-medal.svg) ; suffix: ' ';}",
    same: true,
  }, {
    code: "@FONT-FEATURE-VALUES Font One { @STYLESET { nice-style: 12; } }",
    same: true,
  }, {
    code: "@Charset 'UTF-8';",
    expected: "@CHARSET 'UTF-8';",
  }, {
    code: "@cHaRsEt 'UTF-8';",
    expected: "@CHARSET 'UTF-8';",
  }, {
    code: "@charset 'UTF-8';",
    expected: "@CHARSET 'UTF-8';",
  }, {
    code: "@Media screen {}",
    expected: "@MEDIA screen {}",
  }, {
    code: "@mEdIa screen {}",
    expected: "@MEDIA screen {}",
  }, {
    code: "@media screen {}",
    expected: "@MEDIA screen {}",
  }, {
    code: "@MEDIA only screen and (min-width: 415px) { @Keyframes pace-anim { 100% { opacity: 0; } } }",
    expected: "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
  }, {
    code: "@MEDIA only screen and (min-width: 415px) { @kEyFrAmEs pace-anim { 100% { opacity: 0; } } }",
    expected: "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
  }, {
    code: "@MEDIA only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
    expected: "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
  }, {
    code: "@-webkit-KEYFRAMES { 0% { top: 0; } }",
    expected: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
  }, {
    code: "@-webkit-keyframes { 0% { top: 0; } }",
    expected: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
  } ],
})
