# selector-nesting-notation

Specify explicit or implicit notation for nesting selectors.

<!-- prettier-ignore -->
```css
a { & > b {} }
/** ↑
 * This notation */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"explicit"`

Relative selectors _must always_ use explicit nesting selector notation.

```json
{
  "selector-nesting-notation": "explicit"
}
```

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

<!-- prettier-ignore -->
```css
a {
  b {}
}
```

<!-- prettier-ignore -->
```css
a {
  &:hover {}
}
```

### `"implicit"`

Relative selectors _must always_ use implicit nesting selector notation.

```json
{
  "selector-nesting-notation": "implicit"
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

<!-- prettier-ignore -->
```css
a {
  &:hover {}
}
```

<!-- prettier-ignore -->
```css
a {
  &.class {}
}
```
