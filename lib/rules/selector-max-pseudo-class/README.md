# selector-max-pseudo-class

Limit the number of pseudo-classes in a selector.

<!-- prettier-ignore -->
```css
.foo .bar:first-child:hover {}
/*       ↑           ↑
         ↑           ↑
         1           2 -- this selector contains two pseudo-classes */
```

Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum pseudo-classes allowed.

Given:

```json
{
  "selector-max-pseudo-class": 1
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:first-child:focus {}
```

<!-- prettier-ignore -->
```css
.foo .bar:first-child:hover {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
a:first-child {}
```

<!-- prettier-ignore -->
```css
.foo .bar:first-child {}
```
