# font-weight-notation

Require numeric or named (where possible) `font-weight` values. Also, when named values are expected, require only valid names.

```css
a { font-weight: bold }
/**              ↑
 *   This notation */

a { font: italic small-caps 600 16px/3 cursive; }
/**                         ↑
*      And this notation, too */
```

Valid font-weight names are `normal`, `bold`, `bolder`, and `lighter`.

This rule ignores `$sass`, `@less`, and `var(--custom-property)` variable syntaxes.

## 选项

`string`: `"numeric"|"named-where-possible"`

### `"numeric"`

`font-weight` values *must always* be numbers.

以下模式被视为违规：

```css
a { font-weight: bold; }
```

```css
a { font: italic normal 20px sans-serif; }
```

以下模式*不*被视为违规：

```css
a { font-weight: 700; }
```

```css
a { font: italic 400 20px; }
```

### `"named-where-possible"`

`font-weight` values *must always* be keywords when an appropriate keyword is available.

This means that only `400` and `700` will be rejected, because those are the only numbers with keyword equivalents (`normal` and `bold`).

以下模式被视为违规：

```css
a { font-weight: 700; }
```

```css
a { font: italic 400 20px sans-serif; }
```

以下模式*不*被视为违规：

```css
a { font-weight: bold; }
```

```css
a { font: italic normal 20px sans-serif; }
```

## 可选的辅助选项

### `ignore: ["relative"]`

Ignore the [*relative*](https://drafts.csswg.org/css-fonts/#font-weight-prop) keyword names of `bolder` and `lighter`.

以下模式*不*被视为违规：

```css
a { font-weight: 400; }
a b { font-weight: lighter; }
```
