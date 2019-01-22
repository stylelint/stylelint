# selector-pseudo-element-whitelist

Specify a whitelist of allowed pseudo-element selectors.

```css
 a::before {}
/** ↑
 * These pseudo-element selectors */
```

This rule ignores:

-   CSS2 pseudo-elements i.e. those prefixed with a single colon
-   selectors that use variable interpolation e.g. `::#{$variable} {}`

## 选项

`array|string|regex`: `["array", "of", "unprefixed", "pseudo-elements" or "regex"]|"pseudo-element"|/regex/`

给定：

```js
["before", "/^my-/i"]
```

以下模式被视为违规：

```css
a::after {}
```

```css
a::not-my-pseudo-element {}
```

以下模式*不*被视为违规：

```css
a::before {}
```

```css
a::my-pseudo-element {}
```

```css
a::MY-OTHER-pseudo-element {}
```
