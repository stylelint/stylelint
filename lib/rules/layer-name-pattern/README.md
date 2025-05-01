# layer-name-pattern

Specify a pattern for layer names.

<!-- prettier-ignore -->
```css
@layer foo {}
/**    ↑
 * This layer name */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

A string will be translated into a regular expression like `new RegExp(yourString)`, so make sure to escape it properly. Alternatively, a regular expression literal in JavaScript is available, such as `/yourPattern/`.

Given the string:

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
