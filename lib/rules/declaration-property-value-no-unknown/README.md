# declaration-property-value-no-unknown

Disallow unknown values for properties within declarations.

<!-- prettier-ignore -->
```css
a { top: unknown; }
/** ↑    ↑
 * property and value pairs like these */
```

This rule considers values for properties defined within the CSS specifications to be known. You can use the `propertiesSyntax`, `typesSyntax`, `atRulesSyntax`, and `cssWideKeywords` secondary options to extend the syntax.

This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as Sass or Less, as they have their own syntaxes.

This rule is experimental with some false negatives that we'll patch in minor releases.

It sometimes overlaps with:

- [`color-no-invalid-hex`](../color-no-invalid-hex/README.md)
- [`function-no-unknown`](../function-no-unknown/README.md)
- [`string-no-newline`](../string-no-newline/README.md)
- [`unit-no-unknown`](../unit-no-unknown/README.md)

If duplicate problems are flagged, you can turn off the corresponding rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: red; }
```

<!-- prettier-ignore -->
```css
a { top: unknown; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: 0; }
```

<!-- prettier-ignore -->
```css
a { top: var(--foo); }
```

## Optional secondary options

### `ignoreProperties: { "property": ["/regex/", /regex/, "non-regex"]|"/regex/"|/regex/|"non-regex" }`

Ignore the specified property and value pairs. Keys in the object indicate property names. If a string in the object is surrounded with `"/"`, it's interpreted as a regular expression. For example, `"/.+/"` matches any strings.

Given:

```json
{
  "top": ["unknown"],
  "/^margin-/": "/^--foo/",
  "padding": "/.+/",
  "/.+/": "--unknown-value"
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: unknown; }
```

<!-- prettier-ignore -->
```css
a { margin-top: --foo-bar; }
```

<!-- prettier-ignore -->
```css
a { padding: invalid; }
```

<!-- prettier-ignore -->
```css
a { width: --unknown-value; }
```

### `propertiesSyntax: { property: syntax }`

Extend or alter the properties syntax dictionary. [CSS Value Definition Syntax](https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md) is used to define a value's syntax. If a definition starts with `|` it is added to the [existing definition value](https://csstree.github.io/docs/syntax/) if any.

Given:

```json
{ "size": "<length-percentage>" }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { size: 0; }
```

<!-- prettier-ignore -->
```css
a { size: 10px; }
```

### `typesSyntax: { type: syntax }`

Extend or alter the types syntax dictionary. [CSS Value Definition Syntax](https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md) is used to define a value's syntax. If a definition starts with `|` it is added to the [existing definition value](https://csstree.github.io/docs/syntax/) if any.

Types are something like a preset which allows you to reuse a definition across other definitions. So, you'll likely want to also use the `propertiesSyntax` option when using this option.

Given:

```json
{
  "propertiesSyntax": { "top": "| <--foo()>" },
  "typesSyntax": { "--foo()": "--foo( <length-percentage> )" }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: --foo(0); }
```

<!-- prettier-ignore -->
```css
a { top: --foo(10px); }
```

### `atRulesSyntax: { "at-rule": { "prelude": "syntax", "descriptors": { "descriptor": "syntax" } } }`

Extend or alter the at-rules syntax dictionary. This option allows you to define custom at-rules or modify existing ones by specifying their expected syntax. Both `prelude` and `descriptors` are optional. The `prelude` is the part of the at-rule that comes after the at-rule name and before the block (if any). The `descriptors` are like properties specific to the at-rule, and are defined similarly to CSS properties.

[CSS Value Definition Syntax](https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md) is used to define the syntax of at-rules, their preludes, and descriptors. If a definition starts with `|` it is added to the existing definition value if any. See the [CSS syntax reference](https://csstree.github.io/docs/syntax/) for default definitions.

Given:

```json
{
  "atRulesSyntax": {
    "example": {
      "prelude": "<custom-ident>",
      "descriptors": {
        "foo": "<number>",
        "bar": "<color>"
      }
    }
  }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@example my-ident { foo: 42; bar: red; }
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@example 10px { foo: 42; bar: red; }
```

<!-- prettier-ignore -->
```css
@example my-ident { foo: red; bar: 42; }
```

**Explanation:**

- The `atRulesSyntax` option allows you to define or modify at-rules and their syntax.
- In the example above, we define a custom at-rule `@example` with a `prelude` that must be a `<custom-ident>` (an identifier), and descriptors `foo` and `bar` with respective syntax `<number>` and `<color>`.
- The first two patterns are acceptable because they conform to the defined syntax.
- The latter two patterns are considered problems because they do not match the expected syntax.

### `cssWideKeywords: [ "keyword", ... ]`

Extend the list of CSS-wide keywords. By default, the rule considers standard CSS-wide keywords like `inherit`, `initial`, `unset`, etc. This option allows you to add custom global keywords that should be accepted as valid property values.

Given:

```json
{ "cssWideKeywords": ["my-global-value"] }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { width: my-global-value; }
```

<!-- prettier-ignore -->
```css
a { color: my-global-value; }
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { width: unknown-value; }
```

<!-- prettier-ignore -->
```css
a { color: invalid-keyword; }
```

## Examples

### Using `atRulesSyntax`

You can define custom at-rules and their expected syntax using the `atRulesSyntax` option.

Given:

```json
{
  "atRulesSyntax": {
    "example": {
      "prelude": "<custom-ident>",
      "descriptors": {
        "foo": "<number>",
        "bar": "<color>"
      }
    }
  }
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@example my-ident { foo: 42; bar: red; }
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@example my-ident { foo: red; bar: 42; }
```

### Using `cssWideKeywords`

You can extend the list of recognized CSS-wide keywords using the `cssWideKeywords` option.

Given:

```json
{ "cssWideKeywords": ["my-global-value"] }
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a { color: my-global-value; }
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
a { color: invalid-keyword; }
```
