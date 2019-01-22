# value-no-vendor-prefix

Disallow vendor prefixes for values.

```css
a { display: -webkit-flex; }
/**          ↑
 *  These prefixes */
```

This rule will only complain for prefixed *standard* values, and not for prefixed *proprietary* or *unknown* ones.

## 选项

### `true`

以下模式被视为违规：

```css
a { display: -webkit-flex; }
```

```css
a { max-width: -moz-max-content; }
```

```css
a { background: -webkit-linear-gradient(bottom, #000, #fff); }
```

以下模式*不*被视为违规：

```css
a { display: flex; }
```

```css
a { max-width: max-content; }
```

```css
a { background: linear-gradient(bottom, #000, #fff); }
```

## 可选的辅助选项

### `ignoreValues: ["string"]`

给定：

```js
["grab", "max-content"]
```

以下模式*不*被视为违规：

```css
cursor: -webkit-grab;
```

```css
.foo { max-width: -moz-max-content; }
```
