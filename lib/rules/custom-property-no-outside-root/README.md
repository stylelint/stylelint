# custom-property-no-outside-root

***Deprecated: use the community [`stylelint-suitcss`](https://github.com/suitcss/stylelint-suitcss) plugin pack.***

Disallow custom properties outside of `:root` rules.

```css
    a { --foo: 1px; }
/** ↑   ↑
 * These selectors and these types of custom properties */
```

## Options

### `true`

The following patterns are considered violations:

```css
a { --foo: 1px; }
```

```css
:root, a { --foo: 1px; }
```

The following patterns are *not* considered violations:

```css
:root { --foo: 1px; }
```
