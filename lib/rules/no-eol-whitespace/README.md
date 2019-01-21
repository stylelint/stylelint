# no-eol-whitespace

禁止行尾空白。

```css
a { color: pink; }···
/**               ↑
 *             这个空白 */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

### `true`

以下模式被视为违规：

```css
a { color: pink; }·
```

```css
a { color: pink; }····
```

注释字符串也会检查————因此以下是违规：

```css
/* 一些注释····
 * 另一些注释 */
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```

```css
/* 一些注释
 * 另一些注释 */
```

## 可选的辅助选项

### `ignore: ["empty-lines"]`

#### `"empty-lines"`

允许行尾空白用于只有空格的行，“空”行。

以下模式*不*被视为违规：

```css
a {
  color: pink;
··
  background: orange;
}
```

```css
····
```

```css
a { color: pink; }
····
```
