# keyframe-declaration-no-important

Disallow `!important` within keyframe declarations.

```css
@keyframes important2 {
  from { margin: 10px }
  to { margin: 20px !important }
}                /* ↑ */
/**                 ↑
*     This !important */
```

Using `!important` within keyframes declarations is completely ignored in some browsers:
[MDN - !important in a keyframe](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes#!important_in_a_keyframe)

## 选项

### `true`

以下模式被视为违规：

```css
@keyframes important1 {
  from {
    margin-top: 50px;
  }
  to {
    margin-top: 100px !important;
  }
}
```

```css
@keyframes important1 {
  from {
    margin-top: 50px;
  }
  to {
    margin-top: 100px!important;
  }
}
```

```css
@keyframes important1 {
  from {
    margin-top: 50px;
  }
  to {
    margin-top: 100px ! important;
  }
}
```

以下模式*不*被视为违规：

```css
a { color: pink !important; }
```

```css
@keyframes important1 {
  from {
    margin-top: 50px;
  }
  to {
    margin-top: 100px;
  }
}
```
