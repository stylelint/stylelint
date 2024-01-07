# selector-max-id

Limit the number of ID selectors in a selector.

<!-- prettier-ignore -->
```css
    #foo {}
/** ↑
 * This type of selector */
```

This rule resolves nested selectors before counting the number of ID selectors. Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

The `:not()` pseudo-class is also evaluated separately. The rule processes the argument as if it were an independent selector, and the result does not count toward the total for the entire selector.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`int`: Maximum universal selectors allowed.

For example, with `2`:

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
#foo #bar #baz {}
```

<!-- prettier-ignore -->
```css
#foo #bar {
  & #baz {}
}
```

<!-- prettier-ignore -->
```css
#foo #bar {
  & > #bar {}
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
#foo {}
```

<!-- prettier-ignore -->
```css
#foo #bar {}
```

<!-- prettier-ignore -->
```css
.foo #foo {}
```

<!-- prettier-ignore -->
```css
#foo.foo #bar {}
```

<!-- prettier-ignore -->
```css
/* each selector in a selector list is evaluated separately */
#foo,
#baz #quux {}
```

<!-- prettier-ignore -->
```css
/* `#bar` is inside `:not()`, so it is evaluated separately */
#foo #bar:not(#baz) {}
```

## Optional secondary options

### `ignoreContextFunctionalPseudoClasses: ["/regex/", /regex/, "non-regex"]`

Ignore selectors inside of specified [functional pseudo-classes](https://drafts.csswg.org/selectors-4/#pseudo-classes) that provide [evaluation contexts](https://drafts.csswg.org/selectors-4/#specificity-rules).

Given:

```json
[":not", "/^:(h|H)as$/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:is(#foo) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:not(#foo) {}
```

<!-- prettier-ignore -->
```css
a:has(#foo) {}
```

### `includeContextFunctionalPseudoClasses: ["/regex/", /regex/, "non-regex"]`

Include selectors inside of specified functional pseudo-classes in the check.

This option has a higher precedence than `ignoreContextFunctionalPseudoClasses`.

Given:

```json
[":--foo"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:--foo(#foo) {}
```

<!-- prettier-ignore -->
```css
:--foo(#foo #bar #baz) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:--foo { --fizz: 1px;}
```

<!-- prettier-ignore -->
```css
:-webkit-any(#foo) {}
```

This option has a higher presedence than `ignoreContextFunctionalPseudoClasses`.

For example, given if maximum selectors allowed are 2 and `:not` is included in `ignoreContextFunctionalPseudoClasses` and `includeContextFunctionalPseudoClasses`:

```json
[':not', /^:(glob|loc)al/, ':webkit-any']
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:webkit-any(#foo #bar #baz) {}
```

<!-- prettier-ignore -->
```css
a:not(#foo #bar #bazz) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:local { foo: 1px; } {}
```

<!-- prettier-ignore -->
```css
:-webkit-any(#foo #bar) {}
```

<!-- prettier-ignore -->
```css
#foo :global(#bazz #fizz) :local(#bar) {}
```
