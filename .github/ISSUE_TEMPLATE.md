<!-- Please answer the following questions. Issues that don't use this template will be closed. -->

> Describe the issue. Is it a bug or a feature request (new rule, new option, etc.)?

e.g. "A bug where..."

> Which rule, if any, is this issue related to?

e.g. `number-leading-zero`

> What CSS is needed to reproduce this issue?

e.g.

```css
.foo {
  color: pink;
}
```

> What stylelint configuration is needed to reproduce this issue?

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

> Which version of stylelint are you using?

e.g. `6.7.1`

> How are you running stylelint: CLI, PostCSS plugin, Node API?

e.g. "CLI with `stylelint --config myconfig *.css`"

> Does your issue relate to non-standard syntax (e.g. SCSS, nesting, etc.)?

e.g. "Yes, it's related to SCSS maps."

> What did you expect to happen?

e.g. "No warnings to be flagged."

> What actually happened (e.g. what warnings or errors you are getting)?

e.g. "The following warnings were flagged:"

```shell
test.css
1:21    Expected 2 spaces (indentation)
```

<!--
Here are the best ways to help resolve your issue:
1. Figure out what needs to be done, propose it, and then write the code and submit a PR.
2. If your issue is a bug, consider at least submitting a PR with failing tests.
3. Check the [V8 changelog](https://github.com/stylelint/stylelint/blob/v8/CHANGELOG.md) as the bug may have been already resolved.

Note: GitHub issues are for stylelint bugs and enhancements, if you're looking for help or support with stylelint then stackoverflow is our preferred question and answer forum - http://stackoverflow.com/questions/tagged/stylelint
-->
