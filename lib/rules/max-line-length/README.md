# max-line-length

限制行的长度。

```css
a { color: red }
/**            ↑
 *           结尾 */
```

超出最大长度但不包含空格（除行开头之外）的行将被忽略。

在计算行长度时，任何 `url(...)` 函数的参数都会从计算中排除，因为通常你无法控制这些参数的长度。这意味着长的 `url(...)` 函数不应该导致违规。

## 选项

`int`：允许的最大字符数。

例如，使用 `20`：

以下模式被视为违规：

```css
a { color: 0; top: 0; }
```

```css
a {
  background: linear-gradient(red, blue);
}
```

以下模式*不*被视为违规：

```css
a {
  color: 0;
  top: 0;
}
```

```css
a {
  background: url(a-url-that-is-over-20-characters-long);
}
```

## 可选的辅助选项

### `ignore: ["non-comments"]`

仅对注释中的行强制执行行长度限制。

这不适用于插入其他内容之间的注释，仅适用于从注释的开头或中间开始的行。

例如，最大长度为 `30`。

以下模式被视为违规：

每个只有一次违规。

```css
/* 这行对我的规则来说太长了 */
a { color: pink; background: orange; }
a { color: pink; /* 这个注释也很长，但没有自己单独的行 */ }
```

```css
a { color: pink; background: orange; }
/**
 * 这行很短，
 * 但这行对我来说太长了，
 * 虽然这个很好
 */
a { color: pink; /* 这个注释也很长，但没有自己单独的行 */ }
```

### `ignore: ["comments"]`

仅对非注释的行强制执行行长度限制。

这也适用于同一行代码之间的注释。

例如，最大长度为 `30`。

以下模式被视为违规：

```css
a { color: pink; } /* 这个注释太长了 */
```

```css
a { /* 这个注释对于最大长度来说太长了 */ }
```

以下模式*不*被视为违规：

```css
/* 对于我的规则来说太长了的注释 */
a { color: pink; }
```

```css
/*
 * 对于最大长度来说太长了的注释
 * 对于最大长度来说太长了的注释
 *
 */
a { color: pink; }
```

### `ignorePattern: "/regex/"`

忽略与给定正则表达式模式匹配的任何行，无论它是否为注释。正则表达式可以通过用正斜杠括起来作为字符串（用于JSON配置）传递，或者可以使用普通的JavaScript RegExp。

给定：

```js
"/^@import\\s+/"
```

以下模式*不*被视为违规：

```css
@import "../../../../another/css/or/scss/file/or/something.css";
```

给出以下内容，最大长度为 `20`。

```js
["/https?:\/\/[0-9,a-z]*.*/"]
```

以下模式*不*被视为违规：

```css
/* ignore urls https://www.example.com */
```
