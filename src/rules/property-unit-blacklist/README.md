# property-unit-blacklist

Specify a blacklist of disallowed units for specific properties.

```css
    a { width: 100px; }
/**               ↑
 *      These units */
```

## Options

`object`: `{
  "property": ["array", "of", "units"]
}`

Given:

```js
{
  "font-size": ["em", "px"],
  "animation": ["s"]
}
```

The following patterns are considered warnings:

```css
a { width: 100px; }
```

```css
a { font-size: 1em; }
```

```css
a { animation: animation-name 5s ease; }
```

The following patterns are *not* considered warnings:

```css
a { font-size: 1.2rem; }
```

```css
a { height: 100%; }
```

```css
a { animation: animation-name 500ms ease; }
```

