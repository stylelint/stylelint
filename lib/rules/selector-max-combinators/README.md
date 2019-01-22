# selector-max-combinators

Limit the number of combinators in a selector.

```css
  a > b + c ~ d e { color: pink; }
/** ↑   ↑   ↑  ↑
 * These are combinators */
```

This rule resolves nested selectors before counting the number of combinators selectors. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

## 选项

`int`: Maximum combinators selectors allowed.

例如，使用 `2`：

以下模式被视为违规：

```css
a b ~ c + d {}
```

```css
a b ~ c {
  & > d {}
}
```

```css
a b {
  & ~ c {
    & + d {}
  }
}
```

以下模式*不*被视为违规：

```css
a {}
```

```css
a b {}
```

```css
a b ~ c {}
```

```css
a b {
  & ~ c {}
}
```

```css
/* each selector in a selector list is evaluated separately */
a b,
c > d {}
```
