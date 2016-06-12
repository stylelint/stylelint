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
//     "transform": ["/scale/"],
//     "whitespace": ["nowrap"],
//     "/color/": ["/^green/"],
//   }],
//
//   accept: [ {
//     code: "div { whitespace: nowrap; }",
//   }, {
//     code: "a { transform: scale(1, 1); }",
//   }, {
//     code: "a { -webkit-transform: scale(1, 1); }",
//   }, {
//     code: "a { color: green; }",
//   }, {
//     code: "a { background-color: green; }",
//   } ],
//
//   reject: [ {
//     code: "div { whitespace: pre; }",
//     message: messages.rejected("whitespace", "pre"),
//     line: 1,
//     column: 7,
//   }, {
//     code: "a { transform: translate(1, 1); }",
//     message: messages.rejected("transform", "translate(1, 1)"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { -webkit-transform: translate(1, 1); }",
//     message: messages.rejected("-webkit-transform", "translate(1, 1)"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { color: pink; }",
//     message: messages.rejected("color", "pink"),
//     line: 1,
//     column: 5,
//   }, {
//     code: "a { background-color: pink; }",
//     message: messages.rejected("background-color", "pink"),
//     line: 1,
//     column: 5,
//   } ],
// })
//
// testRule(rule, {
//   ruleName,
//   config: { position: ["static"] },
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
      "property-value-whitelist": { "text-transform": ["uppercase"] },
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { text-transform: lowercase; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "'property-value-whitelist' has been deprecated, and will be removed in '7.0'. Use 'declaration-property-value-whitelist' instead.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Unexpected value \"lowercase\" for property \"text-transform\" (property-value-whitelist)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
