# rule-empty-line-before

Require or disallow an empty line before rules.

<!-- prettier-ignore -->
```css
a {}
      /* ← */
b {}  /* ↑ */
/**      ↑
 * This line */
```

This rule ignores rules that are the very first node in a source.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"always"`

There _must always_ be an empty line before rules.

```json
{
  "rule-empty-line-before": "always"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {} b {}
```

<!-- prettier-ignore -->
```css
a {}
b {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}

b {}
```

### `"never"`

There _must never_ be an empty line before rules.

```json
{
  "rule-empty-line-before": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}

b {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {} b {}
```

<!-- prettier-ignore -->
```css
a {}
b {}
```

### `"always-multi-line"`

There _must always_ be an empty line before multi-line rules.

```json
{
  "rule-empty-line-before": "always-multi-line"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  color: red;
}
b {
  color: blue;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: red;
}

b {
  color: blue;
}
```

### `"never-multi-line"`

There _must never_ be an empty line before multi-line rules.

```json
{
  "rule-empty-line-before": "never-multi-line"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  color: red;
}

b {
  color: blue;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: red;
}
b {
  color: blue;
}
```

## Optional secondary options

### `except`

```json
{ "except": ["array", "of", "options"] }
```

#### `"after-rule"`

Reverse the primary option for rules that follow another rule.

Given:

```json
{
  "rule-empty-line-before": ["always", { "except": ["after-rule"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}

b {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
b {}
```

#### `"after-single-line-comment"`

Reverse the primary option for rules that follow a single-line comment.

Given:

```json
{
  "rule-empty-line-before": [
    "always",
    { "except": ["after-single-line-comment"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
/* comment */

a {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
/* comment */
a {}
```

#### `"inside-block-and-after-rule"`

Reverse the primary option for rules that are inside a block and follow another rule.

Given:

```json
{
  "rule-empty-line-before": [
    "always",
    { "except": ["inside-block-and-after-rule"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media {

  a {}

  b {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media {

  a {}
  b {}
}
```

#### `"inside-block"`

Reverse the primary option for rules that are inside a block.

Given:

```json
{
  "rule-empty-line-before": ["always", { "except": ["inside-block"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  color: red;

  & b {
    color: blue;
  }
}

```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: red;
  & b {
    color: blue;
  }
}
```

#### `"first-nested"`

Reverse the primary option for rules that are nested and the first child of their parent node.

Given:

```json
{
  "rule-empty-line-before": ["always", { "except": ["first-nested"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media {

  a {}

  b {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media {
  a {}

  b {}
}
```

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"after-comment"`

Ignore rules that follow a comment.

Given:

```json
{
  "rule-empty-line-before": ["always", { "ignore": ["after-comment"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
/* comment */
a {}
```

#### `"first-nested"`

Ignore rules that are nested and the first child of their parent node.

Given:

```json
{
  "rule-empty-line-before": ["always", { "ignore": ["first-nested"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media {
  a {}

  b {}
}
```

#### `"inside-block"`

Ignore rules that are inside a block.

Given:

```json
{
  "rule-empty-line-before": ["always", { "ignore": ["inside-block"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media {
  a {}
}
```

<!-- prettier-ignore -->
```css
@media {
  a {}
  b {}
}
```
