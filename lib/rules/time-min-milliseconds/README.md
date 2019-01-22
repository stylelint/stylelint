# time-min-milliseconds

Specify the minimum number of milliseconds for time values.

```css
a { animation: slip-n-slide 150ms linear; }
/**                         ↑
 *                  This time */
```

This rule checks positive numbers in `transition-duration`, `transition-delay`, `animation-duration`, `animation-delay`, and those times as they manifest in the `transition` and `animation` shorthands.

## 选项

`int`: Minimum number of milliseconds for time values.

例如，使用 `100`：

以下模式被视为违规：

```css
a { animation: 80ms; }
```

```css
a { transition-duration: 0.08s; }
```

```css
a { transition: background-color 6ms linear; }
```

```css
a { animation-delay: 0.01s; }
```

以下模式*不*被视为违规：

```css
a { animation: 8s; }
```

```css
a { transition-duration: 0.8s; }
```

```css
a { transition: background-color 600ms linear; }
```

```css
a { animation-delay: 1s; }
```
