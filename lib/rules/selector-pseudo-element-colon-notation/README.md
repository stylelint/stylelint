# selector-pseudo-element-colon-notation

Specify single or double colon notation for applicable pseudo-element selectors.

<!-- prettier-ignore -->
```css
    a::before {}
/**  ↑
 * This notation */
```

You can use this rule to enforce a convention. Pseudo-elements use [two colons](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements#syntax) to tell them apart from pseudo-classes, but browsers also accept one colon for the four from CSS 2: `:before`, `:after`, `:first-line` and `:first-letter`.

Use:

- `"double"` for clarity
- `"single"` for older browsers, which don't recognize `::`

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the configured notation.

## Options

### `"single"`

Applicable pseudo-elements _must always_ use the single colon notation.

```json
{
  "selector-pseudo-element-colon-notation": "single"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a::before { color: pink; }
```

<!-- prettier-ignore -->
```css
a::after { color: pink; }
```

<!-- prettier-ignore -->
```css
a::first-letter { color: pink; }
```

<!-- prettier-ignore -->
```css
a::first-line { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:before { color: pink; }
```

<!-- prettier-ignore -->
```css
a:after { color: pink; }
```

<!-- prettier-ignore -->
```css
a:first-letter { color: pink; }
```

<!-- prettier-ignore -->
```css
a:first-line { color: pink; }
```

<!-- prettier-ignore -->
```css
input::placeholder { color: pink; }
```

<!-- prettier-ignore -->
```css
li::marker { font-variant-numeric: tabular-nums; }
```

### `"double"`

Applicable pseudo-elements _must always_ use the double colon notation.

```json
{
  "selector-pseudo-element-colon-notation": "double"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:before { color: pink; }
```

<!-- prettier-ignore -->
```css
a:after { color: pink; }
```

<!-- prettier-ignore -->
```css
a:first-letter { color: pink; }
```

<!-- prettier-ignore -->
```css
a:first-line { color: pink; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a::before { color: pink; }
```

<!-- prettier-ignore -->
```css
a::after { color: pink; }
```

<!-- prettier-ignore -->
```css
a::first-letter { color: pink; }
```

<!-- prettier-ignore -->
```css
a::first-line { color: pink; }
```

<!-- prettier-ignore -->
```css
input::placeholder { color: pink; }
```

<!-- prettier-ignore -->
```css
li::marker { font-variant-numeric: tabular-nums; }
```
