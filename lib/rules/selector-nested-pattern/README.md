# selector-nested-pattern

Specify a pattern for the selectors of rules nested within rules.

<!-- prettier-ignore -->
```css
    a {
      color: orange;
      &:hover { color: pink; } }
/**   ↑
 * This nested selector */
```

Non-standard selectors (e.g. selectors with Sass or Less interpolation) and selectors of rules nested within at-rules are ignored.

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

The selector value will be checked in its entirety. If you'd like to allow for combinators and commas, you must incorporate them into your pattern.

Given:

```json
{
  "selector-nested-pattern": "^&:(?:hover|focus)$"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  .bar {}
}
```

<!-- prettier-ignore -->
```css
a {
  .bar:hover {}
}
```

<!-- prettier-ignore -->
```css
a {
  &:hover,
  &:focus {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  &:hover {}
}
```

<!-- prettier-ignore -->
```css
a {
  &:focus {}
}
```

<!-- prettier-ignore -->
```css
a {
  &:hover {}
  &:focus {}
}
```

## Optional secondary options

### `splitList`

Split selector lists into individual selectors. Defaults to `false`.

Given:

```json
{
  "selector-nested-pattern": ["^&:(?:hover|focus)$", { "splitList": true }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  .bar:hover,
  &:focus {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  &:hover,
  &:focus {}
}
```
