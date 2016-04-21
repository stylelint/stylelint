# selector-no-qualifying-type

Disallow qualifying a selector by type.

```css
    a.class {}
/** ↑
 * This is the type in a selector that is qualified with a class */
```

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

## Options (optional)

### `ignore: "class"`

Allow class selectors qualified by type.

For example, the following would *not* be considered warnings:

```css
div.class {
  margin: 0
}
```

### `ignore: "id"`

Allow id selectors qualified by type.

For example, the following would *not* be considered warnings:

```css
div#id {
  margin: 0
}
```

### `ignore: "attribute"`

Allow attribute selectors qualified by type.

For example, the following would *not* be considered warnings:

```css
input[type='button'] {
  margin: 0
}
```
