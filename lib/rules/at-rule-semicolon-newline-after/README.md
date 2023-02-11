# at-rule-semicolon-newline-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a newline after the semicolon of at-rules.

<!-- prettier-ignore -->
```css
@import url("x.css");
@import url("y.css");
/**                 ↑
 * The newline after these semicolons */
```

This rule allows an end-of-line comment followed by a newline. For example:

<!-- prettier-ignore -->
```css
@import url("x.css"); /* end-of-line comment */

a {}
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"`

### `"always"`

There _must always_ be a newline after the semicolon.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import url("x.css"); @import url("y.css");
```

<!-- prettier-ignore -->
```css
@import url("x.css"); a {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import url("x.css");
@import url("y.css");
```

<!-- prettier-ignore -->
```css
@import url("x.css"); /* end-of-line comment */
a {}
```

<!-- prettier-ignore -->
```css
@import url("x.css");

a {}
```
