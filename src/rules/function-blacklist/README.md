# function-blacklist

Specify a blacklist of disallowed functions.

```css
a { transform: scale(1); }
/**            ↑
 * These functions */
```

## Options

`array`: `"["array", "of", "unprefixed", "functions"]`

Given:

```js
["scale", "rgba", "linear-gradient"]
```

The following patterns are considered warnings:

```css
a { transform: scale(1); }
```

```css
a {
  color: rgba(0, 0, 0, 0.5);
}
```

```css
a {
  background:
    red,
    -moz-linear-gradient(45deg, blue, red);
}
```

The following patterns are *not* considered warnings:

```css
a { background: red; }
```
