# relative-selector-nesting-notation

Specify explicit or implicit nesting notation for relative selectors.

<!-- prettier-ignore -->
```css
a { & > b {} }
/** ↑
 * This notation */
```

When a relative selector starts with a combinator (like ` `, `>`, `+`, `~`), you can either use an explicit nesting selector (`&`) or rely on implicit nesting behavior. Implicit notation is more concise, but explicit notation can be more readable.

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
