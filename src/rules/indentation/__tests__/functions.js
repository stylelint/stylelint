import testRule from "../../../testUtils/testRule"

import rule, { ruleName } from ".."

testRule(rule, {
  ruleName,
  config: [2],
  skipBasicChecks: true,

  accept: [ {
    code: ".foo {\n" +
    "  color: rgb(0, 0, 0);\n" +
    "}",
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "    0,\n" +
    "    0,\n" +
    "    0\n" +
    "  );\n" +
    "}",
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "    );\n" +
    "}",
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "0,\n" +
    "0,\n" +
    "0\n" +
    "    );\n" +
    "}",
  }, {
    code: ".foo {\n" +
    "  color: bar(\n" +
    "    rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "    )\n" +
    "  );\n" +
    "}",
  }, {
    code: ".foo {\n" +
    "  color: bar(\n" +
    "      rgb(\n" +
    "        0,\n" +
    "        0,\n" +
    "        0\n" +
    "      )\n" +
    "    );\n" +
    "}",
  }, {
    code: "$tooltip-default-settings: (\n" +
    "    tooltip-gutter: 8px 10px,\n" +
    "  tooltip-border: 1px solid,\n" +
    ");",
    description: "Sass maps ignored",
  } ],
})
