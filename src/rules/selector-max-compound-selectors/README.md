# selector-max-compound-selectors

Limit the number of compound selectors in a selector.

```css
   div .bar[data-val] > a.baz + .boom > #lorem {
/* ↑   ↑                ↑       ↑       ↑
   |   |                |       |       | 
  Lv1  v2               Lv3     Lv4     Lv5  -- these are compound selectors */
```

A [compound selector](https://www.w3.org/TR/selectors4/#compound) is a chain of one or more simple (tag, class, id, universal, attribute) selectors. The reason why one might want to limit their number is described in [SMACSS book](http://smacss.com/book/applicability).

This rule resolves nested selectors before calculating the depth of a selector.

`:not()` is considered one compound selector irrespective to the complexity of the selector inside it. The rule does process that inner selector, yet separately of the main selector.

## Options

`int`: Maximum compound selectors allowed.

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
.foo + div :not (a b ~ c) {} /* `a b ~ c` is inside :not() and is processed separately */
```
