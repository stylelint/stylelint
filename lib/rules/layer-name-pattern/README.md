# layer-name-pattern

Specify a pattern for layer names.

<!-- prettier-ignore -->
```css
@layer foo {}
/**    ↑
 * This layer name */
```

## Options

### `string`

Specify a regex string not surrounded with `"/"`.

Given:

```json
{
  "layer-name-pattern": "^[a-z][a-z0-9.-]*$"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@layer Foo;
```

<!-- prettier-ignore -->
```css
@layer foo.Bar {}
```

<!-- prettier-ignore -->
```css
@layer foo, Bar {}
```

<!-- prettier-ignore -->
```css
@import "foo.css" layer(Bar);
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@layer foo;
```

<!-- prettier-ignore -->
```css
@layer foo.bar {}
```

<!-- prettier-ignore -->
```css
@layer foo, bar {}
```

<!-- prettier-ignore -->
```css
@import "foo.css" layer(bar);
```
