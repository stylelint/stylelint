---
name: "\U0001F41B Report a bug"
about: "Is something not working as you expect?"
---

<!-- Please answer the following. We close issues that don't. -->

> Clearly describe the bug

e.g. "There are false positives for two leading zeros when ..."

> Which rule, if any, is the bug related to?

e.g. `number-leading-zero`

> What code is needed to reproduce the bug?

e.g.

```css
a {
  width: 00.1em;
}
```

> What stylelint configuration is needed to reproduce the bug?

e.g.

```json
{
  "rules": {
    "number-leading-zero": "always"
  }
}
```

> Which version of stylelint are you using?

e.g. `9.2.0`

> How are you running stylelint: CLI, PostCSS plugin, Node.js API?

e.g. "CLI with `stylelint "**/*.css" --config myconfig.json`"

> Does the bug relate to non-standard syntax (e.g. SCSS, Less etc.)?

e.g. "Yes, it's related to SCSS nested properties."

> What did you expect to happen?

e.g. "No warnings to be flagged."

> What actually happened (e.g. what warnings or errors did you get)?

e.g. "The following warnings were flagged:"

```shell
test.css
2:4    Expected a leading zero (number-leading-zero)
```

<!--
Before posting, please check that the bug hasn't already been:
-  fixed in the next release (https://github.com/stylelint/stylelint/blob/master/CHANGELOG.md)
-  discussed previously (https://github.com/stylelint/stylelint/search)

You can help us fix the bug more quickly by:
1. Figuring out what needs doing and proposing it.
2. Writing the code and submitting a PR once the bug is confirmed.
-->
