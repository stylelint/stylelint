# selector-combinator-whitelist

Specify a whitelist of allowed combinators.

```css
  a + b {}
/** ↑
 * These combinators */
```

This rule normalizes the whitespace descendant combinator to be a single space.

This rule ignores [reference combinators](https://www.w3.org/TR/selectors4/#idref-combinators) e.g. `/for/`.

## 选项

`array|string`: `["array", "of", "combinators"]|"combinator"`

给定：

```js
[">", " "]
```

以下模式被视为违规：

```css
a + b {}
```

```css
a ~ b {}
```

以下模式*不*被视为违规：

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
