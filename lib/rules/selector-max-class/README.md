# selector-max-class

Limit the number of classes in a selector.

```css
div .foo.bar[data-val] > a.baz {}
/*  ↑   ↑                 ↑
    |   |                 |
    1   2                 3  -- this selector contains three classes */
```

This rule resolves nested selectors before counting the number of classes in a selector. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

## Options

`int`: Maximum classes allowed.

For example, with `2`:

The following patterns are considered warnings:

```css
.foo.bar.baz {}
```

```css
.foo .bar {
  & > .baz {}
}
```

The following patterns are *not* considered warnings:

```css
div {}
```

```css
.foo .bar {}
```

```css
.foo.bar,
.lorem.ipsum {} /* each selector in a selector list is evaluated separately */
```

```css
.foo .bar :not(.lorem.ipsum) {} /* `.lorem.ipsum` is inside `:not()`, so it is evaluated separately */
```
