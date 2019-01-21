# linebreaks

指定 unix 或 windows 换行符。

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"unix"|"windows"`

### `"unix"`

换行符*必须始终*为 LF（`\n`）。

具有 CRLF 换行符的行被视为违规。

### `"windows"`

换行符*必须始终*为 CRLF（`\r\n`）。

具有 LF 换行符的行被视为违规。
