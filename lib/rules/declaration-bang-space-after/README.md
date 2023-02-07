# declaration-bang-space-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace after the bang of declarations.

<!-- prettier-ignore -->
```css
a { color: pink !important; }
/**             ↑
 * The space after this exclamation mark */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space after the bang.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink !important; }
```

<!-- prettier-ignore -->
```css
a { color: pink      !important; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink ! important; }
```

<!-- prettier-ignore -->
```css
a { color: pink! important; }
```

### `"never"`

There _must never_ be whitespace after the bang.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink ! important; }
```

<!-- prettier-ignore -->
```css
a { color: pink! important; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink !important; }
```

<!-- prettier-ignore -->
```css
a { color:pink!important; }
```
