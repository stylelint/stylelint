# at-rule-name-space-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space after at-rule names.

<!-- prettier-ignore -->
```css
@media (max-width: 600px) {}
/**   ↑
 * The space after at-rule names */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"always-single-line"`

### `"always"`

There _must always_ be a single space after at-rule names.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@charset"UTF-8";
```

<!-- prettier-ignore -->
```css
@media(min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media  (min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media
(min-width: 700px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@charset "UTF-8";
```

<!-- prettier-ignore -->
```css
@import url("x.css");
```

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
```

### `"always-single-line"`

There _must always_ be a single space after at-rule names in single-line declaration blocks.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@charset"UTF-8";
```

<!-- prettier-ignore -->
```css
@media(min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media  (min-width: 700px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@charset "UTF-8";
```

<!-- prettier-ignore -->
```css
@import url("x.css");
```

<!-- prettier-ignore -->
```css
@media (min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media
(min-width: 700px) {}
```

<!-- prettier-ignore -->
```css
@media(min-width: 700px) and
  (orientation: portrait) {}
```

<!-- prettier-ignore -->
```css
@media
  (min-width: 700px) and
  (orientation: portrait) {}
```
