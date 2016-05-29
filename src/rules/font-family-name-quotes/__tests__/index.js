import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

import postcss from "postcss"
import test from "tape"
import stylelint from "../../.."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always-unless-keyword"],

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
    code: "$font-family: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@font-family: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "$default-font-family: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@default-font-family: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "$font-family-variable: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@font-family-variable: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "a { font-family: \"Lucida Grande\", \"Arial\", sans-serif; }",
  }, {
    code: "a { fOnT-fAmIlY: \"Lucida Grande\", \"Arial\", sans-serif; }",
  }, {
    code: "a { FONT-FAMILY: \"Lucida Grande\", \"Arial\", sans-serif; }",
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
  }, {
    code: "a { font-family: 'Lucida Grande', \"Arial\", sans-serif; }",
  }, {
    code: "a { font-family: \"Lucida Grande\", 'Arial', sans-serif; }",
  }, {
    code: "a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: \"Lucida Grande\", \"Arial\", \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
  }, {
    code: "a { fOnT-fAmIlY: \"Lucida Grande\", \"Arial\", \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
  }, {
    code: "a { FONT-FAMILY: \"Lucida Grande\", \"Arial\", \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
  }, {
    code: "a { font-family: \"inherit\"; }",
    message: messages.expected("no", "inherit"),
  }, {
    code: "a { font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
    message: messages.expected("no", "-apple-system"),
  }, {
    code: "a { font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif; }",
    message: messages.expected("no", "BlinkMacSystemFont"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-where-recommended"],

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
    code: "$font-family: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@font-family: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "$default-font-family: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@default-font-family: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "$font-family-variable: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@font-family-variable: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "a { font-family: \"Lucida Grande\", Arial, sans-serif; }",
  }, {
    code: "a { fOnT-fAmIlY: \"Lucida Grande\", Arial, sans-serif; }",
  }, {
    code: "a { FONT-FAMILY: \"Lucida Grande\", Arial, sans-serif; }",
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
  }, {
    code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
  }, {
    code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
  }, {
    code: "a { font-family: Times, 'Times New Roman', serif; }",
  }, {
    code: "a { font-family: 'Something6'; }",
  }, {
    code: "a { font-family: 'snake_case'; }",
  }, {
    code: "a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: Lucida Grande, Arial, sans-serif; }",
    message: messages.expected("", "Lucida Grande"),
    line: 1,
    column: 18,
  }, {
    code: "a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }",
    message: messages.expected("", "Lucida Grande"),
    line: 1,
    column: 18,
  }, {
    code: "a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }",
    message: messages.expected("", "Lucida Grande"),
    line: 1,
    column: 18,
  }, {
    code: "a { font-family: \"Lucida Grande\", Arial, \"sans-serif\"; }",
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 43,
  }, {
    code: "a { font-family: Red/Black, Arial, sans-serif; }",
    message: messages.expected("", "Red/Black"),
  }, {
    code: "a { font-family: Arial, Ahem!, sans-serif; }",
    message: messages.expected("", "Ahem!"),
  }, {
    code: "a { font-family: Hawaii 5-0, Arial, sans-serif; }",
    message: messages.expected("", "Hawaii 5-0"),
  }, {
    code: "a { font-family: Times, Times New Roman, serif; }",
    message: messages.expected("", "Times New Roman"),
  }, {
    code: "a { font-family: Something6; }",
    message: messages.expected("", "Something6"),
  }, {
    code: "a { font-family: snake_case; }",
    message: messages.expected("", "snake_case"),
  }, {
    code: "a { font-family: \"Arial\"; }",
    message: messages.expected("no", "Arial"),
  }, {
    code: "a { font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
    message: messages.expected("no", "-apple-system"),
  }, {
    code: "a { font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', Roboto, sans-serif; }",
    message: messages.expected("no", "BlinkMacSystemFont"),
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-where-required"],

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
    code: "$font-family: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@font-family: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "$default-font-family: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@default-font-family: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "$font-family-variable: map-get($font-stacks, default);",
    description: "ignores scss variable contain font-family in name",
  }, {
    code: "@font-family-variable: map-get($font-stacks, default);",
    description: "ignores less variable contain font-family in name",
  }, {
    code: "a { font-family: Lucida Grande, Arial, sans-serif; }",
  }, {
    code: "a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }",
  }, {
    code: "a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }",
  }, {
    code: "a { font-family: \"Red/Black\", Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, \"Ahem!\", sans-serif; }",
  }, {
    code: "a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }",
  }, {
    code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
  }, {
    code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
  }, {
    code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
  }, {
    code: "a { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }",
  } ],

  reject: [ {
    code: "a { font-family: \"Lucida Grande\", Arial, sans-serif; }",
    message: messages.expected("no", "Lucida Grande"),
    line: 1,
    column: 19,
  }, {
    code: "a { fOnT-fAmIlY: \"Lucida Grande\", Arial, sans-serif; }",
    message: messages.expected("no", "Lucida Grande"),
    line: 1,
    column: 19,
  }, {
    code: "a { FONT-FAMILY: \"Lucida Grande\", Arial, sans-serif; }",
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
    message: messages.expected("", "Red/Black"),
  }, {
    code: "a { font-family: Arial, Ahem!, sans-serif; }",
    message: messages.expected("", "Ahem!"),
  }, {
    code: "a { font-family: Hawaii 5-0, Arial, sans-serif; }",
    message: messages.expected("", "Hawaii 5-0"),
  }, {
    code: "a { font-family: '-apple-system', BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }",
    message: messages.expected("no", "-apple-system"),
  }, {
    code: "a { font-family: -apple-system, 'BlinkMacSystemFont', Segoe UI, Roboto, sans-serif; }",
    message: messages.expected("no", "BlinkMacSystemFont"),
  } ],
})

test("deprecation warning for single-unless-keyword", t => {
  const config = {
    rules: {
      "font-family-name-quotes": "single-unless-keyword",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { font-family: \"inherit\"; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'single-unless-keyword' option for 'font-family-name-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected no quotes around font-family name \"inherit\" (font-family-name-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for single-where-required", t => {
  const config = {
    rules: {
      "font-family-name-quotes": "single-where-required",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { font-family: Hawaii 5-0; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'single-where-required' option for 'font-family-name-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected single quotes around font-family name \"Hawaii 5-0\" (font-family-name-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for single-where-recommended", t => {
  const config = {
    rules: {
      "font-family-name-quotes": "single-where-recommended",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { font-family: Something6; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'single-where-recommended' option for 'font-family-name-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected single quotes around font-family name \"Something6\" (font-family-name-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for double-unless-keyword", t => {
  const config = {
    rules: {
      "font-family-name-quotes": "double-unless-keyword",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { font-family: 'inherit'; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'double-unless-keyword' option for 'font-family-name-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected no quotes around font-family name \"inherit\" (font-family-name-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for double-where-required", t => {
  const config = {
    rules: {
      "font-family-name-quotes": "double-where-required",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { font-family: Hawaii 5-0; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'double-where-required' option for 'font-family-name-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected double quotes around font-family name \"Hawaii 5-0\" (font-family-name-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for double-where-recommended", t => {
  const config = {
    rules: {
      "font-family-name-quotes": "double-where-recommended",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("a { font-family: Something6; }").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'double-where-recommended' option for 'font-family-name-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected double quotes around font-family name \"Something6\" (font-family-name-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
