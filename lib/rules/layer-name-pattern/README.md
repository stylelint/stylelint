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

`regex|string`

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

Given the string:

```json
"^[a-z][a-z0-9.-]*$"
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
@layer foo, bar {}
```

<!-- prettier-ignore -->
```css
@layer foo.bar {}
```

<!-- prettier-ignore -->
```css
@import "foo.css" layer(bar);
```
