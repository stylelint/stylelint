# selector-type-no-unknown

Disallow unknown type selectors.

```css
    unknown {}
/** ↑
 * This type selector */
```

## Options

### `true`

The following patterns are considered warnings:

```css
unknown { }
```

```css
tag { }
```

The following patterns are *not* considered warnings:

```css
input { }
```

```css
ul li { }
```

```css
li > a { }
```

## Optional options

### `ignoreTypes: ["array", "of", "types"]`

Allow unknown type selectors.

Given:

```js
["unknown"]
```

The following patterns are considered warnings:

```css
tag
```

The following patterns are *not* considered warnings:

```css
unknown { }
```

```css
UNKNOWN { }
```

```css
unknown > a { }
```
