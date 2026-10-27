# display-notation

Specify short or full notation for the `display` property.

<!-- prettier-ignore -->
```css
a { display: block; }
/**          ↑
 *           This notation */
```

You can use this rule to enforce a convention. The `display` property accepts a [multi-keyword syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Multi-keyword_syntax) that names the [outer and inner display types](https://drafts.csswg.org/css-display-3/#the-display-properties) separately, e.g. `inline flex`. Each single keyword maps to [such a pair](https://drafts.csswg.org/css-display-3/#display-value-summary), e.g. `inline-flex` to `inline flex` and `block` to `block flow`.

Use:

- `"full"` to compose values from their outer and inner display types, which makes it easier to understand how an element will behave
- `"short"` for brevity and older browsers, which accept only the single-keyword syntax

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the display value and its expected notation.

## Options

### `"full"`

Applicable display values _must always_ use the full notation.

```json
{
  "display-notation": "full"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { display: block; }
```

<!-- prettier-ignore -->
```css
a { display: grid; }
```

<!-- prettier-ignore -->
```css
a { display: list-item; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { display: block flow; }
```

<!-- prettier-ignore -->
```css
a { display: block grid; }
```

<!-- prettier-ignore -->
```css
a { display: block flow list-item; }
```

### `"short"`

Applicable display values _must always_ use the short notation.

```json
{
  "display-notation": "short"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { display: block flow; }
```

<!-- prettier-ignore -->
```css
a { display: block grid; }
```

<!-- prettier-ignore -->
```css
a { display: block flow list-item; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { display: block; }
```

<!-- prettier-ignore -->
```css
a { display: grid; }
```

<!-- prettier-ignore -->
```css
a { display: list-item; }
```
