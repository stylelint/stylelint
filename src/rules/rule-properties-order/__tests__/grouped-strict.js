import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "height",
  "width",
  {
    order: "strict",
    properties: [
      "color",
      "font-size",
      "font-weight",
    ],
  },
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }")

  tr.notOk(
    "a { width: 2px; color: pink; font-size: 2px; font-weight: bold; height: 1px; }",
    messages.expected("height", "font-weight")
  )
  tr.notOk(
    "a { height: 1px; color: pink; width: 2px; font-size: 2px; font-weight: bold; }",
    messages.expected("width", "color")
  )
  tr.notOk(
    "a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }",
    messages.expected("color", "font-size")
  )
  tr.notOk(
    "a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }",
    messages.expected("color", "font-weight")
  )
  tr.notOk(
    "a { height: 1px; width: 2px; color: pink; font-weight: bold; font-size: 2px; }",
    messages.expected("font-size", "font-weight")
  )
})

testRule([
  {
    emptyLineBefore: true,
    properties: [
      "height",
      "width",
    ],
  },
  {
    emptyLineBefore: true,
    properties: [
      "font-size",
      "font-weight",
    ],
  },
], tr => {
  warningFreeBasics(tr)

  tr.ok("a {\r\n  height: 1px;\r\n  width: 2px;\r\n\r\n  font-size: 2px;\r\n  font-weight: bold;\r\n}")
  tr.ok("a {\r\n  height: 1px;\r\n\r\n  font-weight: bold;\r\n}")
  tr.ok("a {\r\n  height: 1px;\r\n  \r\n  font-weight: bold;\r\n}")

  tr.notOk(
    "a {\r\n  height: 1px;\r\n  width: 2px;\r\n  font-size: 2px;\r\n  font-weight: bold;\r\n}",
    {
      message: messages.expectedEmptyLineBetween("font-size", "width"),
      line: 4,
      column: 3,
    }
  )
  tr.notOk(
    "a {\r\n  height: 1px;\r\n  font-weight: bold;\r\n}",
    {
      message: messages.expectedEmptyLineBetween("font-weight", "height"),
      line: 3,
      column: 3,
    }
  )
})

testRule([
  {
    properties: [
      "margin-top",
      "margin-right",
      "margin-bottom",
    ],
  },
  {
    properties: [
      "font-size",
    ],
  },
], tr => {
  tr.ok(".foo { margin-bottom: 20px; font-size: 26px; }")
})
