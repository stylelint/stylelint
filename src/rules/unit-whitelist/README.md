# unit-whitelist

Specify a whitelist of allowed units.

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
a { width: 100%; }
```

```css
a { font-size: 10rem; }
```

The following patterns are *not* considered warnings:

```css
a { font-size: 1.2em; }
```

```css
a { line-height: 1.2; }
```

```
a { height: 100px; }
```
