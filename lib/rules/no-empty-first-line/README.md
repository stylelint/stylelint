# no-empty-first-line

禁止空第一行。

```css
    \n
    /** ↑
     * 这个换行符 */
    a { color: pink; }
```

此规则忽略空源代码。请使用[`no-empty-source`](../no-empty-source/README.md)规则禁止空源代码。

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

### `true`

以下模式被视为违规：

```css
\n
a { color: pink; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```
