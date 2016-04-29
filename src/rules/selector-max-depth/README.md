# selector-max-depth

Limit the depth of selectors.

```css
   .foo .bar[data-val] > .baz + .boom > .lorem {
/* ↑    ↑                 \_________/   ↑  
   |    |                  ↑            | 
  Lv1  Lv2                Lv3          Lv4  -- these are depth levels */
```

To put it simply, a selector's depth in terms of this rule is how many different levels of HTML structure (not necessarily direct descendants) the selector is reflecting. You can read more about selectors depth is [SMACSS book](http://smacss.com/book/applicability). Although note, that this rule is not about the actual number of HTML levels, since it is usually hard to say how many elements wrap the `a` in `body a` without looking in the markup.

Only child (`h1 > a`) and descendant (`h1 a`) combinators are considered to create a new depth level; adjacent combinators (`p + p`, `.foo ~ bar`) don't.

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
.foo + div { /* `.foo` and `div` are siblings, they are on the same level */
  & div ~ a + span {} /* so are `div`, `a`, and `span` */
}
```
