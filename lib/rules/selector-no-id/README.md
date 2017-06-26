# selector-no-id

***Deprecated: Instead use the [`selector-max-id`](../selector-max-id/README.md) rule with `0` as its primary option.***

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
