# declaration-property-value-no-unknown

Disallow unknown values for properties within declarations.

<!-- prettier-ignore -->
```css
a { top: unknown; }
/** ↑    ↑
 * property and value pairs like these */
```

This rule considers values for properties defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what value syntax is known for a property, and use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property to extend it.

This rule checks property values. You can use [`at-rule-descriptor-value-no-unknown`](../at-rule-descriptor-value-no-unknown/README.md) to disallow unknown values for descriptors within at-rules.

> [!WARNING]
> This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

> [!NOTE]
> When using this rule, we recommend turning off these overlapping rules or configuring them to ignore the overlaps:
>
> - [`color-no-invalid-hex`](../color-no-invalid-hex/README.md)
> - [`function-linear-gradient-no-nonstandard-direction`](../function-linear-gradient-no-nonstandard-direction/README.md)
> - [`function-no-unknown`](../function-no-unknown/README.md)
> - [`string-no-newline`](../string-no-newline/README.md)
> - [`unit-no-unknown`](../unit-no-unknown/README.md)

Prior art:

- [stylelint-csstree-validator](https://www.npmjs.com/package/stylelint-csstree-validator)

## Options

### `true`

```json
{
  "declaration-property-value-no-unknown": true
}
```

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

### `ignoreProperties`

```json
{
  "ignoreProperties": { "property-name": ["array", "of", "values", "/regex/"] }
}
```

Ignore the specified property and value pairs. Keys in the object indicate property names.

You can specify a regex for a property name, such as `{ "/^margin/": [] }`.

Given:

```json
{
  "declaration-property-value-no-unknown": [
    true,
    {
      "ignoreProperties": {
        "top": ["unknown"],
        "/^margin-/": ["/^--foo/"],
        "padding": ["/.+/"],
        "/.+/": ["--unknown-value"]
      }
    }
  ]
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

### `propertiesSyntax`

> [!WARNING]
> We will remove this option in the next major release. Use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property instead.

```json
{ "propertiesSyntax": { "property": "syntax" } }
```

Extend or alter the properties syntax dictionary. [CSS Value Definition Syntax](https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md) is used to define a value's syntax. If a definition starts with `|` it is added to the [existing definition value](https://csstree.github.io/docs/syntax/) if any.

Given:

```json
{
  "declaration-property-value-no-unknown": [
    true,
    { "propertiesSyntax": { "size": "<length-percentage>" } }
  ]
}
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

### `typesSyntax`

> [!WARNING]
> We will remove this option in the next major release. Use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property instead.

```json
{ "typesSyntax": { "type": "syntax" } }
```

Extend or alter the types syntax dictionary. [CSS Value Definition Syntax](https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md) is used to define a value's syntax. If a definition starts with `|` it is added to the [existing definition value](https://csstree.github.io/docs/syntax/) if any.

Types are something like a preset which allows you to reuse a definition across other definitions. So, you'll likely want to also use the `propertiesSyntax` option when using this option.

Given:

```json
{
  "declaration-property-value-no-unknown": [
    true,
    {
      "propertiesSyntax": { "top": "| <--foo()>" },
      "typesSyntax": { "--foo()": "--foo( <length-percentage> )" }
    }
  ]
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
