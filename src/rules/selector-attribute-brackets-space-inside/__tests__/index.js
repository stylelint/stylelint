import { testRule } from "../../../testUtils"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: ".foo { }",
  }, {
    code: "[ target ] { }",
  }, {
    code: "[  target  ] { }",
  }, {
    code: "[ target=_blank ] { }",
  }, {
    code: "[  target=_blank  ] { }",
  }, {
    code: "[ target='_blank' ] { }",
  }, {
    code: "[ target=\"_blank\" ] { }",
  }, {
    code: "[ title~=flower ] { }",
  }, {
    code: "[ title|=flower ] { }",
  }, {
    code: "[ title^=flower ] { }",
  }, {
    code: "[ title$=flower ] { }",
  }, {
    code: "a[ href*=w3schools ] { }",
  }, {
    code: "img[ alt~=person ][ src*=lorem ] { }",
  }, {
    code: "[ target=_blank ]:hover { }",
  }, {
    code: "[ target=_blank ]::before { }",
  }, {
    code: "option[ data-hidden=true ] { }",
  }, {
    code: "option[ dataHidden ] { }",
  }, {
    code: "@media screen and (max-width: 480px) { img[ align=right ] { } }",
  }, {
    code: "[ target=_blank ] .foo { }",
  }, {
    code: "li[ aria-hidden=false ]:nth-child(1) { }",
  }, {
    code: "li[ aria-hidden=false ]:nth-child( 1) { }",
  }, {
    code: "li[ aria-hidden=false ]:nth-child(1 ) { }",
  }, {
    code: "li[ aria-hidden=false ]:nth-child( 1 ) { }",
  }, {
    code: "ul li[ aria-hidden=false ] + li[ aria-hidden=false ] a { }",
  }, {
    code: "[ target ] { content: \"[\" }",
  }, {
    code: "[ target ] { content: \"]\" }",
  } ],

  reject: [ {
    code: "[target ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 8,
  }, {
    code: "[target  ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[  target] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 9,
  }, {
    code: "[target=_blank ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target=_blank] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "[target=_blank  ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[  target=_blank] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 16,
  }, {
    code: "[target='_blank' ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target='_blank'] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 17,
  }, {
    code: "[target=\"_blank\" ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target=\"_blank\"] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 17,
  }, {
    code: "a[href*=w3schools ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 3,
  }, {
    code: "a[ href*=w3schools] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 18,
  }, {
    code: "img[alt~=person ][ src*=lorem ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 5,
  }, {
    code: "img[ alt~=person][ src*=lorem ] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 16,
  }, {
    code: "img[ alt~=person ][src*=lorem ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 20,
  }, {
    code: "img[ alt~=person ][ src*=lorem] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 30,
  }, {
    code: "[target=_blank ]:hover { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target=_blank]:hover { }",
    message: messages.expectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "[target=_blank ]::before { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target=_blank]::before { }",
    message: messages.expectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "option[data-hidden=true ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 8,
  }, {
    code: "option[ data-hidden=true] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 24,
  }, {
    code: "option[dataHidden ] { }",
    message: messages.expectedOpening,
    line: 1,
    column: 8,
  }, {
    code: "option[ dataHidden] { }",
    message: messages.expectedClosing,
    line: 1,
    column: 18,
  }, {
    code: "@media screen and (max-width: 480px) { img[align=right ] { } }",
    message: messages.expectedOpening,
    line: 1,
    column: 44,
  }, {
    code: "@media screen and (max-width: 480px) { img[ align=right] { } }",
    message: messages.expectedClosing,
    line: 1,
    column: 55,
  }, {
    code: "[target=_blank ] .foo { }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target=_blank] .foo { }",
    message: messages.expectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "li[aria-hidden=false ]:nth-child(1) { }",
    message: messages.expectedOpening,
    line: 1,
    column: 4,
  }, {
    code: "li[ aria-hidden=false]:nth-child(1) { }",
    message: messages.expectedClosing,
    line: 1,
    column: 21,
  }, {
    code: "li[aria-hidden=false ]:nth-child( 1 ) { }",
    message: messages.expectedOpening,
    line: 1,
    column: 4,
  }, {
    code: "li[ aria-hidden=false]:nth-child( 1 ) { }",
    message: messages.expectedClosing,
    line: 1,
    column: 21,
  }, {
    code: "ul li[aria-hidden=false ] + li[ aria-hidden=false ] a { }",
    message: messages.expectedOpening,
    line: 1,
    column: 7,
  }, {
    code: "ul li[ aria-hidden=false] + li[ aria-hidden=false ] a { }",
    message: messages.expectedClosing,
    line: 1,
    column: 24,
  }, {
    code: "ul li[ aria-hidden=false ] + li[aria-hidden=false ] a { }",
    message: messages.expectedOpening,
    line: 1,
    column: 33,
  }, {
    code: "ul li[ aria-hidden=false ] + li[ aria-hidden=false] a { }",
    message: messages.expectedClosing,
    line: 1,
    column: 50,
  }, {
    code: "[target ] { content: \"[\" }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target] { content: \"[\" }",
    message: messages.expectedClosing,
    line: 1,
    column: 8,
  }, {
    code: "[target ] { content: \"]\" }",
    message: messages.expectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[ target] { content: \"]\" }",
    message: messages.expectedClosing,
    line: 1,
    column: 8,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: ".foo { }",
  }, {
    code: "[target] { }",
  }, {
    code: "[target] { }",
  }, {
    code: "[target=_blank] { }",
  }, {
    code: "[target='_blank'] { }",
  }, {
    code: "[target=\"_blank\"] { }",
  }, {
    code: "[title~=flower] { }",
  }, {
    code: "[title|=flower] { }",
  }, {
    code: "[title^=flower] { }",
  }, {
    code: "[title$=flower] { }",
  }, {
    code: "a[href*=w3schools] { }",
  }, {
    code: "img[alt~=person][src*=lorem] { }",
  }, {
    code: "[target=_blank]:hover { }",
  }, {
    code: "[target=_blank]::before { }",
  }, {
    code: "option[data-hidden=true] { }",
  }, {
    code: "option[dataHidden] { }",
  }, {
    code: "@media screen and (max-width: 480px) { img[align=right] { } }",
  }, {
    code: "[target=_blank] .foo { }",
  }, {
    code: "li[aria-hidden=false]:nth-child(1) { }",
  }, {
    code: "li[aria-hidden=false]:nth-child( 1) { }",
  }, {
    code: "li[aria-hidden=false]:nth-child(1 ) { }",
  }, {
    code: "li[aria-hidden=false]:nth-child( 1 ) { }",
  }, {
    code: "ul li[aria-hidden=false] + li[aria-hidden=false] a { }",
  }, {
    code: "[target] { content: \"[\" }",
  }, {
    code: "[target] { content: \"]\" }",
  } ],

  reject: [ {
    code: "[ target] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 8,
  }, {
    code: "[  target] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target  ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 9,
  }, {
    code: "[ target=_blank] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target=_blank ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "[  target=_blank] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target=_blank  ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 16,
  }, {
    code: "[ target='_blank'] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target='_blank' ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 17,
  }, {
    code: "[ target=\"_blank\"] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target=\"_blank\" ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 17,
  }, {
    code: "a[ href*=w3schools] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 3,
  }, {
    code: "a[href*=w3schools ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 18,
  }, {
    code: "img[ alt~=person][src*=lorem] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 5,
  }, {
    code: "img[alt~=person ][src*=lorem] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 16,
  }, {
    code: "img[alt~=person][ src*=lorem] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 18,
  }, {
    code: "img[alt~=person][src*=lorem ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 28,
  }, {
    code: "[ target=_blank]:hover { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target=_blank ]:hover { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "[ target=_blank]::before { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target=_blank ]::before { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "option[ data-hidden=true] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 8,
  }, {
    code: "option[data-hidden=true ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 24,
  }, {
    code: "option[ dataHidden] { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 8,
  }, {
    code: "option[dataHidden ] { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 18,
  }, {
    code: "@media screen and (max-width: 480px) { img[ align=right] { } }",
    message: messages.rejectedOpening,
    line: 1,
    column: 44,
  }, {
    code: "@media screen and (max-width: 480px) { img[align=right ] { } }",
    message: messages.rejectedClosing,
    line: 1,
    column: 55,
  }, {
    code: "[ target=_blank] .foo { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target=_blank ] .foo { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 15,
  }, {
    code: "li[ aria-hidden=false]:nth-child(1) { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 4,
  }, {
    code: "li[aria-hidden=false ]:nth-child(1) { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 21,
  }, {
    code: "li[ aria-hidden=false]:nth-child( 1 ) { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 4,
  }, {
    code: "li[aria-hidden=false ]:nth-child( 1 ) { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 21,
  }, {
    code: "ul li[ aria-hidden=false] + li[aria-hidden=false] a { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 7,
  }, {
    code: "ul li[aria-hidden=false ] + li[aria-hidden=false] a { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 24,
  }, {
    code: "ul li[aria-hidden=false] + li[ aria-hidden=false] a { }",
    message: messages.rejectedOpening,
    line: 1,
    column: 31,
  }, {
    code: "ul li[aria-hidden=false] + li[aria-hidden=false ] a { }",
    message: messages.rejectedClosing,
    line: 1,
    column: 48,
  }, {
    code: "[ target] { content: \"[\" }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target ] { content: \"[\" }",
    message: messages.rejectedClosing,
    line: 1,
    column: 8,
  }, {
    code: "[ target] { content: \"]\" }",
    message: messages.rejectedOpening,
    line: 1,
    column: 2,
  }, {
    code: "[target ] { content: \"]\" }",
    message: messages.rejectedClosing,
    line: 1,
    column: 8,
  } ],
})
