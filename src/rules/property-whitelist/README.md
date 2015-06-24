# property-whitelist

Specify a whitelist of allowed properties.

```css
    a { display: block; }
/**          ↑
 * These properties */
```

## Options

`array`: `"["array", "of", "unprefixed", "properties"]`

### `["array", "of", "unprefixed", properties"]`

Whitelisted properties are the only *allowed* properties.

Given:

```js
["display", "animation"]
```

The following patterns are considered warnings:


```css
a { color: pink; }
```

```css
a {
  animation: my-animation 2s;
  color: pink;
}
```

The following patterns are *not* considered warnings:

```css
a { display: block; }
```

```css
a { -webkit-animation: my-animation 2s; }
```

```css
a {
  animation: my-animation 2s;
  -webkit-animation: my-animation 2s;
  display: block;
}
```
