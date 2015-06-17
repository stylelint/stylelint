# custom-property-pattern

Specify pattern of custom properties.

```css
    a { --foo-bar: 1px; }
/**        ↑ 
 * The pattern of this */
```

## Options

`regex`

### E.g. `/foo-.+/`

The following patterns are considered warnings:

```css
:root { --boo-bar: 0; }
```

The following patterns are *not* considered warnings:

```css
:root { --foo-bar: 0; }
```
