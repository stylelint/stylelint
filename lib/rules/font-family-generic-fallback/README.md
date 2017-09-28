# font-family-generic-fallback

Require a generic fallback to any font-family declaration.

```css
a { font-family: Arial, sans-serif; }
/**                        ↑
 * An example of generic family name */
```

This rule checks the `font` and `font-family` properties.

## Options

### `true`

The following patterns are considered violations:

```css
a { font-family: Helvetica, Arial, Verdana, Tahoma; }
```

```css
a { font: 1em/1.3 Arial; }
```

The following patterns are *not* considered violations:

```css
a { font-family: Times, serif; }
```

```css
a { font: 1em "Arial", sans-serif; }
```

```css
a { font: inherit; }
```
