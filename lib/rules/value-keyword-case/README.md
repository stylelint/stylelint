# value-keyword-case

Specify lowercase or uppercase for keywords values.

```css
    a { display: block; }
/**              ↑
 *    These values */
```

This rule ignores [`<custom-idents>`](https://developer.mozilla.org/en/docs/Web/CSS/custom-ident) of known properties. Values which are paired with non-properties (e.g. `$vars` and custom properties), and do not conform to the primary option, can be ignored using the `ignoreValues: []` secondary option.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"lower"|"upper"`


### `"lower"`

以下模式被视为违规：

```css
a {
  display: Block;
}
```

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: BLOCK;
}
```

```css
a {
  transition: -WEBKIT-TRANSFORM 2s;
}
```

以下模式*不*被视为违规：

```css
a {
  display: block;
}
```

```css
a {
  transition: -webkit-transform 2s;
}
```

### `"upper"`

以下模式被视为违规：

```css
a {
  display: Block;
}
```

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: block;
}
```

```css
a {
  transition: -webkit-transform 2s;
}
```

以下模式*不*被视为违规：

```css
a {
  display: BLOCK;
}
```

```css
a {
  transition: -WEBKIT-TRANSFORM 2s;
}
```

## 可选的辅助选项

### `ignoreKeywords: ["/regex/", /regex/, "non-regex"]`

Ignore case of keywords values.

For example, with `"lower"`.

给定：

```js
["Block", "/^(f|F)lex$/"]
```

以下模式被视为违规：

```css
a {
  display: bLoCk;
}
```

```css
a {
  display: BLOCK;
}
```

```css
a {
  display: fLeX;
}
```

```css
a {
  display: FLEX;
}
```

以下模式*不*被视为违规：

```css
a {
  display: block;
}
```

```css
a {
  display: Block;
}
```

```css
a {
  display: flex;
}
```

```css
a {
  display: Flex;
}
```

### `ignoreProperties: ["/regex/", /regex/, "non-regex"]`

Ignore case of the values of the listed properties.

For example, with `"lower"`.

```js
["/^(b|B)ackground$/", "display"]
```

以下模式被视为违规：

```css
a {
  text-align: LEFT;
}
```

```css
a {
  text-align: Left;
}
```

以下模式*不*被视为违规：

```css
a {
  display: bloCk;
}
```

```css
a {
  display: BloCk;
}
```

```css
a {
  display: BLOCK;
}
```

```css
a {
  display: block;
}
```

```css
a {
  background: Red;
}
```

```css
a {
  Background: deepPink;
}
```
