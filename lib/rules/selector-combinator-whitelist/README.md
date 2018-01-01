# selector-combinator-whitelist

Specify a whitelist of allowed combinators.

```css
  a + b {}
/** ↑
 * These combinators */
```

This rule ignores [reference combinators](https://www.w3.org/TR/selectors4/#idref-combinators) e.g. `/for/`.

## Options

`array|string|regex`: `["array", "of", "unprefixed", "combinators" or "regex"]|"combinator"|/regex/`

Given:

```js
[">", /\s+/]
```

The following patterns are considered violations:

```css
a + b {}
```

```css
a ~ b {}
```

The following patterns are *not* considered violations:

```css
a > b {}
```

```css
a b {}
```

```css
a
b {}
```
