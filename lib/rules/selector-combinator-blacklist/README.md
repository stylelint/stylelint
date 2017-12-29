# selector-combinator-blacklist

Specify a blacklist of disallowed combinators.

```css
  a + b {}
/** ↑
 * These combinators */
```

This rule ignores [reference combinators](https://www.w3.org/TR/selectors4/#idref-combinators) e.g. `/for/`.

## Options

`array|string|regex`: `["array", "of", "unprefixed", "pseudo-elements" or "regex"]|"pseudo-element"|/regex/`

Given:

```js
[" ", "/^>/"]
```

The following patterns are considered violations:

```css
a b {}
```

```css
a > b {}
```

```css
a >>> b {}
```

The following patterns are *not* considered violations:

```css
a
b {}
```

```css
a ~ b {}
```

```css
a + b {}
```
