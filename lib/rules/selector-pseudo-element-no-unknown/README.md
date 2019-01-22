# selector-pseudo-element-no-unknown

Disallow unknown pseudo-element selectors.

```css
    a::before {}
/**    ↑
 * This pseudo-element selector */
```

This rule considers pseudo-element selectors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

This rule ignores vendor-prefixed pseudo-element selectors.

## 选项

### `true`

以下模式被视为违规：

```css
a::pseudo {}
```

```css
a::PSEUDO {}
```

```css
a::element {}
```

以下模式*不*被视为违规：

```css
a:before {}
```

```css
a::before {}
```

```css
::selection {}
```

```css
input::-moz-placeholder {}
```

## 可选的辅助选项

### `ignorePseudoElements: ["/regex/", "string"]`

给定：

```js
["/^my-/", "pseudo-element"]
```

以下模式*不*被视为违规：

```css
a::pseudo-element {}
```

```css
a::my-pseudo {}
```

```css
a::my-other-pseudo {}
```
