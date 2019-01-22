# function-name-case

Specify lowercase or uppercase for function names.

```css
a { width: calc(5% - 10em); }
/**        ↑
 * These functions */
```

Camel case function names, e.g. `translateX`, are accounted for when the `lower` option is used.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

```css
a {
  width: Calc(5% - 10em);
}
```

```css
a {
  width: cAlC(5% - 10em);
}
```

```css
a {
  width: CALC(5% - 10em);
}
```

```css
a {
  background: -WEBKIT-RADIAL-GRADIENT(red, green, blue);
}
```

以下模式*不*被视为违规：

```css
a {
  width: calc(5% - 10em);
}
```

```css
a {
  background: -webkit-radial-gradient(red, green, blue);
}
```

### `"upper"`

以下模式被视为违规：

```css
a {
  width: Calc(5% - 10em);
}
```

```css
a {
  width: cAlC(5% - 10em);
}
```

```css
a {
  width: calc(5% - 10em);
}
```

```css
a {
  background: -webkit-radial-gradient(red, green, blue);
}
```

以下模式*不*被视为违规：

```css
a {
  width: CALC(5% - 10em);
}
```

```css
a {
  background: -WEBKIT-RADIAL-GRADIENT(red, green, blue);
}
```

## 可选的辅助选项

### `ignoreFunctions: ["/regex-as-string/", /regex/, "non-regex"]`

Ignore case of function names.

For example, with `"lower"`.

给定：

```js
["some-function", "/^get.*$/"]
```

以下模式被视为违规：

```css
a {
  color: sOmE-FuNcTiOn();
}
```

```css
a {
  color: some-other-function();
}
```

```css
a {
  color: GetColor();
}
```

```css
a {
  color: GET_COLOR();
}
```

以下模式*不*被视为违规：

```css
a {
  display: some-function();
}
```


```css
a {
  display: getColor();
}
```

```css
a {
  display: get_color();
}
```
