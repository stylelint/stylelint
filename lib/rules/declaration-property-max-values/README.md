# declaration-property-max-values

Limit the number of values for a list of properties within declarations.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`object`: `{ "unprefixed-property-name": int }`

If a property name is surrounded with `"/"` (e.g. `"/^margin/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^margin/` will match `margin`, `margin-top`, `margin-inline`, etc.

Given:

```json
{
  "border": 2,
  "/^margin/": 1,
},
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { border: 1px solid blue; }
```

<!-- prettier-ignore -->
```css
a { margin: 1px 2px; }
```

<!-- prettier-ignore -->
```css
a { margin-inline: 1px 2px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { border: 1px solid; }
```

<!-- prettier-ignore -->
```css
a { margin: 1px; }
```

<!-- prettier-ignore -->
```css
a { margin-inline: 1px; }
```
