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

  tr.ok("a { height: 10px; background: orange; }", "unspecified after groupless specified")
  tr.ok("a { font-weight: bold; background: orange; }", "unspecified after grouped specified")
  tr.ok("a { background: orange; height: 10px; }", "unspecified before groupless specified")
  tr.ok("a { background: orange; font-weight: bold; }", "unspecified before grouped specified")

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
    emptyLineBefore: "always",
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
  tr.ok("a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}", "comment before line break")

  tr.ok("a { height: 10px; background: orange; }", "unspecified after groupless specified")
  tr.ok("a { font-weight: bold; background: orange; }", "unspecified after grouped specified")
  tr.ok("a { background: orange; height: 10px; }", "unspecified before groupless specified")
  tr.ok("a {\n  background: orange;\n\n  font-weight: bold;\n}", "unspecified before grouped specified")

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
  tr.notOk(
    "a {\n  height: 1px;\n  /* something */\n  font-weight: bold;\n}",
    {
      message: messages.expectedEmptyLineBetween("font-weight", "height"),
      line: 4,
      column: 3,
    }
  )
})

testRule([
  "height",
  {
    order: "flexible",
    emptyLineBefore: "never",
    properties: [
      "color",
      "font-size",
      "font-weight",
    ],
  },
], tr => {
  warningFreeBasics(tr)

  tr.ok("a {\n  height: 1px; color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}")
  tr.ok("a {\n  height: 1px; font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}")
  tr.ok("a {\n  height: 1px; font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}")
  tr.ok("a {\n  height: 1px; font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}")
  tr.ok("a {\n  height: 1px; /* something */\n  font-weight: bold;\n}", "comment before line break")

  tr.notOk(
    "a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
    {
      message: messages.rejectedEmptyLineBetween("color", "height"),
      line: 4,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n\n  font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
    {
      message: messages.rejectedEmptyLineBetween("font-size", "height"),
      line: 4,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
    {
      message: messages.rejectedEmptyLineBetween("font-weight", "height"),
      line: 4,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n\n  font-size: 2px;\n  color: pink;\n}",
    {
      message: messages.rejectedEmptyLineBetween("font-size", "height"),
      line: 4,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  width: 2px;\n\n  color: pink;\n}",
    {
      message: messages.rejectedEmptyLineBetween("color", "width"),
      line: 5,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n  width: 2px;\n  border: 1px solid;\n\n  font-weight: pink;\n}",
    {
      message: messages.rejectedEmptyLineBetween("font-weight", "border"),
      line: 6,
      column: 3,
    }
  )
  tr.notOk(
    "a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}",
    {
      message: messages.rejectedEmptyLineBetween("font-weight", "height"),
      line: 5,
      column: 3,
    }
  )
})
