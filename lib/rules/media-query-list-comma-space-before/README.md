# media-query-list-comma-space-before

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace before the commas of media query lists.

<!-- prettier-ignore -->
```css
@media screen and (color) ,projection and (color) {}
/**                       ↑
 * The space before this comma */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There _must always_ be a single space before the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color),projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color) ,projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color) ,
projection and (color) {}
```

### `"never"`

There _must never_ be whitespace before the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color) ,projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
, projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color),projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color),
projection and (color) {}
```

### `"always-single-line"`

There _must always_ be a single space before the commas in single-line media query lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color),projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color) ,projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
, projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,projection and (color) {}
```

### `"never-single-line"`

There _must never_ be whitespace before the commas in single-line media query lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color) , projection and (color) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media screen and (color),projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
,projection and (color) {}
```

<!-- prettier-ignore -->
```css
@media screen and (color)
, projection and (color) {}
```
