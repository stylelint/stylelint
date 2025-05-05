# block-no-empty

Disallow empty blocks.

<!-- prettier-ignore -->
```css
 a { }
/** ↑
 * Blocks like this */
```

## Options

### `true`

```json
{
  "block-no-empty": true
}
```

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

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"comments"`

Exclude comments from being treated as content inside of a block.

```json
{
  "block-no-empty": [true, { "ignore": ["comments"] }]
}
```

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
