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
    emptyLineBefore: "always",
    properties: [
      "height",
      "width",
    ],
  },
  {
    emptyLineBefore: "always",
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
    emptyLineBefore: "never",
    properties: [
      "height",
      "width",
    ],
  },
  {
    emptyLineBefore: "never",
    properties: [
      "font-size",
      "font-weight",
    ],
  },
], tr => {
  warningFreeBasics(tr)

  tr.ok("a {\r\n  height: 1px;\r\n  width: 2px;\r\n  font-size: 2px;\r\n  font-weight: bold;\r\n}")
  tr.ok("a {\r\n  height: 1px;\r\n  font-weight: bold;\r\n}")
  tr.ok("a {\r\n  height: 1px;  \r\n  font-weight: bold;\r\n}")

  tr.notOk(
    "a {\r\n  height: 1px;\r\n  width: 2px;\r\n\r\n  font-size: 2px;\r\n  font-weight: bold;\r\n}",
    {
      message: messages.unexpectedEmptyLineBetween("font-size", "width"),
      line: 5,
      column: 3,
    }
  )
  tr.notOk(
    "a {\r\n  height: 1px;\r\n\r\n  font-weight: bold;\r\n}",
    {
      message: messages.unexpectedEmptyLineBetween("font-weight", "height"),
      line: 4,
      column: 3,
    }
  )
})

testRule([
  {
    emptyLineBefore: "always",
    properties: [
      "margin-top",
      "margin-right",
      "margin-bottom",
    ],
  },
  {
    emptyLineBefore: "always",
    properties: [
      "font-size",
    ],
  },
], tr => {
  tr.ok(".foo { margin-bottom: 20px;\n\nfont-size: 26px; }")
  tr.notOk(".foo { margin-bottom: 20px; font-size: 26px; }",
    messages.expectedEmptyLineBetween("font-size", "margin-bottom"))
})

testRule([
  {
    emptyLineBefore: "never",
    properties: [
      "margin-top",
      "margin-right",
      "margin-bottom",
    ],
  },
  {
    emptyLineBefore: "never",
    properties: [
      "font-size",
    ],
  },
], tr => {
  tr.ok(".foo { margin-bottom: 20px; font-size: 26px; }")
  tr.notOk(".foo { margin-bottom: 20px;\n\n font-size: 26px; }",
    messages.unexpectedEmptyLineBetween("font-size", "margin-bottom"))
})
