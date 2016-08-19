# media-feature-name-case

Specify lowercase or uppercase for media feature names.

```css
@media (min-width: 700px) {}
/**     ↑
 * These media feature names */
```

**Caveat:** Media feature names within a range context are currently ignored.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered warnings:

```css
@media (MIN-WIDTH: 700px) {}
```

```css
@media not all and (MONOCHROME) {}
```

```css
@media (min-width: 700px) and (ORIENTATION: landscape) {}
```

The following patterns are *not* considered warnings:

```css
@media (min-width: 700px) {}
```

```css
@media not all and (monochrome) {}
```

```css
@media (min-width: 700px) and (orientation: landscape) {}
```

### `"upper"`

The following patterns are considered warnings:

```css
@media (min-width: 700px) {}
```

```css
@media not all and (monochrome) {}
```

```css
@media (MIN-WIDTH: 700px) and (orientation: landscape) {}
```

The following patterns are *not* considered warnings:

```css
@media (MIN-WIDTH: 700px) {}
```

```css
@media not all and (MONOCHROME) {}
```

```css
@media (MIN-WIDTH: 700px) and (ORIENTATION: landscape) {}
```
