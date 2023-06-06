# selector-nested-pattern

Specify a pattern for the selectors of rules nested within rules.

<!-- prettier-ignore -->
```css
    a {
      color: orange;
      &:hover { color: pink; }
    } ↑
/**   ↑
 * This nested selector */
```

Non-standard selectors (e.g. selectors with Sass or Less interpolation) and selectors of rules nested within at-rules are ignored.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`regex|string`

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

The selector value will be checked in its entirety. If you'd like to allow for combinators and commas, you must incorporate them into your pattern.

Given the string:

```json
"^&:(?:hover|focus)$"
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

### `splitList: true | false` (default: `false`)

Split selector lists into individual selectors.

For example, with `true`.

Given the string:

```json
"^&:(?:hover|focus)$"
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
