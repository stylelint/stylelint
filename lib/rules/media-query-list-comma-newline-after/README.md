# media-query-list-comma-newline-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a newline or disallow whitespace after the commas of media query lists.

<!-- prettier-ignore -->
```css
@media screen and (color),
  projection {}       /* ↑ */
/**                      ↑
 *            These commas */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"always-multi-line"|"never-multi-line"`

### `"always"`

There _must always_ be a newline after the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color), projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
, projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color),
projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,
projection and (color) {}
```

### `"always-multi-line"`

There _must always_ be a newline after the commas in multi-line media query lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color)
, projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color), projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color),
projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,
projection and (color) {}
```

### `"never-multi-line"`

There _must never_ be whitespace after the commas in multi-line media query lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color),
projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,
projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color), projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,projection and (color) {}
```
