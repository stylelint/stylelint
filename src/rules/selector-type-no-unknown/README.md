# selector-type-no-unknown

Disallow unknown type selectors.

```css
       input {}
/**    ↑
 * This type selector */
```

The following patterns are considered warnings:

```css
unknown { }
```

```css
uNkNoWn { }
```

```css
UNKNOWN { }
```

The following patterns are *not* considered warnings:

```css
input { }
```

```css
iNpUt { }
```

```css
INPUT { }
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

For example, given:

```js
["unknown"]
```

The following patterns are considered warnings:

```css
tag
```

```css
tAg
```

```css
TAG
```

The following patterns are *not* considered warnings:

```css
unknown { }
```

```css
uNkNoWn { }
```

```css
UNKNOWN { }
```

```css
unknown > a { }
```
