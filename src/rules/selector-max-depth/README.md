# selector-max-depth

Limit the depth of selectors.

```css
   .foo .bar[data-val] > .baz + .boom > .lorem {
/* ↑    ↑                ↑      ↑       ↑
   |    |                |      |       | 
  Lv1  Lv2               Lv3    Lv4     Lv5  -- these are depth levels */
```

To put it simply, a selector's depth in terms of this rule is how many different HTML elements the selector is reflecting. You can read more about selectors depth is [SMACSS book](http://smacss.com/book/applicability). Although note, that this rule is not about the actual number of HTML levels, since it is usually hard to say how many elements wrap the `a` in `body a` without looking in the markup.

This rule resolves nested selectors before calculating the depth of a selector.

## Options

`int`: Maximum depth allowed.

For example, with `3`:

The following patterns are considered warnings:

```css
.foo .bar .baz .lorem {}
```

```css
.foo .baz {
  & > .bar .lorem{}
}
```

The following are *not* considered warnings:

```css
div {}
```

```css
.foo div {}
```

```css
#foo #bar > #baz {}
```

```css
.foo + div :not (a b ~ c) {} /* `a b ~ c` is inside :not() so its depth is calculated separately */
```
