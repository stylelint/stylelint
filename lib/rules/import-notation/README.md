# import-notation

Specify string or URL notation for `@import` rules.

<!-- prettier-ignore -->
```css
@import url("x.jpg");
/**     ↑
 *      This notation */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the import value and its expected notation.

## Options

### `"string"`

`@import` rules _must always_ use string notation.

```json
{
  "import-notation": "string"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import url(foo.css);
```

<!-- prettier-ignore -->
```css
@import url('foo.css');
```

<!-- prettier-ignore -->
```css
@import url("foo.css");
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@import "foo.css";
```

### `"url"`

`@import` rules _must always_ use URL notation.

```json
{
  "import-notation": "url"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import 'foo.css';
```

<!-- prettier-ignore -->
```css
@import "foo.css";
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import url(foo.css);
```

<!-- prettier-ignore -->
```css
@import url('foo.css');
```

<!-- prettier-ignore -->
```css
@import url("foo.css");
```
