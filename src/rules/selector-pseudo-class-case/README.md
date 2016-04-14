# selector-pseudo-class-case

Specify lowercase or uppercase for pseudo-class selectors.

```css
    a:hover {}
/**   ↑
 * This is pseudo-class selector */
```

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered warnings:

```css
a:Hover {}
```

```css
a:hOvEr {}
```

```css
a:HOVER {}
```

```css
:ROOT {}
```

```css
:-MS-INPUT-PLACEHOLDER {}
```

The following patterns are *not* considered warnings:

```css
a:hover {}
```

```css
:root {}
```

```css
:-ms-input-placeholder {}
```

### `"upper"`

The following patterns are considered warnings:

```css
a:Hover {}
```

```css
a:hOvEr {}
```

```css
a:hover {}
```

```css
:root {}
```

```css
:-ms-input-placeholder {}
```

The following patterns are *not* considered warnings:

```css
a:HOVER {}
```

```css
:ROOT {}
```

```css
:-MS-INPUT-PLACEHOLDER {}
```
