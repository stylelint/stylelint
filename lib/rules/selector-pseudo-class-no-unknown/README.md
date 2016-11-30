# selector-pseudo-class-no-unknown

Disallow unknown pseudo-class selectors.

```css
    a:hover {}
/**    ↑
 * This pseudo-class selector */
```

This rule considers pseudo-class selectors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

All vendor-prefixes pseudo-class selectors are ignored.

## Options

### `true`

The following patterns are considered warnings:

```css
a:unknown {}
```

```css
a:UNKNOWN {}
```

```css
a:hoverr {}
```

The following patterns are *not* considered warnings:

```css
a:hover {}
```

```css
a:focus {}
```

```css
:not(p) {}
```

```css
input:-moz-placeholder {}
```

## Optional secondary options

### `ignorePseudoClasses: ["/regex/", "string"]`

Given:

```js
["/^my-/", "pseudo-class"]
```

The following patterns are *not* considered warnings:

```css
a:pseudo-class {}
```

```css
a:my-pseudo {}
```

```css
a:my-other-pseudo {}
```
