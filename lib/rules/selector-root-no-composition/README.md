# selector-root-no-composition

***Deprecated: instead use the community [`stylelint-suitcss`](https://github.com/suitcss/stylelint-suitcss) plugin pack***

Disallow the composition of `:root` in selectors.

```css
    a, :root {}
/** ↑  ↑
 * This type of composite selector */
```

## Options

### `true`

The following patterns are considered violations:

```css
a, :root {}
```

```css
:root + a {}
```

```css
html:root {}
```

The following patterns are *not* considered violations:

```css
:root {}
```
