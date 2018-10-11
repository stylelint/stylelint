"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["lower"],
  skipBasicChecks: true,
  fix: true,

  accept: [
    {
      code: "@charset 'UTF-8';"
    },
    {
      code: "@import 'test.css'"
    },
    {
      code: "@namespace url(XML-namespace-URL);"
    },
    {
      code: "@media screen {}"
    },
    {
      code: "@media (min-width: 50em) {}"
    },
    {
      code:
        "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }"
    },
    {
      code: "@supports (animation-name: test) {}"
    },
    {
      code:
        "@document url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')"
    },
    {
      code: "@page :first { margin: 1cm; }"
    },
    {
      code: "@keyframes { 0% { top: 0; } }"
    },
    {
      code: "@-webkit-keyframes { 0% { top: 0; } }"
    },
    {
      code: "@viewport { orientation: landscape; }"
    },
    {
      code:
        "@counter-style win-list { system: fixed; symbols: url(gold-medal.svg) url(silver-medal.svg) ; suffix: ' ';}"
    },
    {
      code: "@font-feature-values Font One { @styleset { nice-style: 12; } }"
    }
  ],

  reject: [
    {
      code: "@Charset 'UTF-8';",
      fixed: "@charset 'UTF-8';",
      message: messages.expected("Charset", "charset"),
      line: 1,
      column: 1
    },
    {
      code: "@cHaRsEt 'UTF-8';",
      fixed: "@charset 'UTF-8';",
      message: messages.expected("cHaRsEt", "charset"),
      line: 1,
      column: 1
    },
    {
      code: "@CHARSET 'UTF-8';",
      fixed: "@charset 'UTF-8';",
      message: messages.expected("CHARSET", "charset"),
      line: 1,
      column: 1
    },
    {
      code: "@Media screen {}",
      fixed: "@media screen {}",
      message: messages.expected("Media", "media"),
      line: 1,
      column: 1
    },
    {
      code: "@mEdIa screen {}",
      fixed: "@media screen {}",
      message: messages.expected("mEdIa", "media"),
      line: 1,
      column: 1
    },
    {
      code: "@MEDIA screen {}",
      fixed: "@media screen {}",
      message: messages.expected("MEDIA", "media"),
      line: 1,
      column: 1
    },
    {
      code:
        "@media only screen and (min-width: 415px) { @Keyframes pace-anim { 100% { opacity: 0; } } }",
      fixed:
        "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
      message: messages.expected("Keyframes", "keyframes"),
      line: 1,
      column: 45
    },
    {
      code:
        "@media only screen and (min-width: 415px) { @kEyFrAmEs pace-anim { 100% { opacity: 0; } } }",
      fixed:
        "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
      message: messages.expected("kEyFrAmEs", "keyframes"),
      line: 1,
      column: 45
    },
    {
      code:
        "@media only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
      fixed:
        "@media only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
      message: messages.expected("KEYFRAMES", "keyframes"),
      line: 1,
      column: 45
    },
    {
      code: "@-WEBKIT-keyframes { 0% { top: 0; } }",
      fixed: "@-webkit-keyframes { 0% { top: 0; } }",
      message: messages.expected("-WEBKIT-keyframes", "-webkit-keyframes"),
      line: 1,
      column: 1
    },
    {
      code: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
      fixed: "@-webkit-keyframes { 0% { top: 0; } }",
      message: messages.expected("-WEBKIT-KEYFRAMES", "-webkit-keyframes"),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["upper"],
  skipBasicChecks: true,
  fix: true,

  accept: [
    {
      code: "@CHARSET 'UTF-8';"
    },
    {
      code: "@IMPORT 'test.css'"
    },
    {
      code: "@NAMESPACE url(XML-namespace-URL);"
    },
    {
      code: "@MEDIA screen {}"
    },
    {
      code: "@MEDIA (min-width: 50em) {}"
    },
    {
      code:
        "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }"
    },
    {
      code: "@SUPPORTS (animation-name: test) {}"
    },
    {
      code:
        "@DOCUMENT url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')"
    },
    {
      code: "@PAGE :first { margin: 1cm; }"
    },
    {
      code: "@KEYFRAMES { 0% { top: 0; } }"
    },
    {
      code: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }"
    },
    {
      code: "@VIEWPORT { orientation: landscape; }"
    },
    {
      code:
        "@COUNTER-STYLE win-list { system: fixed; symbols: url(gold-medal.svg) url(silver-medal.svg) ; suffix: ' ';}"
    },
    {
      code: "@FONT-FEATURE-VALUES Font One { @STYLESET { nice-style: 12; } }"
    }
  ],

  reject: [
    {
      code: "@Charset 'UTF-8';",
      fixed: "@CHARSET 'UTF-8';",
      message: messages.expected("Charset", "CHARSET"),
      line: 1,
      column: 1
    },
    {
      code: "@cHaRsEt 'UTF-8';",
      fixed: "@CHARSET 'UTF-8';",
      message: messages.expected("cHaRsEt", "CHARSET"),
      line: 1,
      column: 1
    },
    {
      code: "@charset 'UTF-8';",
      fixed: "@CHARSET 'UTF-8';",
      message: messages.expected("charset", "CHARSET"),
      line: 1,
      column: 1
    },
    {
      code: "@Media screen {}",
      fixed: "@MEDIA screen {}",
      message: messages.expected("Media", "MEDIA"),
      line: 1,
      column: 1
    },
    {
      code: "@mEdIa screen {}",
      fixed: "@MEDIA screen {}",
      message: messages.expected("mEdIa", "MEDIA"),
      line: 1,
      column: 1
    },
    {
      code: "@media screen {}",
      fixed: "@MEDIA screen {}",
      message: messages.expected("media", "MEDIA"),
      line: 1,
      column: 1
    },
    {
      code:
        "@MEDIA only screen and (min-width: 415px) { @Keyframes pace-anim { 100% { opacity: 0; } } }",
      fixed:
        "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
      message: messages.expected("Keyframes", "KEYFRAMES"),
      line: 1,
      column: 45
    },
    {
      code:
        "@MEDIA only screen and (min-width: 415px) { @kEyFrAmEs pace-anim { 100% { opacity: 0; } } }",
      fixed:
        "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
      message: messages.expected("kEyFrAmEs", "KEYFRAMES"),
      line: 1,
      column: 45
    },
    {
      code:
        "@MEDIA only screen and (min-width: 415px) { @keyframes pace-anim { 100% { opacity: 0; } } }",
      fixed:
        "@MEDIA only screen and (min-width: 415px) { @KEYFRAMES pace-anim { 100% { opacity: 0; } } }",
      message: messages.expected("keyframes", "KEYFRAMES"),
      line: 1,
      column: 45
    },
    {
      code: "@-webkit-KEYFRAMES { 0% { top: 0; } }",
      fixed: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
      message: messages.expected("-webkit-KEYFRAMES", "-WEBKIT-KEYFRAMES"),
      line: 1,
      column: 1
    },
    {
      code: "@-webkit-keyframes { 0% { top: 0; } }",
      fixed: "@-WEBKIT-KEYFRAMES { 0% { top: 0; } }",
      message: messages.expected("-webkit-keyframes", "-WEBKIT-KEYFRAMES"),
      line: 1,
      column: 1
    }
  ]
});
