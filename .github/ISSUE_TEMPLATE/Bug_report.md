---
name: "\U0001F41B Bug report"
about: Is something not working as expected?

---

<!-- Please answer the following questions. 
Issues that don't use this template will be closed. -->

**Describe the bug? (A clear and concise description of what the bug is)**

e.g. "A bug where..."

**Which rule, if any, is this issue related to?**

e.g. `number-leading-zero`

**What CSS is needed to reproduce this issue?**

e.g.
```css
.foo {
  color: pink;
}
```

**What stylelint configuration is needed to reproduce this issue?**

e.g.

```json
{
  "rules": {
    "indentation": ["tab", {
      "except": ["value"]
    }]
  }
}
```

**Which version of stylelint are you using?**

e.g. `9.2.0`

**How are you running stylelint: CLI, PostCSS plugin, Node API?**

e.g. "CLI with `stylelint --config myconfig *.css`"

**Does your issue relate to non-standard syntax (e.g. SCSS, nesting, etc.)?**

e.g. "Yes, it's related to SCSS maps."

**What did you expect to happen?**

e.g. "No warnings to be flagged."

**What actually happened (e.g. what warnings or errors you are getting)?**

e.g. "The following warnings were flagged:"

```shell
test.css
1:21    Expected 2 spaces (indentation)
```

<!--
Before posting, please check that your issue:
1. Hasn't already been resolved in:
  - the next release (https://github.com/stylelint/stylelint/blob/master/CHANGELOG.md)
  - an upcoming major milestone (https://github.com/stylelint/stylelint/milestones)
2. Hasn't already been discussed (https://github.com/stylelint/stylelint/search)
-->

<!--
Here are the best ways to help resolve your issue:
1. Figure out what needs to be done, propose it, and then write the code and submit a PR.
2. If your issue is a bug, consider at least submitting a PR with failing tests.
-->
