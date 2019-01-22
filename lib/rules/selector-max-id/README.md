# selector-max-id

Limit the number of ID selectors in a selector.

```css
    #foo {}
/** ↑
 * This type of selector */
```

This rule resolves nested selectors before counting the number of ID selectors. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

## 选项

`int`: Maximum universal selectors allowed.

例如，使用 `2`：

以下模式被视为违规：

```css
#foo #bar #baz {}
```

```css
#foo #bar {
  & #baz {}
}
```

```css
#foo #bar {
  & > #bar {}
}
```

以下模式*不*被视为违规：

```css
#foo {}
```

```css
#foo #bar {}
```

```css
.foo #foo {}
```

```css
#foo.foo #bar {}
```

```css
/* each selector in a selector list is evaluated separately */
#foo,
#baz #quux {}
```

```css
/* `#bar` is inside `:not()`, so it is evaluated separately */
#foo #bar:not(#baz) {}
```
