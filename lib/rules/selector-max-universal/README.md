# selector-max-universal

Limit the number of universal selectors in a selector.

```css
    * {}
/** ↑
 * This universal selector */
```

This rule resolves nested selectors before counting the number of universal selectors. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

## 选项

`int`: Maximum universal selectors allowed.

例如，使用 `2`：

以下模式被视为违规：

```css
* * * {}
```

```css
* * {
  & * {}
}
```

```css
* * {
  & > * {}
}
```

以下模式*不*被视为违规：

```css
* {}
```

```css
* * {}
```

```css
.foo * {}
```

```css
*.foo * {}
```

```css
/* each selector in a selector list is evaluated separately */
*.foo,
*.bar * {}
```

```css
/* `*` is inside `:not()`, so it is evaluated separately */
* > * .foo:not(*) {}
```
