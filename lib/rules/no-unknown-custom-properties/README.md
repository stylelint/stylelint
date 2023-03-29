# no-unknown-custom-properties

Disallow unknown custom properties.

<!-- prettier-ignore -->
```css
a { color: var(--foo); }
/**            ↑
 *             This custom property */

a { color: var(--foo, var(--bar)); }
/**                       ↑
 *                        And this one */
```

This rule considers custom properties defined within the same source to be known.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: var(--foo); }
```

<!-- prettier-ignore -->
```css
a { color: var(--foo, var(--bar)); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { --foo: #f00; color: var(--foo); }
```

<!-- prettier-ignore -->
```css
a { color: var(--foo, #f00); }
```

<!-- prettier-ignore -->
```css
a { --foo: #f00; color: var(--bar, var(--foo)); }
```

<!-- prettier-ignore -->
``` css
@property --foo { syntax: "<color>"; inherits: false; initial-value: #f00; }
a { color: var(--foo); }
```
