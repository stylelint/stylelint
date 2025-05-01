# custom-property-pattern

Specify a pattern for custom properties.

<!-- prettier-ignore -->
```css
a { --foo-: 1px; }
/**   ↑
 * The pattern of this */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

A string will be translated into a regular expression like `new RegExp(yourString)`, so make sure to escape it properly. Alternatively, a regular expression literal in JavaScript is available, such as `/yourPattern/`.

Given the string:

```json
{
  "custom-property-pattern": "foo-.+"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:root { --boo-bar: 0; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:root { --foo-bar: 0; }
```
