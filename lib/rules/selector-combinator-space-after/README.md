# selector-combinator-space-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace after the combinators of selectors.

<!-- prettier-ignore -->
```css
  a > b + c ~ d e >>> f { color: pink; }
/** ↑   ↑   ↑  ↑  ↑
 * These are combinators */
```

Combinators are used to combine several different selectors into new and more specific ones. There are several types of combinators, including: child (`>`), adjacent sibling (`+`), general sibling (`~`), and descendant (which is represented by a blank space between two selectors).

The descendant combinator is _not_ checked by this rule.

Also, `+` and `-` signs within `:nth-*()` arguments are not checked (e.g. `a:nth-child(2n+1)`).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space after the combinators.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a +b { color: pink; }
```

<!-- prettier-ignore -->
```css
a>b { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a + b { color: pink; }
```

<!-- prettier-ignore -->
```css
a> b { color: pink; }
```

### `"never"`

There _must never_ be whitespace after the combinators.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a + b { color: pink; }
```

<!-- prettier-ignore -->
```css
a> b { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a +b { color: pink; }
```

<!-- prettier-ignore -->
```css
a>b { color: pink; }
```
