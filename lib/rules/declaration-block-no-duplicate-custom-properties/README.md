# declaration-block-no-duplicate-custom-properties

Disallow duplicate custom properties within declaration blocks.

<!-- prettier-ignore -->
```css
a { --custom-property: pink; --custom-property: orange; }
/** ↑                        ↑
 * These duplicated custom properties */
```

This rule is case-sensitive.

## Options

### `true`

```json
{
  "declaration-block-no-duplicate-custom-properties": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { --custom-property: pink; --custom-property: orange; }
```

<!-- prettier-ignore -->
```css
a { --custom-property: pink; background: orange; --custom-property: orange }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { --custom-property: pink; }
```

<!-- prettier-ignore -->
```css
a { --custom-property: pink; --cUstOm-prOpErtY: orange; }
```

## Optional secondary options

### `ignoreProperties`

```json
{ "ignoreProperties": ["array", "of", "properties", "/regex/"] }
```

Ignore duplicates of specific properties.

Given:

```json
{
  "declaration-block-no-duplicate-custom-properties": [
    true,
    { "ignoreProperties": ["--custom-property", "/ignored/"] }
  ]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { --another-custom-property: 1; --another-custom-property: 1; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { --custom-property: 1; --custom-property: 1; }
```

<!-- prettier-ignore -->
```css
a { --custom-ignored-property: 1; --custom-ignored-property: 1; }
```
