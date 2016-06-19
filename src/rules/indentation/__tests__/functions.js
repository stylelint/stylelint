import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

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

testRule(rule, {
  ruleName,
  config: [ 2, { indentInsideParens: "once" } ],
  skipBasicChecks: true,

  accept: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "    0,\n" +
    "    0,\n" +
    "    0\n" +
    "  );\n" +
    "  top: 0;\n" +
    "}",
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    "  0\n" +
    ");",
    description: "sass-list",
  }, {
    code: "$colors: (\n" +
    "  primary: (\n" +
    "    base: $route;\n" +
    "    contrast: $white\n" +
    "  )\n" +
    ");",
    description: "nested Sass map",
  }, {
    code: "background:\n" +
    "  linear-gradient(\n" +
    "    to bottom,\n" +
    "    transparentize($gray-dark, 1) 0%,\n" +
    "    transparentize($gray-dark, 0.1) 100%\n" +
    "  );",
    description: "nested parenthetical inside multiline value",
  } ],

  reject: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "    0,\n" +
    "0,\n" +
    "    0\n" +
    "  );\n" +
    "  top: 0;\n" +
    "}",
    message: messages.expected("4 spaces"),
    line: 4,
    column: 1,
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "    0,\n" +
    "    0,\n" +
    "    0\n" +
    "    );\n" +
    "  top: 0;\n" +
    "}",
    message: messages.expected("2 spaces"),
    line: 6,
    column: 5,
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    " 0\n" +
    ");",
    description: "sass-list",
    message: messages.expected("2 spaces"),
    line: 4,
    column: 2,
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    "  0\n" +
    "  );",
    description: "sass-list",
    message: messages.expected("0 spaces"),
    line: 5,
    column: 3,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 2, { indentInsideParens: "twice" } ],
  skipBasicChecks: true,

  accept: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "    );\n" +
    "  top: 0;\n" +
    "}",
  }, {
    code: "$some-list: (\n" +
    "    0,\n" +
    "    0,\n" +
    "    0\n" +
    "  );",
    description: "sass-list",
  } ],

  reject: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "    0,\n" +
    "      0\n" +
    "    );\n" +
    "  top: 0;\n" +
    "}",
    message: messages.expected("6 spaces"),
    line: 4,
    column: 5,
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "     );\n" +
    "  top: 0;\n" +
    "}",
    message: messages.expected("4 spaces"),
    line: 6,
    column: 6,
  }, {
    code: "$some-list: (\n" +
    "    0,\n" +
    "    0,\n" +
    "   0\n" +
    "  );",
    description: "sass-list",
    message: messages.expected("4 spaces"),
    line: 4,
    column: 4,
  }, {
    code: "$some-list: (\n" +
    "    0,\n" +
    "    0,\n" +
    "    0\n" +
    " );",
    description: "sass-list",
    message: messages.expected("2 spaces"),
    line: 5,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 2, { indentInsideParens: "once-at-root-twice-in-block" } ],
  skipBasicChecks: true,

  accept: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "    );\n" +
    "  top: 0;\n" +
    "}",
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    "  0\n" +
    ");",
    description: "sass-list",
  } ],

  reject: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "    0,\n" +
    "      0\n" +
    "    );\n" +
    "  top: 0;\n" +
    "}",
    message: messages.expected("6 spaces"),
    line: 4,
    column: 5,
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "     );\n" +
    "  top: 0;\n" +
    "}",
    message: messages.expected("4 spaces"),
    line: 6,
    column: 6,
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    "  0\n" +
    "  );",
    description: "sass-list",
    message: messages.expected("0 spaces"),
    line: 5,
    column: 3,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 2, {
    indentInsideParens: "once-at-root-twice-in-block",
    indentClosingBrace: true,
  } ],
  skipBasicChecks: true,

  accept: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "      );\n" +
    "  top: 0;\n" +
    "  }",
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    "  0\n" +
    "  );",
    description: "sass-list",
  } ],

  reject: [ {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "    0,\n" +
    "      0\n" +
    "      );\n" +
    "  top: 0;\n" +
    "  }",
    message: messages.expected("6 spaces"),
    line: 4,
    column: 5,
  }, {
    code: ".foo {\n" +
    "  color: rgb(\n" +
    "      0,\n" +
    "      0,\n" +
    "      0\n" +
    "     );\n" +
    "  top: 0;\n" +
    "  }",
    message: messages.expected("6 spaces"),
    line: 6,
    column: 6,
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    " 0\n" +
    "  );",
    description: "sass-list",
    message: messages.expected("2 spaces"),
    line: 4,
    column: 2,
  }, {
    code: "$some-list: (\n" +
    "  0,\n" +
    "  0,\n" +
    "  0\n" +
    ");",
    description: "sass-list",
    message: messages.expected("2 spaces"),
    line: 5,
    column: 1,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ 2, { indentInsideParens: "once" } ],
  syntax: "less",
  skipBasicChecks: true,

  accept: [{
    code: ".foo {\n" +
    "  .mixin(\n" +
    "    @foo,\n" +
    "    @bar,\n" +
    "    @baz\n" +
    "  );\n" +
    "}",
    description: "Less mixin with multi-line arguments",
  }],
})
