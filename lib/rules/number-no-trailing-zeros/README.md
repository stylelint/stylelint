# number-no-trailing-zeros

Disallow trailing zeros in numbers.

```css
a { top: 0.5000px; bottom: 1.0px; }
/**         ↑                ↑
 *        These trailing zeros */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的一些问题。

## 选项

### `true`

以下模式被视为违规：

```css
a { top: 1.0px }
```

```css
a { top: 1.01000px }
```

以下模式*不*被视为违规：

```css
a { top: 1px }
```

```css
a { top: 1.01px }
```
