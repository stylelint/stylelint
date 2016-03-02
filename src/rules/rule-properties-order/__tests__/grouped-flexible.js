// import {
//   ruleTester,
//   warningFreeBasics,
// } from "../../../testUtils"
// import rule, { ruleName, messages } from ".."
//
// const testRule = ruleTester(rule, ruleName)
//
// testRule([
//   "height",
//   "width",
//   {
//     order: "flexible",
//     properties: [
//       "color",
//       "font-size",
//       "font-weight",
//     ],
//   },
// ], tr => {
//   warningFreeBasics(tr)
//
//   tr.ok("a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }")
//   tr.ok("a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }")
//   tr.ok("a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }")
//   tr.ok("a { height: 1px; width: 2px; font-weight: bold; font-size: 2px; color: pink; }")
//
//   tr.notOk("a { height: 1px; font-weight: bold; width: 2px; }", {
//     message: messages.expected("width", "font-weight"),
//     line: 1,
//     column: 37,
//   })
//   tr.notOk("a { font-weight: bold; height: 1px; width: 2px; }", {
//     message: messages.expected("height", "font-weight"),
//     line: 1,
//     column: 24,
//   })
//   tr.notOk("a { width: 2px; height: 1px; font-weight: bold; }", {
//     message: messages.expected("height", "width"),
//     line: 1,
//     column: 17,
//   })
//   tr.notOk("a { height: 1px; color: pink; width: 2px; font-weight: bold; }", {
//     message: messages.expected("width", "color"),
//     line: 1,
//     column: 31,
//   })
// })
//
// // Deprecated `emptyLineBefore: true`
// testRule([
//   "height",
//   {
//     order: "flexible",
//     emptyLineBefore: true,
//     properties: [
//       "color",
//       "font-size",
//       "font-weight",
//     ],
//   },
// ], tr => {
//   const deprecationTest = "In 'rule-properties-order', the value 'true' for 'emptyLineBefore' has been deprecated and in 5.0 it will be removed. Use 'always' or 'never' instead."
//   tr.notOk("a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}", deprecationTest)
//   tr.notOk("a {\n  height: 1px;\n\n font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}", deprecationTest)
//   tr.notOk("a {\n  height: 1px;\n\n  font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}", deprecationTest)
//   tr.notOk("a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}", deprecationTest)
//   tr.notOk("a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}", deprecationTest)
// })
//
// testRule([
//   "height",
//   {
//     order: "flexible",
//     emptyLineBefore: "always",
//     properties: [
//       "color",
//       "font-size",
//       "font-weight",
//     ],
//   },
// ], tr => {
//   warningFreeBasics(tr)
//
//   tr.ok("a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}")
//   tr.ok("a {\n  height: 1px;\n\n font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}")
//   tr.ok("a {\n  height: 1px;\n\n  font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}")
//   tr.ok("a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}")
//   tr.ok("a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}", "comment before line break")
//
//   tr.notOk(
//     "a {\n  height: 1px;\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("color", "height"),
//       line: 3,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("font-size", "height"),
//       line: 3,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("font-weight", "height"),
//       line: 3,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  font-size: 2px;\n  color: pink;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("font-size", "height"),
//       line: 3,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  width: 2px;\n  color: pink;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("color", "width"),
//       line: 4,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  width: 2px;\n  border: 1px solid;\n  font-weight: pink;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("font-weight", "border"),
//       line: 5,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  /* something */\n  font-weight: bold;\n}",
//     {
//       message: messages.expectedEmptyLineBetween("font-weight", "height"),
//       line: 4,
//       column: 3,
//     }
//   )
// })
//
// testRule([
//   "height",
//   {
//     order: "flexible",
//     emptyLineBefore: "never",
//     properties: [
//       "color",
//       "font-size",
//       "font-weight",
//     ],
//   },
// ], tr => {
//   warningFreeBasics(tr)
//
//   tr.ok("a {\n  height: 1px; color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}")
//   tr.ok("a {\n  height: 1px; font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}")
//   tr.ok("a {\n  height: 1px; font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}")
//   tr.ok("a {\n  height: 1px; font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}")
//   tr.ok("a {\n  height: 1px; /* something */\n  font-weight: bold;\n}", "comment before line break")
//
//   tr.notOk(
//     "a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("color", "height"),
//       line: 4,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n\n  font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("font-size", "height"),
//       line: 4,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("font-weight", "height"),
//       line: 4,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n\n  font-size: 2px;\n  color: pink;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("font-size", "height"),
//       line: 4,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  width: 2px;\n\n  color: pink;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("color", "width"),
//       line: 5,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n  width: 2px;\n  border: 1px solid;\n\n  font-weight: pink;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("font-weight", "border"),
//       line: 6,
//       column: 3,
//     }
//   )
//   tr.notOk(
//     "a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}",
//     {
//       message: messages.unexpectedEmptyLineBetween("font-weight", "height"),
//       line: 5,
//       column: 3,
//     }
//   )
// })
