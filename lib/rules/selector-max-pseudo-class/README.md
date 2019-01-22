# selector-max-pseudo-class

Limit the number of pseudo-classes in a selector.

```css
.foo .bar:first-child:hover {}
/*       ↑           ↑
         |           |
         1           2 -- this selector contains two pseudo-classes */
```

This rule resolves nested selectors before counting the number of pseudo-classes in a selector. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The content of the `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

## 选项

`int`: Maximum pseudo-classes allowed.

例如，使用 `1`：

以下模式被视为违规：

```css
a:first-child:focus {}
```

```css
.foo .bar:first-child:hover {}
```

以下模式*不*被视为违规：

```css
a {}
```

```css
a:first-child {}
```

```css
.foo .bar:first-child {}
```

