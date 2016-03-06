# selector-class-pattern

Specify a pattern for class selectors.

```css
    .foo, #bar.baz span, #hoo[disabled] { color: pink; }
/** ↑         ↑
 * These class selectors */
```

## Options

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

## Optional options

### `resolveNestedSelectors: true | false` (default: `false`)

This option will resolve nested selectors with `&` interpolation.

### E.g. `/^[A-Z]+$/`

The following patterns are considered warnings:

```css
.A {
  &__B {} /* resolved to ".A__B" */
}
```

The following patterns are *not* considered warnings:

```css
.A {
  &B {} /* resolved to ".AB" */
}
```
