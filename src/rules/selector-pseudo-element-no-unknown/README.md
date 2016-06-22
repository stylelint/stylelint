# selector-pseudo-element-no-unknown

Disallow unknown pseudo-element selectors.

```css
    a::before {}
/**    ↑
 * This pseudo-element selector */
```

All vendor-prefixes pseudo-element selectors are ignored.

## Options

### `true`

The following patterns are considered warnings:

```css
a::pseudo { }
```

```css
a::PSEUDO { }
```

```css
a::element { }
```

The following patterns are *not* considered warnings:

```css
a:before { }
```

```css
a::before { }
```

```css
::selection { }
```

```css
input::-moz-placeholder { }
```

## Optional options

### `ignorePseudoElements: ["array", "of", "pseudo-elements"]`

Allow unknown pseudo-element selectors.

Given:

```js
["pseudo"]
```

The following patterns are considered warnings:

```css
a::element { }
```

The following patterns are *not* considered warnings:

```css
a:before { }
```

```css
a::before { }
```

```css
a::pseudo { }
```

```css
input::-moz-placeholder { }
```
