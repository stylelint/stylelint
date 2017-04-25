# selector-no-id

Disallow id selectors.

```css
    #foo {}
/** ↑
 * This type of selector */
```

## Options

### `true`

The following patterns are considered violations:

```css
#foo {}
```

```css
.bar > #foo {}
```

```css
#foo.bar {}
```

The following patterns are *not* considered violations:

```css
a {}
```

```css
.foo {}
```

```css
[foo] {}
```
