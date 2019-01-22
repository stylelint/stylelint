# comment-no-empty

Disallow empty comments.

```css
    /* */
/** ↑
 * Comments like this */
```

This rule ignores comments within selector and value lists.

## 选项

### `true`

以下模式被视为违规：

```css
/**/
```

```css
/* */
```

```css
/*

 */
```

以下模式*不*被视为违规：

```css
/* comment */
```

```css
/*
 * Multi-line Comment
**/
```
