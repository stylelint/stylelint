# declaration-bang-space-after

Require a single space or disallow whitespace after the bang of declarations.

```css
a { color: pink !important; }
/**             ↑
 * The space after this exclamation mark */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the bang.

以下模式被视为违规：

```css
a { color: pink !important; }
```

```css
a { color: pink      !important; }
```

以下模式*不*被视为违规：

```css
a { color: pink ! important; }
```

```css
a { color: pink! important; }
```

### `"never"`

There *must never* be whitespace after the bang.

以下模式被视为违规：

```css
a { color: pink ! important; }
```

```css
a { color: pink! important; }
```

以下模式*不*被视为违规：

```css
a { color: pink !important; }
```

```css
a { color:pink!important; }
```
