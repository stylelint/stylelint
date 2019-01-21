# indentation

指定缩进。

```css
   |@media print {
   |  a {
   | ↑  background-position: top left,
   | ↑ ↑  top right;
   | ↑}↑ ↑
   |}↑ ↑ ↑
/**  ↑ ↑ ↑
 * 这三点的缩进 */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`int|"tab"`, 其中 `int` 是空格的数量

### `2`

始终将 @规则、规则、注释、声明、括号内和多行值按 2 个空格缩进。

以下模式被视为违规：

```css
@media print {
a {
background-position: top left,
top right;
}
}
```

```css
@media print {
a {
  background-position: top left,
    top right;
  }
}
```

```css
@media print {
  a {
    background-position: top left,
    top right;
  }
}
```

```css
@media print {
  a,
    b {
    background-position: top left,
      top right;
  }
}
```

```css
a {
/* blergh */
  color: pink;
}
  /* blergh */
```

```css
@media print,
(-webkit-min-device-pixel-ratio: 1.25),
(min-resolution: 120dpi) {}
```

```css
a {
  color: rgb(
  255,
  255,
  255
  );
  top: 0;
}
```

以下模式*不*被视为违规：

```css
@media print {
  a {
    background-position: top left,
      top right;
  }
}
```

```css
@media print {
  a,
  b {
    background-position: top left,
      top right;
  }
}
```

```css
a {
  /* blergh */
  color: pink;
}
/* blergh */
```

```css
@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
  (min-resolution: 120dpi) {}
```

```css
a {
  color: rgb(
    255,
    255,
    255
  );
  top: 0;
}
```

## 可选的辅助选项

### `baseIndentLevel: int|"auto"`

默认情况下，非类 CSS 文件中 CSS 代码块的缩进级别由非空行的最短缩进行确定。设置 `baseIndentLevel` 允许您根据CSS代码块打开或闭合行定义相对缩进级别。

例如，使用 `[2，{baseIndentLevel：1}]`，CSS 应该比 `<style>` 标签缩进高1级：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    a {
      display: block;
    }
  </style>
</head>
</html>
```

### `indentInsideParens: "twice"|"once-at-root-twice-in-block"`

默认情况下，在括号内的换行符后，期望有*一级额外的*缩进（指定类型），并且闭合括号预计不会有额外的缩进。

如果要更改括号内的额外缩进数量，请使用此选项。

`"twice"` 意味着在括号内的换行符之后会出现两级额外的缩进（指定类型），并期望闭合号有一个额外的缩进。例如：

```css
a {
  color: rgb(
      255,
      255,
      255
    );
  top: 0;
}
```

`"once-at-root-twice-in-block"` 意味着两件事：如上所述，当括号表达式是根节点的直接后代节点的一部分时————即不在块内，你想要 `"once"` 的行为。如上所述，当括号表达式是块内部节点的一部分时，您需要 `"twice"` 的行为。例如，使用 SCSS 映射：

```scss
$foo: (
  bar: 1,
  baz: 2
);

a {
  color: rgb(
      255,
      255,
      255
    );
  top: 0;
}
```

### `indentClosingBrace: true|false`

如果为 `true`，则块（规则或 @规则）的闭合括号将与块的内部节点保持相同的缩进级别。

例如，使用 `indentClosingBrace: true`。

以下模式被视为违规：

```css
a {
  color: pink;
}
```

```css
@media print {
  a {
    color: pink;
  }
}
```

以下模式*不*被视为违规：

```css
a {
  color: pink;
  }
```

```css
@media print {
  a {
    color: pink;
    }
  }
```

### `except: ["block", "param", "value"]`

对这些事物*不*做缩进。

例如，用 `2`。

以下模式被视为违规：

```css
@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
  (min-resolution: 120dpi) {
  a {
    background-position: top left,
      top right;
  }
}
```

以下模式*不*被视为违规：

```css
@media print,
(-webkit-min-device-pixel-ratio: 1.25),
(min-resolution: 120dpi) {
a {
background-position: top left,
top right;
}
}
```

### `ignore: ["inside-parens", "param", "value"]`

#### `"inside-parens"`

忽略括号内的缩进。

例如，用 `2`。

以下模式*不*被视为违规：

```css
a {
  color: rgb(
255,
  255,
    255
  );
  top: 0;
}
```

#### `"param"`

忽略 @规则参数的缩进。

例如，用 `2`。

以下模式*不*被视为违规：

```css
@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
    (min-resolution: 120dpi) {
}
```

#### `"value"`

忽略值的缩进。

例如，用 `2`。

以下模式*不*被视为违规：

```css
a {
  background-position: top left,
top right,
  bottom left,
    bottom right;
}
```
