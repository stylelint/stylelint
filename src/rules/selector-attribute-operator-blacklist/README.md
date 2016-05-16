# selector-attribute-operator-blacklist

Specify a blacklist of disallowed attribute operators.

```css
a[target="_blank"] { }
/**     ↑
 * These operators */
```

## Options

`array`: `"["array", "of", "operators"]`

### `["array", "of", "operators"]`

Blacklisted attribute operators *must never* be used.

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
