# selector-pseudo-class-parentheses-space-inside

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors.

<!-- prettier-ignore -->
```css
input:not( [type="submit"] ) {}
/**      ↑                 ↑
 * The space inside these two parentheses */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix most of the problems reported by this rule. It won't fix pseudo elements containing comments.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space inside the parentheses.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
input:not([type="submit"]) {}
```

<!-- prettier-ignore -->
```css
input:not([type="submit"] ) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
input:not( [type="submit"] ) {}
```

### `"never"`

There _must never_ be whitespace on the inside the parentheses.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
input:not( [type="submit"] ) {}
```

<!-- prettier-ignore -->
```css
input:not( [type="submit"]) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
input:not([type="submit"]) {}
```
