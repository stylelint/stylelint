# declaration-property-max-values

Limit the number of values for a list of properties within declarations.

## Options

`object`: `{ "unprefixed-property-name": int }`

If a property name is surrounded with `"/"` (e.g. `"/^margin/"`), it is interpreted as a regular expression. This allows, for example, easy targeting of shorthands: `/^margin/` will match `margin`, `margin-top`, `margin-inline`, etc.

Given:

```json
{
  "border": 1,
  "/^margin/": 2,
  "padding": 3,
},
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
div { margin: 1px 2px 3px; }
```

<!-- prettier-ignore -->
```css
div { margin: 1px 2px 3px 4px; }
```

<!-- prettier-ignore -->
```css
div { margin-inline: 1px 2px 3px; }
```

<!-- prettier-ignore -->
```css
div { border: 1px solid blue; }
```

<!-- prettier-ignore -->
```css
div { padding: 1px 2px 3px 4px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div { margin: 0; }
```

<!-- prettier-ignore -->
```css
div { margin: 1px 2px; }
```

<!-- prettier-ignore -->
```css
div { margin: 1px 2px /* 3px */; }
```

<!-- prettier-ignore -->
```css
div { margin-inline: 1px 2px; }
```

<!-- prettier-ignore -->
```css
div { margin: ; }
```

<!-- prettier-ignore -->
```css
div { padding: 1px 2px 3px; }
```

<!-- prettier-ignore -->
```css
div { border: 1px; }
```
