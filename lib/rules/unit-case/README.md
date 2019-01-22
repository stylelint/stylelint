# unit-case

Specify lowercase or uppercase for units.

```css
    a { width: 10px; }
/**              ↑
 *     These units */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的大多数问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
a {
  width: 10PX;
}
```

```css
a {
  width: 10Px;
}
```

```css
a {
  width: 10pX;
}
```

```css
a {
  width: 10PIXEL;
}
```

```css
a {
  width: calc(10PX * 2);
}
```

以下模式*不*被视为违规：

```css
a {
  width: 10px;
}
```

```css
a {
  width: calc(10px * 2);
}
```

### `"upper"`

以下模式被视为违规：

```css
a {
  width: 10px;
}
```

```css
a {
  width: 10Px;
}
```

```css
a {
  width: 10pX;
}
```

```css
a {
  width: 10pixel;
}
```

```css
a {
  width: calc(10px * 2);
}
```

以下模式*不*被视为违规：

```css
a {
  width: 10PX;
}
```

```css
a {
  width: calc(10PX * 2);
}
```
