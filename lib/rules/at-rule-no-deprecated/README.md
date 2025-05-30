# at-rule-no-deprecated

Disallow deprecated at-rules.

<!-- prettier-ignore -->
```css
    @viewport {}
/** ↑
 * At-rules like this */
```

This rule flags at-rules that were removed or deprecated after being in the CSS specifications, including editor drafts, and were subsequently either:

- shipped in a stable version of a browser
- shipped by a developer channel/edition browser
- shipped but behind experimental flags
- polyfilled with some adoption before any browser actually shipped
- had an MDN page at one point in time

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

Prior art:

- [@csstools/stylelint-no-at-nest-rule](https://www.npmjs.com/package/@csstools/stylelint-no-at-nest-rule)
- [@isnotdefined/no-obsolete](https://www.npmjs.com/package/@isnotdefined/stylelint-plugin)

## Options

### `true`

```json
{
  "at-rule-no-deprecated": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@viewport {}
```

<!-- prettier-ignore -->
```css
a { @apply foo; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@starting-style {}
```

<!-- prettier-ignore -->
```css
a { @layer {} }
```

## Optional secondary options

### `ignoreAtRules`

```json
{ "ignoreAtRules": ["array", "of", "at-rules", "/regex/"] }
```

Given:

```json
{
  "at-rule-no-deprecated": [true, { "ignoreAtRules": ["/^view/", "apply"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@viewport {}
```

<!-- prettier-ignore -->
```css
a { @apply foo; }
```
