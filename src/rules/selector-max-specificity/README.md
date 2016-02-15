# selector-max-specificity

Control the specificity of selectors.

First define the maximum allowable selector specificity as computed by the [W3C specificity calculator](https://www.w3.org/TR/selectors/#specificity):

For example:

| inline | ID | Class | type
|---------|----|---------|-------
| 0 | 0 | 2 | 0

Set this as a 4 digit value in your Stylelint configuration:

````
"max-selector-specificity": 0020
````

Then any selectors that exceed that specificity e.g.

````
.thing .thing .thing {
    width: 100%;
}
````

Would fail with the message:

`"Expected ".thing .thing .thing" to have a specificity equal to or less than "0020""`