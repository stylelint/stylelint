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
    order: "flexible",
    properties: [
      "color",
      "font-size",
      "font-weight",
    ],
  },
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }")
  tr.ok("a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }")
  tr.ok("a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }")
  tr.ok("a { height: 1px; width: 2px; font-weight: bold; font-size: 2px; color: pink; }")

  tr.notOk("a { height: 1px; font-weight: bold; width: 2px; }", {
    message: messages.expected("width", "font-weight"),
    line: 1,
    column: 37,
  })
  tr.notOk("a { font-weight: bold; height: 1px; width: 2px; }", {
    message: messages.expected("height", "font-weight"),
    line: 1,
    column: 24,
  })
  tr.notOk("a { width: 2px; height: 1px; font-weight: bold; }", {
    message: messages.expected("height", "width"),
    line: 1,
    column: 17,
  })
  tr.notOk("a { height: 1px; color: pink; width: 2px; font-weight: bold; }", {
    message: messages.expected("width", "color"),
    line: 1,
    column: 31,
  })
})

testRule([
  "height",
  {
    order: "flexible",
    emptyLineBefore: true,
    properties: [
      "color",
      "font-size",
      "font-weight",
    ],
  },
], tr => {
  warningFreeBasics(tr)

  tr.ok("a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}")
  tr.ok("a {\n  height: 1px;\n\n font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}")
  tr.ok("a {\n  height: 1px;\n\n  font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}")
  tr.ok("a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}")

  tr.notOk(
    "a {\n  height: 1px;\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
    {
      message: messages.expectedEmptyLineBetween("color", "height"),
      line: 3,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
    {
      message: messages.expectedEmptyLineBetween("font-size", "height"),
      line: 3,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
    {
      message: messages.expectedEmptyLineBetween("font-weight", "height"),
      line: 3,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  font-size: 2px;\n  color: pink;\n}",
    {
      message: messages.expectedEmptyLineBetween("font-size", "height"),
      line: 3,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  width: 2px;\n  color: pink;\n}",
    {
      message: messages.expectedEmptyLineBetween("color", "width"),
      line: 4,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  width: 2px;\n  border: 1px solid;\n  font-weight: pink;\n}",
    {
      message: messages.expectedEmptyLineBetween("font-weight", "border"),
      line: 5,
      column: 3,
    }
  )
})
