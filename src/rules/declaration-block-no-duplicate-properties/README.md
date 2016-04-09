# declaration-block-no-duplicate-properties

Disallow duplicate properties within declaration blocks.

```css
a { color: pink; color: orange; }
/** ↑            ↑
 * These duplicated properties */
```

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

The following patterns are considered warnings:

```css
a { color: pink; color: orange; }
```

```css
a { color: pink; background: orange; color: orange }
```

The following patterns are *not* considered warnings:

```css
a { color: pink; }
```

```css
a { color: pink; background: orange; }
```

## Options

### `ignore: ["consecutive-duplicates"]`

Ignore consecutive duplicated properties.

They can prove to be useful fallbacks for older browsers.

The following patterns are considered warnings:

```css
p {
  font-size: 16px;
  font-weight: 400;
  font-size: 1rem;
}
```

The following patterns are *not* considered warnings:

```css
p {
  font-size: 16px;
  font-size: 1rem;
  font-weight: 400;
}
```
