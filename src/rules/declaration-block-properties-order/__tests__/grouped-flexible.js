import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

import postcss from "postcss"
import test from "tape"
import stylelint from "../../.."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,

  config: [[
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
  ]],

  accept: [ {
    code: "a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }",
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }",
  }, {
    code: "a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }",
  }, {
    code: "a { height: 1px; width: 2px; font-weight: bold; font-size: 2px; color: pink; }",
  }, {
    code: "a { height: 10px; background: orange; }",
    description: "unspecified after groupless specified",
  }, {
    code: "a { font-weight: bold; background: orange; }",
    description: "unspecified after grouped specified",
  }, {
    code: "a { background: orange; height: 10px; }",
    description: "unspecified before groupless specified",
  }, {
    code: "a { background: orange; font-weight: bold; }",
    description: "unspecified before grouped specified",
  } ],

  reject: [ {
    code: "a { height: 1px; font-weight: bold; width: 2px; }",
    message: messages.expected("width", "font-weight"),
    line: 1,
    column: 37,
  }, {
    code: "a { font-weight: bold; height: 1px; width: 2px; }",
    message: messages.expected("height", "font-weight"),
    line: 1,
    column: 24,
  }, {
    code: "a { width: 2px; height: 1px; font-weight: bold; }",
    message: messages.expected("height", "width"),
    line: 1,
    column: 17,
  }, {
    code: "a { height: 1px; color: pink; width: 2px; font-weight: bold; }",
    message: messages.expected("width", "color"),
    line: 1,
    column: 31,
  } ],
})

testRule(rule, {
  ruleName,

  config: [[
    "height",
    {
      order: "flexible",
      // emptyLineBefore: "always",
      properties: [
        "color",
        "font-size",
        "font-weight",
      ],
    },
  ]],

  accept: [ {
    code: "a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
  }, {
    code: "a {\n  height: 1px;\n\n font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
  }, {
    code: "a {\n  height: 1px;\n\n  font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}",
  }, {
    code: "a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
  }, {
    code: "a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}",
    description: "comment before line break",
  }, {
    code: "a { height: 10px; background: orange; }",
    description: "unspecified after groupless specified",
  }, {
    code: "a { font-weight: bold; background: orange; }",
    description: "unspecified after grouped specified",
  }, {
    code: "a { background: orange; height: 10px; }",
    description: "unspecified before groupless specified",
  }, {
    code: "a {\n  background: orange;\n\n  font-weight: bold;\n}",
    description: "unspecified before grouped specified",
  } ],

  // reject: [ {
  //   code: "a {\n  height: 1px;\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
  //   message: messages.expectedEmptyLineBetween("color", "height"),
  //   line: 3,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
  //   message: messages.expectedEmptyLineBetween("font-size", "height"),
  //   line: 3,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
  //   message: messages.expectedEmptyLineBetween("font-weight", "height"),
  //   line: 3,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  font-size: 2px;\n  color: pink;\n}",
  //   message: messages.expectedEmptyLineBetween("font-size", "height"),
  //   line: 3,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  width: 2px;\n  color: pink;\n}",
  //   message: messages.expectedEmptyLineBetween("color", "width"),
  //   line: 4,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  width: 2px;\n  border: 1px solid;\n  font-weight: pink;\n}",
  //   message: messages.expectedEmptyLineBetween("font-weight", "border"),
  //   line: 5,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  /* something */\n  font-weight: bold;\n}",
  //   message: messages.expectedEmptyLineBetween("font-weight", "height"),
  //   line: 4,
  //   column: 3,
  // } ],
})

testRule(rule, {
  ruleName,

  config: [[
    "height",
    {
      order: "flexible",
      // emptyLineBefore: "never",
      properties: [
        "color",
        "font-size",
        "font-weight",
      ],
    },
  ]],

  accept: [ {
    code: "a {\n  height: 1px; color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
  }, {
    code: "a {\n  height: 1px; font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
  }, {
    code: "a {\n  height: 1px; font-size: 2px;\n  font-weight: bold;\n  color: pink;\n}",
  }, {
    code: "a {\n  height: 1px; font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
  }, {
    code: "a {\n  height: 1px; /* something */\n  font-weight: bold;\n}",
    description: "comment before line break",
  } ],

  // reject: [ {
  //   code: "a {\n  height: 1px;\n\n  color: pink;\n  font-size: 2px;\n  font-weight: bold;\n}",
  //   message: messages.rejectedEmptyLineBetween("color", "height"),
  //   line: 4,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n\n  font-size: 2px;\n  color: pink;\n  font-weight: bold;\n}",
  //   message: messages.rejectedEmptyLineBetween("font-size", "height"),
  //   line: 4,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n\n  font-weight: bold;\n  font-size: 2px;\n  color: pink;\n}",
  //   message: messages.rejectedEmptyLineBetween("font-weight", "height"),
  //   line: 4,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n\n  font-size: 2px;\n  color: pink;\n}",
  //   message: messages.rejectedEmptyLineBetween("font-size", "height"),
  //   line: 4,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  width: 2px;\n\n  color: pink;\n}",
  //   message: messages.rejectedEmptyLineBetween("color", "width"),
  //   line: 5,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n  width: 2px;\n  border: 1px solid;\n\n  font-weight: pink;\n}",
  //   message: messages.rejectedEmptyLineBetween("font-weight", "border"),
  //   line: 6,
  //   column: 3,
  // }, {
  //   code: "a {\n  height: 1px;\n\n  /* something */\n  font-weight: bold;\n}",
  //   message: messages.rejectedEmptyLineBetween("font-weight", "height"),
  //   line: 5,
  //   column: 3,
  // } ],
})

test("deprecation warning for emptyLineBefore", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [
        {
          order: "flexible",
          emptyLineBefore: "never",
          properties: [
            "height",
            "width",
          ],
        },
        {
          order: "flexible",
          emptyLineBefore: "never",
          properties: [
            "color",
            "font-size",
            "font-weight",
          ],
        },
      ],
    },
  }

  const css = `
    a {
      height: 1px;

      font-size: 2px;
      color: pink;
      font-weight: bold;
    }
  `

  let planned = 0

  postcss().use(stylelint(config)).process(css).then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'emptyLineBefore' option for 'declaration-block-properties-order' has been deprecated, and will be removed in '7.0'. If you use this option please consider creating a plugin for the community.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Unexpected empty line between property \"font-size and property \"height\" (declaration-block-properties-order)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
