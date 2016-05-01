# selector-no-qualifying-type

Disallow qualifying a selector by type.

```css
    a.class {}
/** ↑
 * This type selector is qualifying the class */
```

A type selector is "qualifying" when it is compounded with (chained to) another selector (e.g. a.foo, a#foo). This rule does not regulate type selectors that are combined with other selectors via a combinator (e.g. a > .foo, a #foo).

The following patterns are considered warnings:

```css
div.class {
  margin: 0
}
```

```css
div#id {
  margin: 0
}
```

```css
input[type='button'] {
  margin: 0
}
```

The following patterns are *not* considered warnings:

```css
.class {
  margin: 0
}
```

```css
#id {
  margin: 0
}
```

```css
input {
  margin: 0
}
```

## Optional options

### `ignore: ["class"]`

Allow class selectors qualified by type.

For example, the following would *not* be considered warnings:

```css
div.class {
  margin: 0
}
```

### `ignore: ["id"]`

Allow id selectors qualified by type.

For example, the following would *not* be considered warnings:

```css
div#id {
  margin: 0
}
```

### `ignore: ["attribute"]`

Allow attribute selectors qualified by type.

For example, the following would *not* be considered warnings:

```css
input[type='button'] {
  margin: 0
}
```
