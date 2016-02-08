# property-value-blacklist

Specify a blacklist of disallowed property-value pairs.

```css
    a { text-transform: uppercase; }
/**       ↑             ↑
 * These properties and these values */
```

Note that values could be specified as regex by surrounding string value with slashes.
In that case they will be treated as regex instead of a plain string. Regex is matched against entire value. For example, a value like "10px solid rgba( 255 , 0 , 0 , 0.5 )" will not match "/^solid/" (notice beginning of the line boundary) but will match "/\\s+solid\\s+/" or "/\\bsolid\\b/". Be careful with regex matching not to accidentally consider quoted string values. For example, "/red/" will match value such as "1px dotted red" as well as "white url(/mysite.com/red.png)".

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
