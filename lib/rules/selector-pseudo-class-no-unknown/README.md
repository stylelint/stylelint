# selector-pseudo-class-no-unknown

Disallow unknown pseudo-class selectors.

```css
    a:hover {}
/**    ↑
 * This pseudo-class selector */
```

This rule considers pseudo-class selectors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule ignores vendor-prefixed pseudo-class selectors.

## 选项

### `true`

以下模式被视为违规：

```css
a:unknown {}
```

```css
a:UNKNOWN {}
```

```css
a:hoverr {}
```

以下模式*不*被视为违规：

```css
a:hover {}
```

```css
a:focus {}
```

```css
:not(p) {}
```

```css
input:-moz-placeholder {}
```

## 可选的辅助选项

### `ignorePseudoClasses: ["/regex/", "string"]`

给定：

```js
["/^my-/", "pseudo-class"]
```

以下模式*不*被视为违规：

```css
a:pseudo-class {}
```

```css
a:my-pseudo {}
```

```css
a:my-other-pseudo {}
```
