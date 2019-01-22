# string-quotes

Specify single or double quotes around strings.

```css
a[id="foo"] { content: "x"; }
/**  ↑   ↑             ↑ ↑
 * These quotes and these quotes */
```

Quotes within comments are ignored.


```css
/* "This is fine" */
/* 'And this is also fine' */
```

Single quotes in a charset @-rule are ignored as using single quotes in this context is incorrect according the [CSS specification](https://www.w3.org/TR/CSS2/syndata.html#x57).

```css
@charset "utf-8"
/* fine regardless of configuration */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的大多数问题。

## 选项

`string`: `"single"|"double"`

### `"single"`

Strings *must always* be wrapped with single quotes.

以下模式被视为违规：

```css
a { content: "x"; }
```

```css
a[id="foo"] {}
```

以下模式*不*被视为违规：

```css
a { content: 'x'; }
```

```css
a[id='foo'] {}
```

```css
a { content: "x'y'z"; }
```

### `"double"`

Strings *must always* be wrapped with double quotes.

以下模式被视为违规：

```css
a { content: 'x'; }
```

```css
a[id='foo'] {}
```

以下模式*不*被视为违规：

```css
a { content: "x"; }
```

```css
a[id="foo"] {}
```

```css
a { content: 'x"y"z'; }
```

## 可选的辅助选项

### `avoidEscape`: `true|false`, defaults to `true`

Allows strings to use single-quotes or double-quotes so long as the string contains a quote that would have to be escaped otherwise.

For example, with `"single", { "avoidEscape" : false }`.

以下模式被视为违规：

```css
a { content: "x'y'z"; }
```

```css
a[id="foo'bar'baz"] {}
```

以下模式*不*被视为违规：

```css
a { content: 'x'; }
```

```css
a[id='foo'] {}
```
