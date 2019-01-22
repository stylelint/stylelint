# number-max-precision

Limit the number of decimal places allowed in numbers.

```css
a { top: 3.245634px; }
/**           ↑
 * These decimal places */
```

## 选项

`int`: Maximum number of decimal places allowed.

例如，使用 `2`：

以下模式被视为违规：

```css
a { top: 3.245px; }
```

```css
a { top: 3.245634px; }
```

```css
@media (min-width: 3.234em) {}
```

以下模式*不*被视为违规：

```css
a { top: 3.24px; }
```

```css
@media (min-width: 3.23em) {}
```

## 可选的辅助选项

### `ignoreUnits: ["/regex/", /regex/, "string"]`

Ignore the precision of numbers for values with the specified units.

For example, with `2`.

给定：

```js
["/^my-/", "%"]
```

以下模式被视为违规：

```css
a { top: 3.245px; }
```

```css
a { top: 3.245634px; }
```

```css
@media (min-width: 3.234em) {}
```

以下模式*不*被视为违规：

```css
a { top: 3.245%; }
```

```css
@media (min-width: 3.23em) {}
```

```css
a {
  width: 10.5432%;
}
```

```css
a { top: 3.245my-unit; }
```

```css
a {
  width: 10.989my-other-unit;
}
```
