import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("single-where-required", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-family: $sassy-font-family; }", "ignores sass variables")
  tr.ok("a { font-family: @less-666; }", "ignores less variables")
  tr.ok("a { font-family: var(--ff1); }", "ignores custom properties")

  tr.ok("a { font-family: Lucida Grande, Arial, sans-serif; }")
  tr.ok("a { font-family: 'Red/Black', Arial, sans-serif; }")
  tr.ok("a { font-family: Arial, 'Ahem!', sans-serif; }")
  tr.ok("a { font-family: 'Hawaii 5-0', Arial, sans-serif; }")

  tr.notOk("a { font-family: 'Lucida Grande', Arial, sans-serif; }", {
    message: messages.expected("no", "Lucida Grande"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { font-family: Lucida Grande, Arial, 'sans-serif'; }", {
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 41,
  })
  tr.notOk("a { font-family: Red/Black, Arial, sans-serif; }", messages.expected("single", "Red/Black"))
  tr.notOk("a { font-family: \"Red/Black\", Arial, sans-serif; }", messages.expected("single", "Red/Black"))
  tr.notOk("a { font-family: Arial, Ahem!, sans-serif; }", messages.expected("single", "Ahem!"))
  tr.notOk("a { font-family: Arial, \"Ahem!\", sans-serif; }", messages.expected("single", "Ahem!"))
  tr.notOk("a { font-family: Hawaii 5-0, Arial, sans-serif; }", messages.expected("single", "Hawaii 5-0"))
  tr.notOk("a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }", messages.expected("single", "Hawaii 5-0"))
})

testRule("double-where-required", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-family: $sassy-font-family; }", "ignores sass variables")
  tr.ok("a { font-family: @less-666; }", "ignores less variables")
  tr.ok("a { font-family: var(--ff1); }", "ignores custom properties")

  tr.ok("a { font-family: Lucida Grande, Arial, sans-serif; }")
  tr.ok("a { font-family: \"Red/Black\", Arial, sans-serif; }")
  tr.ok("a { font-family: Arial, \"Ahem!\", sans-serif; }")
  tr.ok("a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }")

  tr.notOk("a { font-family: \"Lucida Grande\", Arial, sans-serif; }", {
    message: messages.expected("no", "Lucida Grande"),
    line: 1,
    column: 19,
  })
  tr.notOk("a { font-family: Lucida Grande, Arial, \"sans-serif\"; }", {
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 41,
  })
  tr.notOk("a { font-family: Red/Black, Arial, sans-serif; }", messages.expected("double", "Red/Black"))
  tr.notOk("a { font-family: 'Red/Black', Arial, sans-serif; }", messages.expected("double", "Red/Black"))
  tr.notOk("a { font-family: Arial, Ahem!, sans-serif; }", messages.expected("double", "Ahem!"))
  tr.notOk("a { font-family: Arial, 'Ahem!', sans-serif; }", messages.expected("double", "Ahem!"))
  tr.notOk("a { font-family: Hawaii 5-0, Arial, sans-serif; }", messages.expected("double", "Hawaii 5-0"))
  tr.notOk("a { font-family: 'Hawaii 5-0', Arial, sans-serif; }", messages.expected("double", "Hawaii 5-0"))
})

testRule("single-where-recommended", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-family: $sassy-font-family; }", "ignores sass variables")
  tr.ok("a { font-family: @less-666; }", "ignores less variables")
  tr.ok("a { font-family: var(--ff1); }", "ignores custom properties")

  tr.ok("a { font-family: 'Lucida Grande', Arial, sans-serif; }")
  tr.ok("a { font-family: Times, 'Times New Roman', serif; }")
  tr.ok("a { font-family: 'Something6'; }")
  tr.ok("a { font-family: 'snake_case'; }")
  tr.ok("a { font-family: 'Red/Black', Arial, sans-serif; }")
  tr.ok("a { font-family: Arial, 'Ahem!', sans-serif; }")
  tr.ok("a { font-family: 'Hawaii 5-0', Arial, sans-serif; }")

  tr.notOk("a { font-family: Lucida Grande, Arial, sans-serif; }", {
    message: messages.expected("single", "Lucida Grande"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { font-family: 'Lucida Grande', Arial, 'sans-serif'; }", {
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 43,
  })
  tr.notOk("a { font-family: Red/Black, Arial, sans-serif; }", messages.expected("single", "Red/Black"))
  tr.notOk("a { font-family: \"Red/Black\", Arial, sans-serif; }", messages.expected("single", "Red/Black"))
  tr.notOk("a { font-family: Arial, Ahem!, sans-serif; }", messages.expected("single", "Ahem!"))
  tr.notOk("a { font-family: Arial, \"Ahem!\", sans-serif; }", messages.expected("single", "Ahem!"))
  tr.notOk("a { font-family: Hawaii 5-0, Arial, sans-serif; }", messages.expected("single", "Hawaii 5-0"))
  tr.notOk("a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }", messages.expected("single", "Hawaii 5-0"))
  tr.notOk("a { font-family: Times, Times New Roman, serif; }", messages.expected("single", "Times New Roman"))
  tr.notOk("a { font-family: Times, \"Times New Roman\", serif; }", messages.expected("single", "Times New Roman"))
  tr.notOk("a { font-family: Something6; }", messages.expected("single", "Something6"))
  tr.notOk("a { font-family: \"Something6\"; }", messages.expected("single", "Something6"))
  tr.notOk("a { font-family: snake_case; }", messages.expected("single", "snake_case"))
  tr.notOk("a { font-family: \"snake_case\"; }", messages.expected("single", "snake_case"))
})

testRule("double-where-recommended", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-family: $sassy-font-family; }", "ignores sass variables")
  tr.ok("a { font-family: @less-666; }", "ignores less variables")
  tr.ok("a { font-family: var(--ff1); }", "ignores custom properties")

  tr.ok("a { font-family: \"Lucida Grande\", Arial, sans-serif; }")
  tr.ok("a { font-family: Times, \"Times New Roman\", serif; }")
  tr.ok("a { font-family: \"Something6\"; }")
  tr.ok("a { font-family: \"snake_case\"; }")
  tr.ok("a { font-family: \"Red/Black\", Arial, sans-serif; }")
  tr.ok("a { font-family: Arial, \"Ahem!\", sans-serif; }")
  tr.ok("a { font-family: \"Hawaii 5-0\", Arial, sans-serif; }")

  tr.notOk("a { font-family: Lucida Grande, Arial, sans-serif; }", {
    message: messages.expected("double", "Lucida Grande"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { font-family: \"Lucida Grande\", Arial, \"sans-serif\"; }", {
    message: messages.expected("no", "sans-serif"),
    line: 1,
    column: 43,
  })
  tr.notOk("a { font-family: Red/Black, Arial, sans-serif; }", messages.expected("double", "Red/Black"))
  tr.notOk("a { font-family: 'Red/Black', Arial, sans-serif; }", messages.expected("double", "Red/Black"))
  tr.notOk("a { font-family: Arial, Ahem!, sans-serif; }", messages.expected("double", "Ahem!"))
  tr.notOk("a { font-family: Arial, 'Ahem!', sans-serif; }", messages.expected("double", "Ahem!"))
  tr.notOk("a { font-family: Hawaii 5-0, Arial, sans-serif; }", messages.expected("double", "Hawaii 5-0"))
  tr.notOk("a { font-family: 'Hawaii 5-0', Arial, sans-serif; }", messages.expected("double", "Hawaii 5-0"))
  tr.notOk("a { font-family: Times, Times New Roman, serif; }", messages.expected("double", "Times New Roman"))
  tr.notOk("a { font-family: Times, 'Times New Roman', serif; }", messages.expected("double", "Times New Roman"))
  tr.notOk("a { font-family: Something6; }", messages.expected("double", "Something6"))
  tr.notOk("a { font-family: 'Something6'; }", messages.expected("double", "Something6"))
  tr.notOk("a { font-family: snake_case; }", messages.expected("double", "snake_case"))
  tr.notOk("a { font-family: 'snake_case'; }", messages.expected("double", "snake_case"))
})

testRule("single-unless-keyword", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-family: $sassy-font-family; }", "ignores sass variables")
  tr.ok("a { font-family: @less-666; }", "ignores less variables")
  tr.ok("a { font-family: var(--ff1); }", "ignores custom properties")

  tr.ok("a { font-family: 'Lucida Grande', 'Arial', sans-serif; }")
  tr.ok("a { font-family: 'Hawaii 5-0', 'Arial', cursive; }")
  tr.ok("a { font-family: 'Times', 'Arial', serif; }")
  tr.ok("a { font-family: 'Times', 'Arial', fantasy; }")
  tr.ok("a { font-family: 'Times', 'Arial', cursive; }")
  tr.ok("a { font-family: inherit; }")

  tr.notOk("a { font-family: 'Lucida Grande', 'Arial', 'sans-serif'; }", messages.expected("no", "sans-serif"))
  tr.notOk("a { font-family: 'inherit'; }", messages.expected("no", "inherit"))
  tr.notOk("a { font-family: \"Lucida Grande\", 'Arial', sans-serif; }", messages.expected("single", "Lucida Grande"))
  tr.notOk("a { font-family: 'Lucida Grande', \"Arial\", sans-serif; }", messages.expected("single", "Arial"))
})

testRule("double-unless-keyword", tr => {
  warningFreeBasics(tr)

  tr.ok("a { font-family: $sassy-font-family; }", "ignores sass variables")
  tr.ok("a { font-family: @less-666; }", "ignores less variables")
  tr.ok("a { font-family: var(--ff1); }", "ignores custom properties")

  tr.ok("a { font-family: \"Lucida Grande\", \"Arial\", sans-serif; }")
  tr.ok("a { font-family: \"Hawaii 5-0\", \"Arial\", cursive; }")
  tr.ok("a { font-family: \"Times\", \"Arial\", serif; }")
  tr.ok("a { font-family: \"Times\", \"Arial\", fantasy; }")
  tr.ok("a { font-family: \"Times\", \"Arial\", cursive; }")
  tr.ok("a { font-family: inherit; }")

  tr.notOk("a { font-family: \"Lucida Grande\", \"Arial\", \"sans-serif\"; }", messages.expected("no", "sans-serif"))
  tr.notOk("a { font-family: \"inherit\"; }", messages.expected("no", "inherit"))
  tr.notOk("a { font-family: 'Lucida Grande', \"Arial\", sans-serif; }", messages.expected("double", "Lucida Grande"))
  tr.notOk("a { font-family: \"Lucida Grande\", 'Arial', sans-serif; }", messages.expected("double", "Arial"))
})
