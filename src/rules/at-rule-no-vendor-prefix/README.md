# at-rule-no-vendor-prefix

Disallow vendor prefixes for at-rules.

```css
    @-webkit-keyframes { 0% { top: 0; } }
/**  ↑
 * These prefixes */
```

## Options

### `true`

The following patterns are considered warnings:

```css
@-webkit-keyframes { 0% { top: 0; } }
```

```css
@-ms-viewport { orientation: landscape; }
```

The following patterns are *not* considered warnings:

```css
@keyframes { 0% { top: 0; } }
```

```css
@viewport { orientation: landscape; }
```
