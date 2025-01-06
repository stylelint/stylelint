# at-rule-prelude-no-invalid

Disallow invalid preludes for at-rules.

<!-- prettier-ignore -->
```css
@property --foo {}
/**       ↑
 * Preludes like this */
```

This rule considers preludes for at-rules defined within the CSS specifications, up to and including Editor's Drafts, to be valid.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what preludes are valid for an at-rule.

This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

This rule overlaps with:

- [`media-query-no-invalid`](../media-query-no-invalid/README.md)
- [`string-no-newline`](../string-no-newline/README.md)
- [`unit-no-unknown`](../unit-no-unknown/README.md)

You can either turn off the rules or configure them to ignore the overlaps.

Prior art:

- [stylelint-csstree-validator](https://www.npmjs.com/package/stylelint-csstree-validator)

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@property foo {}
```

<!-- prettier-ignore -->
```css
@font-palette-values foo {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@property --foo {}
```

<!-- prettier-ignore -->
```css
@font-palette-values --foo {}
```

## Secondary Options

### `ignoreAtRules: ["/regex/", /regex/, "string"]`

Given:

```json
["property", "/^font-/"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@property foo;
```

<!-- prettier-ignore -->
```css
@font-palette-values foo {}
```
