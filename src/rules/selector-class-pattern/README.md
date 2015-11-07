# selector-class-pattern

Specify a pattern for class selectors.

```css
    .foo, #bar.baz span, #hoo[disabled] { color: pink; }
/**   ↑         ↑
 * These class selectors */
```

`regex` or `string`

A string will be translated into a RegExp — `new RegExp(yourString)` — so *be sure to escape properly*.

The selector value *after `.`* will be checked. No need to include `.` in your pattern.

### E.g. `/foo-[a-z]+/`

The following patterns are considered warnings:

```css
.foop {}
.foo-BAR {}
div > #zing + .foo-BAR {}
```

The following patterns are *not* considered warnings:

```css
.foo-bar {}
div > #zing + .foo-bar {}
#foop {}
[foo='bar'] {}
```
