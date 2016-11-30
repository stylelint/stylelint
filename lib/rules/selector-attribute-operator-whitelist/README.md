# selector-attribute-operator-whitelist

Specify a whitelist of allowed attribute operators.

```css
[target="_blank"] {}
/**    ↑
 * These operators */
```

## Options

`array|string`: `["array", "of", "operators"]|"operator"`

Given:

```js
[ "=", "|=" ]
```

The following patterns are considered warnings:

```css
[class*="test"] {}
```

```css
[title~="flower"] {}
```

```css
[class^="top"] {}
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
