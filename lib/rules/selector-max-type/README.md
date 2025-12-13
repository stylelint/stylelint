# selector-max-type

Limit the number of type selectors in a selector.

<!-- prettier-ignore -->
```css
    a {}
/** ↑
 * This type of selector */
```

Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum type selectors allowed.

Given:

```json
{
  "selector-max-type": 2
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
div a span {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div {}
```

<!-- prettier-ignore -->
```css
div a {}
```

<!-- prettier-ignore -->
```css
.foo div a {}
```

<!-- prettier-ignore -->
```css
div.foo a {}
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"child"`

Discount child type selectors.

Given:

```json
{
  "selector-max-type": [2, { "ignore": ["child"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div span > a {}
```

<!-- prettier-ignore -->
```css
#bar div span > a {}
```

#### `"compounded"`

Discount compounded type selectors -- i.e. type selectors chained with other selectors.

Given:

```json
{
  "selector-max-type": [2, { "ignore": ["compounded"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div span a.foo {}
```

<!-- prettier-ignore -->
```css
div span a#bar {}
```

#### `"custom-elements"`

Discount custom elements.

Given:

```json
{
  "selector-max-type": [2, { "ignore": ["custom-elements"] }]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
div a foo-bar {}
```

#### `"descendant"`

Discount descendant type selectors.

Given:

```json
{
  "selector-max-type": [2, { "ignore": ["descendant"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
.foo div span a {}
```

<!-- prettier-ignore -->
```css
#bar div span a {}
```

#### `"next-sibling"`

Discount next-sibling type selectors.

Given:

```json
{
  "selector-max-type": [2, { "ignore": ["next-sibling"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div a + span {}
```

<!-- prettier-ignore -->
```css
#bar + div + span + a + span {}
```

### `ignoreTypes`

```json
{ "ignoreTypes": ["array", "of", "types", "/regex/"] }
```

Given:

```json
{
  "selector-max-type": [2, { "ignoreTypes": ["/^my-/", "custom"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div a custom {}
```

<!-- prettier-ignore -->
```css
div a my-type {}
```

<!-- prettier-ignore -->
```css
div a my-other-type {}
```
