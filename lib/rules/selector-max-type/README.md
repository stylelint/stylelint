# selector-max-type

Limit the number of type selectors in a selector.

```css
    a {}
/** ↑
 * This type of selector */
```

This rule resolves nested selectors before counting the number of type selectors. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

## 选项

`int`: Maximum type selectors allowed.

例如，使用 `2`：

以下模式被视为违规：

```css
div a span {}
```

```css
div a {
  & span {}
}
```

```css
div a {
  & > a {}
}
```

以下模式*不*被视为违规：

```css
div {}
```

```css
div a {}
```

```css
.foo div a {}
```

```css
div.foo a {}
```

```css
/* each selector in a selector list is evaluated separately */
div,
a span {}
```

```css
/* `span` is inside `:not()`, so it is evaluated separately */
div a .foo:not(span) {}
```

以下模式*不*被视为违规：

## 可选的辅助选项

### `ignore: ["child", "compounded", "descendant", "next-sibling"]`

#### `"child"`

Discount child type selectors.

例如，使用 `2`：

以下模式*不*被视为违规：

```css
div span > a {}
```

```css
#bar div span > a {}
```

#### `"compounded"`

Discount compounded type selectors -- i.e. type selectors chained with other selectors.

例如，使用 `2`：

以下模式*不*被视为违规：

```css
div span a.foo {}
```

```css
div span a#bar {}
```

#### `"descendant"`

Discount descendant type selectors.

例如，使用 `2`：

以下模式*不*被视为违规：

```css
.foo div span a {}
```

```css
#bar div span a {}
```

#### `"next-sibling"`

Discount next-sibling type selectors.

例如，使用 `2`：

以下模式*不*被视为违规：

```css
div a + span {}
```

```css
#bar + div + span + a + span {}
```

### `ignoreTypes: ["/regex/", /regex/, "string"]`

给定：

```js
["/^my-/", "custom"]
```

For example, with `2`.

以下模式*不*被视为违规：

```css
div a custom {}
```

```css
div a my-type {}
```

```css
div a my-other-type {}
```
