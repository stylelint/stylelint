# no-descending-specificity

Disallow selectors of lower specificity from coming after overriding selectors of higher specificity.

<!-- prettier-ignore -->
```css
    #container a { top: 10px; } a { top: 0; }
/** ↑                           ↑
 * The order of these selectors represents descending specificity */
```

Source order is important in CSS, and when two selectors have the _same_ specificity, the one that occurs _last_ will take priority. However, the situation is different when one of the selectors has a _higher_ specificity. In that case, source order does _not_ matter: the selector with higher specificity will win out even if it comes first.

The clashes of these two mechanisms for prioritization, source order and specificity, can cause some confusion when reading stylesheets. If a selector with higher specificity comes _before_ the selector it overrides, we have to think harder to understand it, because it violates the source order expectation. **Stylesheets are most legible when overriding selectors always come _after_ the selectors they override.** That way both mechanisms, source order and specificity, work together nicely.

This rule enforces that practice _as best it can_, reporting fewer errors than it should. It cannot catch every _actual_ overriding selector, but it can catch certain common mistakes.

## How it works

**This rule looks at the last _compound selector_ in every full selector, and then compares it with other selectors in the stylesheet that end in the same way.**

So `.foo .bar` (whose last compound selector is `.bar`) will be compared to `.bar` and `#baz .bar`, but not to `#baz .foo` or `.bar .foo`.

And `a > li#wag.pit` (whose last compound selector is `li#wag.pit`) will be compared to `div li#wag.pit` and `a > b > li + li#wag.pit`, but not to `li` or `li #wag`, etc.

Selectors targeting pseudo-elements are not considered comparable to similar selectors without the pseudo-element, because they target other elements on the rendered page. For example, `a::before { top: 10px; }` will not be compared to `a:hover { top: 10px; }`, because `a::before` targets a pseudo-element whereas `a:hover` targets the actual `<a>`.

This rule only compares rules that are within the same media context. So `a {top: 10px; } @media print { #baz a { top: 10px; } }` is fine.

This rule resolves nested selectors before calculating the specificity of the selectors.

## Limitations

This rule doesn't:

- have access to HTML or DOM structure
- consider `!important`
- consider individual properties

This can lead to valid linting errors appearing to be invalid at first glance.

It may be possible to restructure your CSS to remove the error, otherwise it is recommended that you disable the rule for that line and leave a comment saying why the error should be ignored. Note that disabling the rule will cause additional valid errors from being reported.

### DOM structure

The linter can only check the CSS to check for specificity order. It does not have access to the HTML or DOM in order to interpret the use of the CSS.

For example the following will cause an error:

<!-- prettier-ignore -->
```css
.component1 a { top: 10px; }
.component1 a:hover { top: 10px; }
.component2 a { top: 10px; }
```

This is a correct error because the `a:hover` on line 2 has a higher specificity than the `a` on line 3.

This may lead to confusion because "the two selectors will never match the same `a` in the DOM". However, since the linter does not have access to the DOM it can not evaluate this, and therefore correctly reports the error about descending specificity.

### `!important`

The linter only checks selectors and doesn't take `!important` into account.

For example the following will cause an error:

<!-- prettier-ignore -->
```css
a:hover { top: 10px; }
a { top: 10px !important; }
```

This is a correct error because the `a:hover` on line 1 has a higher specificity than the `a` on line 2.

This may lead to confusion because the declaration with `!important` will apply regardless of position. However, the linter only evaluates selectors, and therefore correctly reports the error about descending specificity.

### Different properties

The linter only checks selectors and doesn't take individual properties into account.

For example the following will cause an error:

<!-- prettier-ignore -->
```css
a:hover { top: 10px; }
a { left: 10px; }
```

This is a correct error because the `a:hover` on line 1 has a higher specificity than the `a` on line 2.

This may lead to confusion because both rules contain different declarations and there isn't any conflict between either. However, the linter only evaluates selectors, and therefore correctly reports the error about descending specificity.

## Options

### `true`

```json
{
  "no-descending-specificity": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
b a { top: 10px; }
a { top: 10px; }
```

<!-- prettier-ignore -->
```css
a + a { top: 10px; }
a { top: 10px; }
```

<!-- prettier-ignore -->
```css
b > a[foo] { top: 10px; }
a[foo] { top: 10px; }
```

<!-- prettier-ignore -->
```css
a {
  & > b { top: 10px; }
}
b { top: 10px; }
```

<!-- prettier-ignore -->
```css
@media print {
  #c a { top: 10px; }
  a { top: 10px; }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: 10px; }
b a { top: 10px; }
```

<!-- prettier-ignore -->
```css
a { top: 10px; }
a + a { top: 10px; }
```

<!-- prettier-ignore -->
```css
a[foo] { top: 10px; }
b > a[foo] { top: 10px; }
```

<!-- prettier-ignore -->
```css
b { top: 10px; }
a {
  & > b { top: 10px; }
}
```

<!-- prettier-ignore -->
```css
a::before { top: 10px; }
a:hover::before { top: 10px; }
a { top: 10px; }
a:hover { top: 10px; }
```

<!-- prettier-ignore -->
```css
@media print {
  a { top: 10px; }
  #c a { top: 10px; }
}
```

<!-- prettier-ignore -->
```css
a { top: 10px; }
@media print {
  #baz a { top: 10px; }
}
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"selectors-within-list"`

Ignores selectors within list of selectors.

```json
{
  "no-descending-specificity": [true, { "ignore": ["selectors-within-list"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
b a { top: 10px; }
h1 { top: 10px; }
h2 { top: 10px; }
h3 { top: 10px; }
a { top: 10px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
b a { top: 10px; }
h1, h2, h3, a { top: 10px; }
```
