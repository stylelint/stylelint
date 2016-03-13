# custom-media-pattern

Specify a pattern for custom media query names.

```css
@custom-media --narrow-window (max-width: 30em);
/**             ↑
 * The pattern of this */
```

## Options

`regex` or `string`

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

### E.g. `/foo-.+/`

The following patterns are considered warnings:

```css
@custom-media --big-dog (min-width: 30em);
```

The following patterns are *not* considered warnings:

```css
@custom-media --foo-big-dog (min-width: 30em);
```
