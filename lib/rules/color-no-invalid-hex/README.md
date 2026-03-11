# color-no-invalid-hex

Disallow invalid hex colors.

<!-- prettier-ignore -->
```css
a { color: #y3 }
/**        ↑
 * This hex color */
```

Longhand hex colors can be either 6 or 8 (with alpha channel) hexadecimal characters. And their shorthand variants are 3 and 4 characters respectively.

> [!NOTE]
> We recommend only using this rule for CSS-like languages, such as SCSS and Less. For CSS, we recommend using these more capable and overlapping rules instead:
>
> - [`at-rule-descriptor-value-no-unknown`](../at-rule-descriptor-value-no-unknown/README.md)
> - [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md)

## Options

### `true`

```json
{
  "color-no-invalid-hex": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: #00; }
```

<!-- prettier-ignore -->
```css
a { color: #fff1az; }
```

<!-- prettier-ignore -->
```css
a { color: #12345aa; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: #000; }
```

<!-- prettier-ignore -->
```css
a { color: #000f; }
```

<!-- prettier-ignore -->
```css
a { color: #fff1a0; }
```

<!-- prettier-ignore -->
```css
a { color: #123450aa; }
```
