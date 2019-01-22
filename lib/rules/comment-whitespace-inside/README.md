# comment-whitespace-inside

Require or disallow whitespace on the inside of comment markers.

```css
    /* comment */
/**  ↑         ↑
 * The space inside these two markers */
```

Any number of asterisks are allowed at the beginning or end of the comment. So `/** comment **/` is treated the same way as `/* comment */`.

**Caveat:** Comments within *selector and value lists* are currently ignored.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的所有问题。

## 选项

`string`: `"always"|"never"`

### `"always"`

There *must always* be whitespace inside the markers.

以下模式被视为违规：

```css
/*comment*/
```

```css
/*comment */
```

```css
/** comment**/
```

以下模式*不*被视为违规：

```css
/* comment */
```

```css
/** comment **/
```

```css
/**
 * comment
 */
```

```css
/*     comment
*/
```

### `"never"`

There *must never* be whitespace on the inside the markers.

以下模式被视为违规：

```css
/* comment */
```

```css
/*comment */
```

```css
/** comment**/
```

以下模式*不*被视为违规：

```css
/*comment*/
```

```css
/****comment****/
```
