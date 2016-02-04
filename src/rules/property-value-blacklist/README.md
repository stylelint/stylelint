# property-value-blacklist

Specify a blacklist of disallowed property-value pairs.

```css
    a { text-transform: uppercase; }
/**       ↑             ↑
 * These properties and these values */
```

Note that values could be specified as regex by surrounding string value with slashes.
In that case they will be treated as regex instead of a plain string.

## Options

`object`: `{
  "property": ["array", "of", "values"],
  "property": ["/regex/", "non-regex"]
}`

Given:

```js
{
  "transform": ["/scale3d/", "/rotate3d/", "/translate3d/"],
  "position": ["fixed"],
  "color": ["/^green/"]
}
```

The following patterns are considered warnings:

```css
div { position: fixed; }
```

```css
a { transform: scale3d(1, 2, 3); }
```

```css
a { color: green; }
```

The following patterns are *not* considered warnings:

```css
div { position: relative; }
```

```css
a { transform: scale(2); }
```

```css
a { color: lightgreen; }
```
