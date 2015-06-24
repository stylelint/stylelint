# property-blacklist

Specify a blacklist of disallowed properties.

```css
    a { text-rendering: optimizeLegibility; }
/**          ↑
 * These properties */
```

## Options

`array`: `"["array", "of", "unprefixed", "properties"]`

### `["array", "of", "unprefixed", properties"]`

Blacklisted properties *must never* be used.

Given:

```js
["text-rendering", "animation"]
```

The following patterns are considered warnings:


```css
a { text-rendering: optimizeLegibility; }
```

```css
a {
  animation: my-animation 2s;
  color: pink;
}
```

```css
a { -webkit-animation: my-animation 2s; }
```

The following patterns are *not* considered warnings:

```css
a { background: pink; }
```
