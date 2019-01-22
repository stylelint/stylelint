# selector-combinator-space-after

Require a single space or disallow whitespace after the combinators of selectors.

```css
  a > b + c ~ d e >>> f { color: pink; }
/** ↑   ↑   ↑  ↑  ↑
 * These are combinators */
```

Combinators are used to combine several different selectors into new and more specific ones. There are several types of combinators, including: child (`>`), adjacent sibling (`+`), general sibling (`~`), and descendant (which is represented by a blank space between two selectors).

The descendant combinator is *not* checked by this rule.

Also, `+` and `-` signs within `:nth-*()` arguments are not checked (e.g. `a:nth-child(2n+1)`).

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be a single space after the combinators.

以下模式被视为违规：

```css
a +b { color: pink; }
```

```css
a>b { color: pink; }
```

以下模式*不*被视为违规：

```css
a + b { color: pink; }
```

```css
a> b { color: pink; }
```

### `"never"`

There *must never* be whitespace after the combinators.

以下模式被视为违规：

```css
a + b { color: pink; }
```

```css
a> b { color: pink; }
```

以下模式*不*被视为违规：

```css
a +b { color: pink; }
```

```css
a>b { color: pink; }
```
