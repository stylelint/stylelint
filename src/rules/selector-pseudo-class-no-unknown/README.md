# selector-pseudo-class-no-unknown

Disallow unknown pseudo-class selectors.

```css
    a:hover {}
/**    ↑
 * This pseudo-class selector */
```

All vendor-prefixes pseudo-class selectors are ignored.

## Options

### `true`

The following patterns are considered warnings:

```css
a:unknown { }
```

```css
a:UNKNOWN { }
```

```css
a:hoverr { }
```

The following patterns are *not* considered warnings:

```css
a:hover { }
```

```css
a:focus { }
```

```css
:not(p) { }
```

```css
input:-moz-placeholder { }
```

## Optional options

### `ignorePseudoClasses: ["array", "of", "pseudo-classes"]`

Allow unknown pseudo-class selectors.

Given:

```js
["pseudo-class"]
```

The following patterns are considered warnings:

```css
a:unknown { }
```

The following patterns are *not* considered warnings:

```css
a:pseudo-class { }
```

```css
a:hover { }
```

```css
:not(p) { }
```

```css
input:-moz-placeholder { }
```
