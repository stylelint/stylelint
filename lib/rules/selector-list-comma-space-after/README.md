# selector-list-comma-space-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace after the commas of selector lists.

<!-- prettier-ignore -->
```css
   a, b { color: pink; }
/** ↑
 * The space after this comma */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"|"always-single-line"|"never-single-line"`

### `"always"`

There _must always_ be a single space after the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a,b { color: pink; }
```

<!-- prettier-ignore -->
```css
a ,b { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a, b { color: pink; }
```

<!-- prettier-ignore -->
```css
a , b { color: pink; }
```

### `"never"`

There _must never_ be whitespace after the commas.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a, b { color: pink; }
```

<!-- prettier-ignore -->
```css
a , b { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a,b { color: pink; }
```

<!-- prettier-ignore -->
```css
a ,b { color: pink; }
```

### `"always-single-line"`

There _must always_ be a single space after the commas in single-line selector lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a,b { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a
,b { color: pink; }
```

### `"never-single-line"`

There _must never_ be a single space after the commas in single-line selector lists.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a, b { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a
, b { color: pink; }
```
