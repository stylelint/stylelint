# custom-property-no-outside-root

***Deprecated: this rule is outside the scope of stylelint's functionality. See [the release planning docs](https://stylelint.io/user-guide/release-planning/) for details.***

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
