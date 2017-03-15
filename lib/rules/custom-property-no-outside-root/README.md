# custom-property-no-outside-root

***Deprecated: See [CHANGELOG](../../../CHANGELOG.md).***

Disallow custom properties outside of `:root` rules.

```css
    a { --foo: 1px; }
/** ↑   ↑
 * These selectors and these types of custom properties */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a { --foo: 1px; }
```

```css
:root, a { --foo: 1px; }
```

The following patterns are *not* considered warnings:

```css
:root { --foo: 1px; }
```
