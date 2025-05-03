# declaration-empty-line-before

Require or disallow an empty line before declarations.

<!-- prettier-ignore -->
```css
a {
  --foo: pink;
             /* ← */
  top: 15px; /* ↑ */
}            /* ↑ */
/**             ↑
 *      This line */
```

This rule only applies to standard property declarations. Use the [`custom-property-empty-line-before`](../custom-property-empty-line-before/README.md) rule for custom property declarations.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"always"`

```json
{
  "declaration-empty-line-before": "always"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  --foo: pink;
  top: 5px;
}
```

<!-- prettier-ignore -->
```css
a {
  bottom: 15px;
  top: 5px;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  --foo: pink;

  top: 5px;
}
```

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;

  top: 5px;
}
```

### `"never"`

```json
{
  "declaration-empty-line-before": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  --foo: pink;

  bottom: 15px;
}
```

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;

  top: 5px;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  --foo: pink;
  bottom: 15px;
}
```

<!-- prettier-ignore -->
```css
a {
  bottom: 15px;
  top: 5px;
}
```

## Optional secondary options

### `except`

```json
{ "except": ["array", "of", "options"] }
```

#### `"after-comment"`

Reverse the primary option for declarations that follow a comment.

Shared-line comments do not trigger this option.

Given:

```json
{
  "declaration-empty-line-before": ["always", { "except": ["after-comment"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  /* comment */

  top: 5px;
}
```

<!-- prettier-ignore -->
```css
a {
  bottom: 5px; /* comment */
  top: 5px;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  /* comment */
  top: 5px;
}

```

<!-- prettier-ignore -->
```css
a {
  bottom: 5px; /* comment */

  top: 5px;
}

```

#### `"after-declaration"`

Reverse the primary option for declarations that follow another declaration.

Shared-line comments do not affect this option.

Given:

```json
{
  "declaration-empty-line-before": [
    "always",
    { "except": ["after-declaration"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;

  top: 5px;
}
```

<!-- prettier-ignore -->
```css
a {

  bottom: 15px; /* comment */

  top: 5px;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;
  top: 5px;
}
```

<!-- prettier-ignore -->
```css
a {

  bottom: 15px; /* comment */
  top: 5px;
}
```

#### `"first-nested"`

Reverse the primary option for declarations that are nested and the first child of their parent node.

Given:

```json
{
  "declaration-empty-line-before": ["always", { "except": ["first-nested"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;

  top: 5px;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  bottom: 15px;

  top: 5px;
}
```

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"after-comment"`

Ignore declarations that follow a comment.

Given:

```json
{
  "declaration-empty-line-before": ["always", { "ignore": ["after-comment"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  /* comment */
  bottom: 15px;
}
```

#### `"after-declaration"`

Ignore declarations that follow another declaration.

Given:

```json
{
  "declaration-empty-line-before": [
    "always",
    { "ignore": ["after-declaration"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;
  top: 15px;
}
```

<!-- prettier-ignore -->
```css
a {

  bottom: 15px;

  top: 15px;
}
```

<!-- prettier-ignore -->
```css
a {

  color: orange;
  text-decoration: none;

  bottom: 15px;
  top: 15px;
}
```

#### `"first-nested"`

Ignore declarations that are nested and the first child of their parent node.

Given:

```json
{
  "declaration-empty-line-before": ["always", { "ignore": ["first-nested"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  bottom: 15px;

  top: 5px;
}
```

#### `"inside-single-line-block"`

Ignore declarations that are inside single-line blocks.

Given:

```json
{
  "declaration-empty-line-before": [
    "always",
    { "ignore": ["inside-single-line-block"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { bottom: 15px; top: 5px; }
```
