# selector-no-attribute

Disallow attribute selectors.

```css
    [rel="external"] {}
/** ↑
 * This type of selector */
```

## Options

### `true`

The following patterns are considered warnings:

```css
[foo] {}
```

```css
[rel="external"] {}
```

```css
a,
[type="text"] {}
```

```css
a > [foo] {}
```

The following patterns are *not* considered warnings:

```css
a {}
```

```css
.foo {}
```

```css
#bar {}
```
