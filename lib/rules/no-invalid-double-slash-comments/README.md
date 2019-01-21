# no-invalid-double-slash-comments

禁止 CSS 不支持并[可能导致意外结果](https://stackoverflow.com/a/20192639/130652)的双斜杠注释（`//...`）。

```css
a {
  //color: pink;
}
/** ↑
 *  这个注释 */
```

如果您使用的是允许 `//` 单行注释的预处理器（例如Sass、Less、Stylus），则此规则不会报告这些注释。它们由预处理器编译成标准 CSS 注释，因此 stylelint 会认为它们有效。这个规则只是报告在常规 CSS 中使用 `//` 来“注释掉”单行代码的鲜为人知的方法。（如果您不知道这是可能的，请查看[“CSS 中的单行注释（//）”](http://www.xanthir.com/b4U10)）

## 选项

### `true`

以下模式被视为违规：

```css
a {
  //color: pink;
}
```

```css
//a { color: pink; }
```

```css
// Comment {}
a {
  color: pink;
}
```

以下模式*不*被视为违规：

```css
a {
  /* color: pink; */
}
```

```css
/* a { color: pink;  } */
```
