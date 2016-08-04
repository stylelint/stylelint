export default [
  {
    methodName: "optionsHaveIgnoredAtRule",
    newMethodName: "optionsMatches",
    haystackKey: "ignoreAtRules",
    needleKey: "name",
  },
  {
    methodName: "optionsHaveIgnoredProperty",
    newMethodName: "optionsMatches",
    haystackKey: "ignoreProperties",
    needleKey: false,
  },
  {
    methodName: "optionsHaveIgnoredPseudoClass",
    newMethodName: "optionsMatches",
    haystackKey: "ignorePseudoClasses",
    needleKey: "value.slice(1)",
  },
  {
    methodName: "optionsHaveIgnoredPseudoElement",
    newMethodName: "optionsMatches",
    haystackKey: "ignorePseudoElements",
    needleKey: "value.slice(2)",
  },
  {
    methodName: "optionsHaveIgnoredType",
    newMethodName: "optionsMatches",
    haystackKey: "ignoreTypes",
    needleKey: "value",
  },
  {
    methodName: "optionsHaveIgnoredUnit",
    newMethodName: "optionsMatches",
    haystackKey: "ignoreUnits",
    needleKey: false,
  },
  {
    methodName: "optionsHaveException",
    newMethodName: "optionsMatches",
    haystackKey: "except",
    needleKey: false,
  },
  {
    methodName: "optionsHaveIgnored",
    newMethodName: "optionsMatches",
    haystackKey: "ignore",
    needleKey: false,
  },
]
