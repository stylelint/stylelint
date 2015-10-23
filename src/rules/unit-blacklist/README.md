# unit-blacklist

Specify a blacklist of disallowed units.

```css
    a { width: 100px; }
/**               ↑
 *      These units */
```

## Options

`array`: `"["array", "of", "units"]"`

Given:

```js
["px", "em"]
```

The following patterns are considered warnings:

```css
a { width: 100px; }
```

```css
a { font-size: 10em; }
```

The following patterns are *not* considered warnings:

```css
a { width: 100%; }
```

```css
a { line-height: 1.2; }
```

```
a { height: 100vmin; }
```

