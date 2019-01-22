# selector-pseudo-element-colon-notation

Specify single or double colon notation for applicable pseudo-elements.

```css
   a::before { color:pink; }
/** ↑
 * This notation */
```

The `::` notation was chosen for *pseudo-elements* to establish a discrimination between *pseudo-classes* (which subclass existing elements) and *pseudo-elements* (which are elements not represented in the document tree).

However, for compatibility with existing style sheets, user agents also accept the previous one-colon notation for *pseudo-elements* introduced in CSS levels 1 and 2 (namely, `:first-line`, `:first-letter`, `:before` and `:after`).

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"single"|"double"`

### `"single"`

Applicable pseudo-elements *must always* use the single colon notation.

以下模式被视为违规：

```css
a::before { color: pink; }
```

```css
a::after { color: pink; }
```

```css
a::first-letter { color: pink; }
```

```css
a::first-line { color: pink; }
```

以下模式*不*被视为违规：

```css
a:before { color: pink; }
```

```css
a:after { color: pink; }
```

```css
a:first-letter { color: pink; }
```

```css
a:first-line { color: pink; }
```

```css
input::placeholder { color: pink; }
```

```css
li::marker { font-variant-numeric: tabular-nums; }
```

### `"double"`

Applicable pseudo-elements *must always* use the double colon notation.

以下模式被视为违规：

```css
a:before { color: pink; }
```

```css
a:after { color: pink; }
```

```css
a:first-letter { color: pink; }
```

```css
a:first-line { color: pink; }
```

以下模式*不*被视为违规：

```css
a::before { color: pink; }
```

```css
a::after { color: pink; }
```

```css
a::first-letter { color: pink; }
```

```css
a::first-line { color: pink; }
```

```css
input::placeholder { color: pink; }
```

```css
li::marker { font-variant-numeric: tabular-nums; }
```
