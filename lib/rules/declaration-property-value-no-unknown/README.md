# declaration-property-value-no-unknown

Disallow unknown values for properties within declarations.

<!-- prettier-ignore -->
```css
a { top: unknown; }
/** ↑    ↑
 * property and value pairs like these */
```

This rule considers values for properties defined within the CSS specifications to be known. You can use the `propertiesSyntax` and `typesSyntax` secondary options to extend the syntax.

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
a { size: 10px }
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
