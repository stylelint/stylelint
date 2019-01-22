# media-feature-name-no-unknown

Disallow unknown media feature names.

```css
@media (min-width: 700px) {}
/**     ↑
 * These media feature names */
```

This rule considers media feature names defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule ignores:

-   media feature names within a range context
-   vendor-prefixed media feature names

## 选项

### `true`

以下模式被视为违规：

```css
@media screen and (unknown) {}
```

```css
@media screen and (unknown: 10px) {}
```

以下模式*不*被视为违规：

```css
@media all and (monochrome) {}
```

```css
@media (min-width: 700px) {}
```

```css
@media (MIN-WIDTH: 700px) {}
```

```css
@media (min-width: 700px) and (orientation: landscape) {}
```

```css
@media (-webkit-min-device-pixel-ratio: 2) {}
```

## 可选的辅助选项

### `ignoreMediaFeatureNames: ["/regex/", /regex/, "string"]`

给定：

```js
["/^my-/", "custom"]
```

以下模式*不*被视为违规：

```css
@media screen and (my-media-feature-name) {}
```

```css
@media screen and (custom: 10px) {}
```

```css
@media (min-width: 700px) and (custom: 10px) {}
```
