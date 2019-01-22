# number-leading-zero

Require or disallow a leading zero for fractional numbers less than 1.

```css
a { line-height: 0.5; }
/**              ↑
 * This leading zero */
```

This rule ignores mixin parameters in Less.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a leading zero.

以下模式被视为违规：

```css
a { line-height: .5; }
```

```css
a { transform: translate(2px, .4px); }
```

以下模式*不*被视为违规：

```css
a { line-height: 0.5; }
```

```css
a { transform: translate(2px, 0.4px); }
```

### `"never"`

There *must never* be a leading zero.

以下模式被视为违规：

```css
a { line-height: 0.5; }
```

```css
a { transform: translate(2px, 0.4px); }
```

以下模式*不*被视为违规：

```css
a { line-height: .5; }
```

```css
a { transform: translate(2px, .4px); }
```
