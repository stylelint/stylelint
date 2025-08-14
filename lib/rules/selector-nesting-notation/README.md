# selector-nesting-notation

Enforce consistent usage of nesting selectors.

<!-- prettier-ignore -->
```css
a { & > b {} }
/** ↑
 * This nesting selector */
```

This rule enforces consistent usage of explicit nesting selectors (`&`) in CSS nesting.

CSS nesting allows you to nest selectors inside other selectors. When using combinators (like `>`, `+`, `~`) at the beginning of a nested selector, you can either use an explicit nesting selector (`&`) or rely on implicit nesting behavior.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

## Options

`string`: `"explicit"` | `"implicit"`

### `"explicit"`

```json
{
  "selector-nesting-notation": "explicit"
}
```

Require explicit nesting selector (`&`) when using combinators.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  > b {}
}
```

<!-- prettier-ignore -->
```css
a {
  + b {}
}
```

<!-- prettier-ignore -->
```css
a {
  ~ b {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  & > b {}
}
```

<!-- prettier-ignore -->
```css
a {
  & + b {}
}
```

<!-- prettier-ignore -->
```css
a {
  & ~ b {}
}
```

### `"implicit"`

```json
{
  "selector-nesting-notation": "implicit"
}
```

Disallow explicit nesting selector (`&`) when it's not necessary.

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

<!-- prettier-ignore -->
```css
a {
  & + b {}
}
```

<!-- prettier-ignore -->
```css
a {
  & ~ b {}
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
  + b {}
}
```

<!-- prettier-ignore -->
```css
a {
  ~ b {}
}
```
