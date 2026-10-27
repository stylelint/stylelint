# relative-selector-nesting-notation

Specify explicit or implicit nesting notation for relative selectors.

<!-- prettier-ignore -->
```css
a { & > b {} }
/** ↑
 * This notation */
```

You can use this rule to enforce a convention. A nested selector that starts with a combinator, e.g. `> b`, is [relative to the parent selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Nesting_selector) whether or not it begins with `&`.

Use:

- `"explicit"` for clarity
- `"implicit"` for brevity

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the configured notation.

## Options

### `"explicit"`

Relative selectors _must always_ use explicit nesting selector notation.

```json
{
  "relative-selector-nesting-notation": "explicit"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  b {}
}
```

<!-- prettier-ignore -->
```css
a {
  > b {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  & b {}
}
```

<!-- prettier-ignore -->
```css
a {
  & > b {}
}
```

### `"implicit"`

Relative selectors _must always_ use implicit nesting selector notation.

```json
{
  "relative-selector-nesting-notation": "implicit"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  & b {}
}
```

<!-- prettier-ignore -->
```css
a {
  & > b {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  b {}
}
```

<!-- prettier-ignore -->
```css
a {
  > b {}
}
```

<!-- prettier-ignore -->
```css
a {
  &:hover {}
}
```
