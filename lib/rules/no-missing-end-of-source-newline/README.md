# no-missing-end-of-source-newline

禁止缺少源代码结尾换行符。

```css
    a { color: pink; }
    \n
/** ↑
 * 这个换行符 */
```

空文件不被视为违规。

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

### `true`

以下模式被视为违规：

```css
a { color: pink; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
\n
```
