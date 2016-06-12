# selector-attribute-operator-blacklist

Specify a blacklist of disallowed attribute operators.

```css
a[target="_blank"] { }
/**     ↑
 * These operators */
```

## Options

`array|string`: `"["array", "of", "operators"]|"operator"`

Given:

```js
[ "*=" ]
```

The following patterns are considered warnings:

```css
[class*="test"] { }
```

The following patterns are *not* considered warnings:

```css
a[target] { }
```

```css
a[target="_blank"] { }
```

```css
[class|="top"] { }
```
