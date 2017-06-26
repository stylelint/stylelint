# selector-no-attribute

***Deprecated: Instead use the [`selector-max-attribute`](../selector-max-attribute/README.md) rule with `0` as its primary option.***

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
