# selector-no-id

Disallow id selectors.

```css
    #foo {}
/** ↑
 * This type of selector */
```

## Options

### `true`

The following patterns are considered warnings:

```css
#foo {}
```

```css
.bar > #foo {}
```

```css
#foo.bar {}
```

The following patterns are *not* considered warnings:

```css
a {}
```

```css
.foo {}
```

```css
[foo] {}
```
