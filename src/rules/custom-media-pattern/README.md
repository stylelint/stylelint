# custom-media-pattern

Specify pattern of custom media query names.

```css
@custom-media --narrow-window (max-width: 30em);
/**                 ↑
 * The pattern of this */
```

## Options

`regex`

### E.g. `/foo-.+/`

The following patterns are considered warnings:

```css
@custom-media --big-dog (min-width: 30em);
```

The following patterns are *not* considered warnings:

```css
@custom-media --foo-big-dog (min-width: 30em);
```
