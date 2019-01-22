# media-feature-name-blacklist

Specify a blacklist of disallowed media feature names.

```css
@media (min-width: 700px) {}
/**     ↑
 * These media feature names */
```

**Caveat:** Media feature names within a range context are currently ignored.

## 选项

`array|string|regex`: `["array", "of", "unprefixed", /media-features/ or "regex"]|"media-feature"|/regex/`

给定：

```js
["max-width", "/^my-/"]
```

以下模式被视为违规：

```css
@media (max-width: 50em) {}
```

```css
@media (my-width: 50em) {}
```

以下模式*不*被视为违规：

```css
@media (min-width: 50em) {}
```

```css
@media print and (min-resolution: 300dpi) {}
```
