# shorthand-property-no-redundant-values

Disallow redundant values in shorthand properties.

```css
a { margin: 1px 1px 1px 1px; }
/**             ↑   ↑   ↑
 *           These values */
```

This rule alerts you when you use redundant values in the following shorthand properties:

-   `margin`
-   `padding`
-   `border-color`
-   `border-radius`
-   `border-style`
-   `border-width`
-   `grid-gap`

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

### `true`

以下模式被视为违规：

```css
a { margin: 1px 1px; }
```

```css
a { margin: 1px 1px 1px 1px; }
```

```css
a { padding: 1px 2px 1px; }
```

```css
a { border-radius: 1px 2px 1px 2px; }
```

```css
a { -webkit-border-radius: 1px 1px 1px 1px; }
```

以下模式*不*被视为违规：

```css
a { margin: 1px; }
```

```css
a { margin: 1px 1px 1px 2px; }
```

```css
a { padding: 1px 1em 1pt 1pc; }
```

```css
a { border-radius: 10px / 5px; }
```
