# number-leading-zero

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require or disallow a leading zero for fractional numbers less than 1.

<!-- prettier-ignore -->
```css
a { line-height: 0.5; }
/**              ↑
 * This leading zero */
```

This rule ignores mixin parameters in Less.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a leading zero.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { line-height: .5; }
```

<!-- prettier-ignore -->
```css
a { transform: translate(2px, .4px); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { line-height: 0.5; }
```

<!-- prettier-ignore -->
```css
a { transform: translate(2px, 0.4px); }
```

### `"never"`

There _must never_ be a leading zero.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { line-height: 0.5; }
```

<!-- prettier-ignore -->
```css
a { transform: translate(2px, 0.4px); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { line-height: .5; }
```

<!-- prettier-ignore -->
```css
a { transform: translate(2px, .4px); }
```
