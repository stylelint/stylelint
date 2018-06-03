# selector-pseudo-class-focus

Checks the presence of a pseudo-class for selectors with `:hover`.

```css
    a:hover, a:focus { }
```

This rule considers :focus pseudo-class selector defined in the CSS Specifications.

## Options

### true

The following pattern are considered violations:

```css
    a:hover { }
```

The following patterns are *not* considered violations:

```css
    a:hover, a:focus { }
```

```css
     a:focus { }
```

```css
    a:hover { }
    a:focus { }
```
