# custom-property-empty-line-before

Require or disallow an empty line before custom properties.

<!-- prettier-ignore -->
```css
a {
  top: 10px;
                          /* ← */
  --foo: pink;            /* ↑ */
}                         /* ↑ */
/**                          ↑
 *                   This line */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"always"`

```json
{
  "custom-property-empty-line-before": "always"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  top: 10px;
  --foo: pink;
  --bar: red;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  top: 10px;

  --foo: pink;

  --bar: red;
}
```

### `"never"`

```json
{
  "custom-property-empty-line-before": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  top: 10px;

  --foo: pink;

  --bar: red;
}
```

<!-- prettier-ignore -->
```css
a {

  --foo: pink;
  --bar: red;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  top: 10px;
  --foo: pink;
  --bar: red;
}
```

<!-- prettier-ignore -->
```css
a {
  --foo: pink;
  --bar: red;
}
```

## Optional secondary options

### `except`

```json
{ "except": ["array", "of", "keywords"] }
```

#### `"after-comment"`

Reverse the primary option for custom properties that follow a comment.

Shared-line comments do not trigger this option.

Given:

```json
{
  "custom-property-empty-line-before": [
    "always",
    { "except": ["after-comment"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {

  --foo: pink;
  /* comment */

  --bar: red;
}
```

<!-- prettier-ignore -->
```css
a {

  --foo: pink; /* comment */
  --bar: red;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {

  --foo: pink;
  /* comment */
  --bar: red;
}
```

<!-- prettier-ignore -->
```css
a {

  --foo: pink; /* comment */

  --bar: red;
}
```

#### `"after-custom-property"`

Reverse the primary option for custom properties that follow another custom property.

Shared-line comments do not affect this option.

Given:

```json
{
  "custom-property-empty-line-before": [
    "always",
    { "except": ["after-custom-property"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {

  --foo: pink;

  --bar: red;
}
```

<!-- prettier-ignore -->
```css
a {

  --foo: pink; /* comment */

  --bar: red;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {

  --foo: pink;
  --bar: red;
}
```

<!-- prettier-ignore -->
```css
a {

  --foo: pink; /* comment */
  --bar: red;
}
```

#### `"first-nested"`

Reverse the primary option for custom properties that are nested and the first child of their parent node.

Given:

```json
{
  "custom-property-empty-line-before": [
    "always",
    { "except": ["first-nested"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {

  --foo: pink;

  --bar: red;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  --foo: pink;

  --bar: red;
}
```

### `ignore: ["after-comment", "first-nested", "inside-single-line-block"]`

```json
{ "ignore": ["array", "of", "keywords"] }
```

#### `"after-comment"`

Ignore custom properties that follow a comment.

Given:

```json
{
  "custom-property-empty-line-before": [
    "always",
    { "except": ["after-comment"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  /* comment */
  --foo: pink;
}
```

#### `"first-nested"`

Ignore custom properties that are nested and the first child of their parent node.

Given:

```json
{
  "custom-property-empty-line-before": [
    "always",
    { "except": ["first-nested"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  --foo: pink;

  --bar: red;
}
```

#### `"inside-single-line-block"`

Ignore custom properties that are inside single-line blocks.

Given:

```json
{
  "custom-property-empty-line-before": [
    "always",
    { "except": ["inside-single-line-block"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { --foo: pink; --bar: red; }
```

See also [how to configure rules](../../../docs/user-guide/configure.md#rules).
