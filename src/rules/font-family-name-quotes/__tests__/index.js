import { testRule } from "../../../testUtils"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["single-where-required"],

  accept: [ {
    code: "a { font-family: $sassy-font-family; }",
    description: "ignores sass variables",
  }, {
    code: "a { font-family: @less-666; }",
    description: "ignores less variables",
  }, {
    code: "a { font-family: var(--ff1); }",
    description: "ignores custom properties",
  }, {
    code: "a { font-family: Lucida Grande, Arial, sans-serif; }",
  }, {
    code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
  }, {
    code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: 'Lucida Grande', Arial, sans-serif; }",
    message: messages.expected("no", "Lucida Grande"),
    line: 1,
    column: 19,
  }, {
    code: "a { font-family: Lucida Grande, Arial, 'sans-serif'; }",
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 41,
  }, {
    code: "a { font-family: Red/Black, Arial, sans-serif; }",
    message: messages.expected("single", "Red/Black"),
  }, {
    code: "a { font-family: \"Red/Black\", Arial, sans-serif; }",
    message: messages.expected("single", "Red/Black"),
  }, {
    code: "a { font-family: Arial, Ahem!, sans-serif; }",
    message: messages.expected("single", "Ahem!"),
  }, {
    code: "a { font-family: Arial, \"Ahem!\", sans-serif; }",
    message: messages.expected("single", "Ahem!"),
  }, {
    code: "a { font-family: Hawaii 5-0, Arial, sans-serif; }",
    message: messages.expected("single", "Hawaii 5-0"),
  }, {
    code: "a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }",
    message: messages.expected("single", "Hawaii 5-0"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["double-where-required"],

  accept: [ {
    code: "a { font-family: $sassy-font-family; }",
    description: "ignores sass variables",
  }, {
    code: "a { font-family: @less-666; }",
    description: "ignores less variables",
  }, {
    code: "a { font-family: var(--ff1); }",
    description: "ignores custom properties",
  }, {
    code: "a { font-family: Lucida Grande, Arial, sans-serif; }",
  }, {
    code: "a { font-family: \"Red/Black\", Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, \"Ahem!\", sans-serif; }",
  }, {
    code: "a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: \"Lucida Grande\", Arial, sans-serif; }",
    message: messages.expected("no", "Lucida Grande"),
    line: 1,
    column: 19,
  }, {
    code: "a { font-family: Lucida Grande, Arial, \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 41,
  }, {
    code: "a { font-family: Red/Black, Arial, sans-serif; }",
    message: messages.expected("double", "Red/Black"),
  }, {
    code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
    message: messages.expected("double", "Red/Black"),
  }, {
    code: "a { font-family: Arial, Ahem!, sans-serif; }",
    message: messages.expected("double", "Ahem!"),
  }, {
    code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
    message: messages.expected("double", "Ahem!"),
  }, {
    code: "a { font-family: Hawaii 5-0, Arial, sans-serif; }",
    message: messages.expected("double", "Hawaii 5-0"),
  }, {
    code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
    message: messages.expected("double", "Hawaii 5-0"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["single-where-recommended"],

  accept: [ {
    code: "a { font-family: $sassy-font-family; }",
    description: "ignores sass variables",
  }, {
    code: "a { font-family: @less-666; }",
    description: "ignores less variables",
  }, {
    code: "a { font-family: var(--ff1); }",
    description: "ignores custom properties",
  }, {
    code: "a { font-family: 'Lucida Grande', Arial, sans-serif; }",
  }, {
    code: "a { font-family: Times, 'Times New Roman', serif; }",
  }, {
    code: "a { font-family: 'Something6'; }",
  }, {
    code: "a { font-family: 'snake_case'; }",
  }, {
    code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
  }, {
    code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: Lucida Grande, Arial, sans-serif; }",
    message: messages.expected("single", "Lucida Grande"),
    line: 1,
    column: 18,
  }, {
    code: "a { font-family: 'Lucida Grande', Arial, 'sans-serif'; }",
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 43,
  }, {
    code: "a { font-family: Red/Black, Arial, sans-serif; }",
    message: messages.expected("single", "Red/Black"),
  }, {
    code: "a { font-family: \"Red/Black\", Arial, sans-serif; }",
    message: messages.expected("single", "Red/Black"),
  }, {
    code: "a { font-family: Arial, Ahem!, sans-serif; }",
    message: messages.expected("single", "Ahem!"),
  }, {
    code: "a { font-family: Arial, \"Ahem!\", sans-serif; }",
    message: messages.expected("single", "Ahem!"),
  }, {
    code: "a { font-family: Hawaii 5-0, Arial, sans-serif; }",
    message: messages.expected("single", "Hawaii 5-0"),
  }, {
    code: "a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }",
    message: messages.expected("single", "Hawaii 5-0"),
  }, {
    code: "a { font-family: Times, Times New Roman, serif; }",
    message: messages.expected("single", "Times New Roman"),
  }, {
    code: "a { font-family: Times, \"Times New Roman\", serif; }",
    message: messages.expected("single", "Times New Roman"),
  }, {
    code: "a { font-family: Something6; }",
    message: messages.expected("single", "Something6"),
  }, {
    code: "a { font-family: \"Something6\"; }",
    message: messages.expected("single", "Something6"),
  }, {
    code: "a { font-family: snake_case; }",
    message: messages.expected("single", "snake_case"),
  }, {
    code: "a { font-family: \"snake_case\"; }",
    message: messages.expected("single", "snake_case"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["double-where-recommended"],

  accept: [ {
    code: "a { font-family: $sassy-font-family; }",
    description: "ignores sass variables",
  }, {
    code: "a { font-family: @less-666; }",
    description: "ignores less variables",
  }, {
    code: "a { font-family: var(--ff1); }",
    description: "ignores custom properties",
  }, {
    code: "a { font-family: \"Lucida Grande\", Arial, sans-serif; }",
  }, {
    code: "a { font-family: Times, \"Times New Roman\", serif; }",
  }, {
    code: "a { font-family: \"Something6\"; }",
  }, {
    code: "a { font-family: \"snake_case\"; }",
  }, {
    code: "a { font-family: \"Red/Black\", Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, \"Ahem!\", sans-serif; }",
  }, {
    code: "a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: Lucida Grande, Arial, sans-serif; }",
    message: messages.expected("double", "Lucida Grande"),
    line: 1,
    column: 18,
  }, {
    code: "a { font-family: \"Lucida Grande\", Arial, \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 43,
  }, {
    code: "a { font-family: Red/Black, Arial, sans-serif; }",
    message: messages.expected("double", "Red/Black"),
  }, {
    code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
    message: messages.expected("double", "Red/Black"),
  }, {
    code: "a { font-family: Arial, Ahem!, sans-serif; }",
    message: messages.expected("double", "Ahem!"),
  }, {
    code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
    message: messages.expected("double", "Ahem!"),
  }, {
    code: "a { font-family: Hawaii 5-0, Arial, sans-serif; }",
    message: messages.expected("double", "Hawaii 5-0"),
  }, {
    code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
    message: messages.expected("double", "Hawaii 5-0"),
  }, {
    code: "a { font-family: Times, Times New Roman, serif; }",
    message: messages.expected("double", "Times New Roman"),
  }, {
    code: "a { font-family: Times, 'Times New Roman', serif; }",
    message: messages.expected("double", "Times New Roman"),
  }, {
    code: "a { font-family: Something6; }",
    message: messages.expected("double", "Something6"),
  }, {
    code: "a { font-family: 'Something6'; }",
    message: messages.expected("double", "Something6"),
  }, {
    code: "a { font-family: snake_case; }",
    message: messages.expected("double", "snake_case"),
  }, {
    code: "a { font-family: 'snake_case'; }",
    message: messages.expected("double", "snake_case"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["single-unless-keyword"],

  accept: [ {
    code: "a { font-family: $sassy-font-family; }",
    description: "ignores sass variables",
  }, {
    code: "a { font-family: @less-666; }",
    description: "ignores less variables",
  }, {
    code: "a { font-family: var(--ff1); }",
    description: "ignores custom properties",
  }, {
    code: "a { font-family: 'Lucida Grande', 'Arial', sans-serif; }",
  }, {
    code: "a { font-family: 'Hawaii 5-0', 'Arial', cursive; }",
  }, {
    code: "a { font-family: 'Times', 'Arial', serif; }",
  }, {
    code: "a { font-family: 'Times', 'Arial', fantasy; }",
  }, {
    code: "a { font-family: 'Times', 'Arial', cursive; }",
  }, {
    code: "a { font-family: inherit; }",
  } ],

  reject: [ {
    code: "a { font-family: 'Lucida Grande', 'Arial', 'sans-serif'; }",
    message: messages.expected("no", "sans-serif"),
  }, {
    code: "a { font-family: 'inherit'; }",
    message: messages.expected("no", "inherit"),
  }, {
    code: "a { font-family: \"Lucida Grande\", 'Arial', sans-serif; }",
    message: messages.expected("single", "Lucida Grande"),
  }, {
    code: "a { font-family: 'Lucida Grande', \"Arial\", sans-serif; }",
    message: messages.expected("single", "Arial"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["double-unless-keyword"],

  accept: [ {
    code: "a { font-family: $sassy-font-family; }",
    description: "ignores sass variables",
  }, {
    code: "a { font-family: @less-666; }",
    description: "ignores less variables",
  }, {
    code: "a { font-family: var(--ff1); }",
    description: "ignores custom properties",
  }, {
    code: "a { font-family: \"Lucida Grande\", \"Arial\", sans-serif; }",
  }, {
    code: "a { font-family: \"Hawaii 5-0\", \"Arial\", cursive; }",
  }, {
    code: "a { font-family: \"Times\", \"Arial\", serif; }",
  }, {
    code: "a { font-family: \"Times\", \"Arial\", fantasy; }",
  }, {
    code: "a { font-family: \"Times\", \"Arial\", cursive; }",
  }, {
    code: "a { font-family: inherit; }",
  } ],

  reject: [ {
    code: "a { font-family: \"Lucida Grande\", \"Arial\", \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
  }, {
    code: "a { font-family: \"inherit\"; }",
    message: messages.expected("no", "inherit"),
  }, {
    code: "a { font-family: 'Lucida Grande', \"Arial\", sans-serif; }",
    message: messages.expected("double", "Lucida Grande"),
  }, {
    code: "a { font-family: \"Lucida Grande\", 'Arial', sans-serif; }",
    message: messages.expected("double", "Arial"),
  } ],
})
