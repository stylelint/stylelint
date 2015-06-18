# property-blacklist

Specify a blacklist of disallowed properties.

```css
    a { 
      color: pink;
    }
/**    ↑ 
 * These properties */
```

## Options

`array`: `"["array", "of", "unprefixed", "properties"]`

### `["array", "of", "unprefixed", properties"]`

Blacklisted properties *must never* be used.

Given:

```js
["background-size", "transform"]
```

The following patterns are considered warnings:


```css
a {
  background-size: cover;
}
```

```css
a {
  transform: scale(1);
  color: pink;
}
```

```css
a {
  -webkit-transform: scale(1);
}
```

The following patterns are *not* considered warnings:

```css
a {
  background: pink;
}
```
