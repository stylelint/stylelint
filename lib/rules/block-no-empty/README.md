# block-no-empty

Disallow empty blocks.

<!-- prettier-ignore -->
```css
 a { }
/** ↑
 * Blocks like this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
a { }
```

<!-- prettier-ignore -->
```css
@media print {
  a {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  /* foo */
}
```

<!-- prettier-ignore -->
```css
@media print {
  a {
    color: pink;
  }
}
```

## Optional secondary options

### `ignore: ["comments"]`

Exclude comments from being treated as content inside of a block.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  /* foo */
}
```

<!-- prettier-ignore -->
```css
@media print {
  a {
    /* foo */
  }
}
```
