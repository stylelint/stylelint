# selector-attribute-operator-blacklist

Specify a blacklist of disallowed attribute operators.

```css
[target="_blank"] {}
/**    ↑
 * These operators */
```

## Options

`array|string`: `["array", "of", "operators"]|"operator"`

Given:

```js
[ "*=" ]
```

The following patterns are considered warnings:

```css
[class*="test"] {}
```

The following patterns are *not* considered warnings:

```css
[target] {}
```

```css
[target="_blank"] {}
```

```css
[class|="top"] {}
```
