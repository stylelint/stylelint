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

e.g. `4.3.2`

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

<!--- Note: stackoverflow is our preferred QA forum - http://stackoverflow.com/questions/tagged/stylelint -->

<!--- Tip: If you can submit a pull request that includes a failing test this would be really helpful -->
