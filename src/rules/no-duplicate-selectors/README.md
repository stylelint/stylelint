# no-duplicate-selectors

Disallow duplicate selectors within a stylesheet.

```css
    .foo {} .ba {} .foo {}
/** ↑              ↑
 * These duplicates */
```

This rule checks each compound selector within a complex selector, so in `.foo .bar, .bar .foo` there are no duplicates because each compound selector is actually different, though both have the same constituents.

The same selector *is* allowed to repeat in the following circumstances:

- The duplicates are determined to originate in different stylesheets, e.g. you have concatenated or compiled files in a way that produces sourcemaps for PostCSS to read, e.g. postcss-import).
- The duplicates are in rules with different parent nodes, e.g. inside and outside of a media query.

**If you are using a processor that modifies selectors, read this:** This rule will only compare the selectors that it sees, so as far as it's concerned, in `a { b {} & b {} }` there are no duplicate selectors. If you're using SCSS, though, you do have duplicates in the output: `a b {}` occurs twice. If you want this rule to analyze the selectors in *your output*, make sure it runs *after* you have compiled your stylesheets.

The following patterns are considered warnings:

```css
.foo,
.foo {}
```

```css
.foo {}
.bar {}
.foo {}
```

```css
.foo .bar {}
.bar {}
.foo .bar {}
```

```css
@media (min-width: 10px) {
  .foo {}
  .foo {}
}
```

The following patterns are *not* considered warnings:

```css
.foo {}
@media (min-width: 10px) {
  .foo {}
}
```

```css
.foo {
  .foo {}
}
```

```css
.foo {}
.bar {}
.foo .bar {}
.bar .foo {}
```
