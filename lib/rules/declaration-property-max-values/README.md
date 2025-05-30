# declaration-property-max-values

Limit the number of values for a list of properties within declarations.

## Options

### `Object<string, number>`

```json
{ "unprefixed-property-name": 0 }
```

Specify pairs of a property and a max value. In practice, you should specify any positive integers as max values.

You can specify a regex for a property name, such as `{ "/^margin/": 0 }`.

Given:

```json
{
  "declaration-property-max-values": {
    "border": 2,
    "/^margin/": 1
  }
}
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
