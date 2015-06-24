# rule-properties-order

Specify the order of properties within rules.

```css
    a {
      color: pink;
      top: 0;
    }
/**    ↑
 * These properties */
```

Prefixed properties *must always* be alphabetically order and *must always* preceed the unprefixed property.

## Options

`string|array`: `"alphabetical"|["array", "of", "unprefixed", "property", "names"]`

### `"alphabetical"`

Properties *must always* be ordered alphabetically.

The following patterns are considered warnings:

```css
a {
  top: 0;
  color: pink;
}
```

```css
a {
  -moz-transform: scale(1);
  transform: scale(1);
  -webkit-transform: scale(1);
}
```

The following patterns are *not* considered warnings:

```css
a {
  color: pink;
  top: 0;
}
```

```css
a {
  -moz-transform: scale(1);
  -webkit-transform: scale(1);
  transform: scale(1);
}
```

### `["array", "of", "unprefixed", property", "names"]`

Properties *must always* be ordered to match that of the array.

Given:

```js
["transform", "top", "color"]
```

The following patterns are considered warnings:

```css
a {
  color: pink;
  top: 0;
}
```

```css
a {
  -moz-transform: scale(1);
  transform: scale(1);
  -webkit-transform: scale(1);
}
```

The following patterns are *not* considered warnings:

```css
a {
  top: 0;
  color: pink;
}
```

```css
a {
  -moz-transform: scale(1);
  -webkit-transform: scale(1);
  transform: scale(1);
}
```
