# selector-attribute-brackets-space-inside

Require a single space or disallow whitespace on the inside of the brackets within attribute selectors.

```css
    [ target=_blank ]
/** ↑               ↑
 * The space inside these two brackets */
```

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space inside the brackets.

以下模式被视为违规：

```css
[target] {}
```

```css
[ target] {}
```

```css
[target ] {}
```

```css
[target=_blank] {}
```

```css
[ target=_blank] {}
```

```css
[target=_blank ] {}
```

以下模式*不*被视为违规：

```css
[ target ] {}
```

```css
[ target=_blank ] {}
```

### `"never"`

There *must never* be whitespace on the inside the brackets.

以下模式被视为违规：

```css
[ target] {}
```

```css
[target ] {}
```

```css
[ target ] {}
```

```css
[ target=_blank] {}
```

```css
[target=_blank ] {}
```

```css
[ target=_blank ] {}
```

以下模式*不*被视为违规：

```css
[target] {}
```

```css
[target=_blank] {}
```
