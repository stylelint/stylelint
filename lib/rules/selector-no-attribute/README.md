# selector-no-attribute

Disallow attribute selectors.

```css
    [rel="external"] {}
/** ↑
 * This type of selector */
```

## Options

### `true`

The following patterns are considered violations:

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

The following patterns are *not* considered violations:

```css
a {}
```

```css
.foo {}
```

```css
#bar {}
```
