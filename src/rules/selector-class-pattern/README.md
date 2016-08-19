# selector-class-pattern

Specify a pattern for class selectors.

```css
    .foo, #bar.baz span, #hoo[disabled] { color: pink; }
/** ↑         ↑
 * These class selectors */
```

This rule ignores non-ouputting Less mixin definitions and called Less mixins.

## Options

`regex|string`

A string will be translated into a RegExp — `new RegExp(yourString)` — so *be sure to escape properly*.

The selector value *after `.`* will be checked. No need to include `.` in your pattern.

Given the string:

```js
"foo-[a-z]+"
```

The following patterns are considered warnings:

```css
.foop {}
```

```css
.foo-BAR {}
```

```css
div > #zing + .foo-BAR {}
```

The following patterns are *not* considered warnings:

```css
.foo-bar {}
```

```css
div > #zing + .foo-bar {}
```

```css
#foop {}
```

```css
[foo='bar'] {}
```

```less
.foop() {}
```

```less
.foo-bar {
  .foop;
}
```

## Optional secondary options

### `resolveNestedSelectors: true | false` (default: `false`)

This option will resolve nested selectors with `&` interpolation.

For example, with `true`.

Given the string:

```js
"^[A-Z]+$"
```

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
