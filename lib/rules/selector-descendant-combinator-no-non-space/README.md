# selector-descendant-combinator-no-non-space

Disallow non-space characters for descendant combinators of selectors.

```css
.foo .bar .baz {}
/** ↑    ↑
* These descendant combinators */
```

This rule ensures that only a single space is used and ensures no tabs, newlines, nor multiple spaces are used for descendant combinators of selectors.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的大多数问题。

## 选项

### `true`

以下模式被视为违规：

```css
.foo  .bar {}
```

```css
.foo
.bar {}
```

以下模式*不*被视为违规：

```css
.foo .bar {}
```
