# selector-pseudo-class-case

Specify lowercase or uppercase for pseudo-class selectors.

```css
    a:hover {}
/**   ↑
 * This is pseudo-class selector */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
a:Hover {}
```

```css
a:hOvEr {}
```

```css
a:HOVER {}
```

```css
:ROOT {}
```

```css
:-MS-INPUT-PLACEHOLDER {}
```

以下模式*不*被视为违规：

```css
a:hover {}
```

```css
:root {}
```

```css
:-ms-input-placeholder {}
```

### `"upper"`

以下模式被视为违规：

```css
a:Hover {}
```

```css
a:hOvEr {}
```

```css
a:hover {}
```

```css
:root {}
```

```css
:-ms-input-placeholder {}
```

以下模式*不*被视为违规：

```css
a:HOVER {}
```

```css
:ROOT {}
```

```css
:-MS-INPUT-PLACEHOLDER {}
```
