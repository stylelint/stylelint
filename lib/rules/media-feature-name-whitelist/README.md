# media-feature-name-whitelist

Specify a whitelist of allowed media feature names.

```css
@media (min-width: 700px) {}
/**     ↑
 * These media feature names */
```

This rule ignores media feature names within a range context.

## 选项

`array|string|regex`: `["array", "of", "unprefixed", /media-features/ or "regex"]|"media-feature"|/regex/`

给定：

```js
["max-width", "/^my-/"]
```

以下模式被视为违规：

```css
@media (min-width: 50em) {}
```

```css
@media print and (min-resolution: 300dpi) {}
```

以下模式*不*被视为违规：

```css
@media (max-width: 50em) {}
```

```css
@media (my-width: 50em) {}
```
