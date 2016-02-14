# unit-blacklist

Specify a blacklist of disallowed units.

```css
a { width: 100px; }
/**           ↑
 *  These units */
```

## Options

`array`: `"["array", "of", "units"]"`

Given:

```js
["px", "em", "deg"]
```

The following patterns are considered warnings:

```css
a { width: 100px; }
```

```css
a { font-size: 10em; }
```

```css
a { transform: rotate(30deg); }
```

The following patterns are *not* considered warnings:

```css
a { font-size: 1.2rem; }
```

```css
a { line-height: 1.2; }
```

```css
a { height: 100vmin; }
```

```css
a { animation: animation-name 5s ease; }
```
