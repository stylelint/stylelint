// import { testRule } from "../../../testUtils"
// import rules from "../../../rules"
// import { ruleName, messages } from ".."
//
// const rule = rules[ruleName]
//
// testRule(rule, {
//   ruleName,
//
//   config: [{
//     // regular string
//     "text-transform": ["uppercase"],
//     // regexes
//     "transform": [ "/scale3d/", "/rotate3d/", "/translate3d/" ],
//     // mixed string and regex
//     "color": [ "red", "green", "blue", "/^sea/" ],
//   }],
//
//   accept: [ {
//     code: "a { color: pink; }",
//   }, {
//     code: "a { color: lightgreen; }",
//   }, {
//     code: "a { text-transform: lowercase; }",
//   }, {
//     code: "a { transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translate(12px, 50%); }",
//   }, {
//     code: "a { -webkit-transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0) translate(12px, 50%); }",
//   }, {
//     code: "a { color: /* red */ pink; }",
//     description: "ignore value within comments",
//   }, {
//     code: "a::before { color: \"red\"}",
//     description: "ignore value within quotes",
//   }, {
//     code: "a { color: $red; }",
//     description: "ignore preprocessor variable includes value",
//   }, {
//     code: "a { color: --some-red; }",
//     description: "ignore css variable includes value",
//   }, {
//     code: "a { color: darkseagreen }",
//
//     description: {
//       message: messages.rejected("color", "darkseagreen"),
//       column: 5,
//     },
//   } ],
//
//   reject: [ {
//     code: "a { color: red; }",
//     message: messages.rejected("color", "red"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { color: green }",
//     message: messages.rejected("color", "green"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { text-transform: uppercase; }",
//     message: messages.rejected("text-transform", "uppercase"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { transform: scale3d(1, 2, 3) }",
//     message: messages.rejected("transform", "scale3d(1, 2, 3)"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { -webkit-transform: scale3d(1, 2, 3) }",
//     message: messages.rejected("-webkit-transform", "scale3d(1, 2, 3)"),
//     column: 5,
//   }, {
//     code: "a { color: seagreen }",
//     message: messages.rejected("color", "seagreen"),
//     column: 5,
//   } ],
// })
//
// testRule(rule, {
//   ruleName,
//
//   config: [{
//     "/^animation/": ["/ease/"],
//   }],
//
//   skipBasicChecks: true,
//
//   accept: [ {
//     code: "a { animation: foo 1s linear; }",
//   }, {
//     code: "a { -webkit-animation: foo 1s linear; }",
//   }, {
//     code: "a { animation-timing-function: linear; }",
//   }, {
//     code: "a { -webkit-animation-timing-function: linear; }",
//   } ],
//
//   reject: [ {
//     code: "a { animation: foo 1s ease-in-out; }",
//     message: messages.rejected("animation", "foo 1s ease-in-out"),
//   }, {
//     code: "a { -webkit-animation: foo 1s ease-in-out; }",
//     message: messages.rejected("-webkit-animation", "foo 1s ease-in-out"),
//   }, {
//     code: "a { animation-timing-function: ease-in-out; }",
//     message: messages.rejected("animation-timing-function", "ease-in-out"),
//   }, {
//     code: "a { -webkit-animation-timing-function: ease-in-out; }",
//     message: messages.rejected("-webkit-animation-timing-function", "ease-in-out"),
//   } ],
// })
//
// testRule(rule, {
//   ruleName,
//   config: { position: ["fixed"] },
//   skipBasicChecks: true,
//   accept: [
//     {
//       code: "a { font-size: 1em; }",
//       description: "irrelevant CSS",
//     },
//   ],
// })

import postcss from "postcss"
import test from "tape"
import stylelint from "../../.."

test("deprecation warning", t => {
  const config = {
    rules: {
      "property-value-blacklist": { "text-transform": ["uppercase"] },
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { text-transform: uppercase; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "'property-value-blacklist' has been deprecated, and will be removed in '7.0'. Use 'declaration-property-value-blacklist' instead.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Unexpected value \"uppercase\" for property \"text-transform\" (property-value-blacklist)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
