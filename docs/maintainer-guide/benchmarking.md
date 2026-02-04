# Benchmarking

[Performance](../about/vision.md#performant) is one of the key aspects of [our vision](../about/vision.md). The more people who are aware of and use our benchmarking tools when contributing to Stylelint, the better.

There are two benchmarking tools:

- [Rule benchmarking](#rule-benchmarking), for measuring the performance of individual rules.
- [System benchmarking](#system-benchmarking), for measuring overall performance across realistic workspaces.

## Rule benchmarking

You can run a benchmark on any given rule with any valid config using:

```shell
npm run benchmark-rule -- ruleName ruleOptions [config]
```

If the `ruleOptions` argument is anything other than a string or a boolean, it must be valid JSON wrapped in quotation marks.

```shell
npm run benchmark-rule -- value-keyword-case lower
```

```shell
npm run benchmark-rule -- value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]'
```

If the `config` argument is specified, the same procedure would apply:

```shell
npm run benchmark-rule -- value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]' '{"fix": true}'
```

The script loads Bootstrap's CSS (from its CDN) and runs it through the configured rule.

It will end up printing some simple stats like this:

```shell
Warnings: 1441
Mean: 74.17598357142856 ms
Deviation: 16.63969674310928 ms
```

When writing new rules or refactoring existing rules, use these measurements to determine the efficiency of your code.

A Stylelint rule can repeat its core logic many, many times (e.g. checking every value node of every declaration in a vast CSS codebase). So it's worth paying attention to performance and doing what we can to improve it!

**Improving the performance of a rule is a great way to contribute if you want a quick little project.** Try picking a rule and seeing if there's anything you can do to speed it up.

Make sure you include benchmark measurements in your pull request!

## System benchmarking

The system benchmarking tool measures overall Stylelint performance across realistic workspaces of varying sizes. It tests both the API and CLI modes to help identify performance regressions.

### Quick start

```shell
# Run benchmarks and save a baseline result.
npm run benchmark -- --save=baseline.json

# Make changes or switch branches, then compare.
npm run benchmark -- --compare=baseline.json
```

If you already have two benchmark files, you can compare them without running any benchmarks:

```shell
npm run benchmark -- --compare=baseline.json --compare-to=after.json
```

To view a saved benchmark file:

```shell
npm run benchmark -- --show=baseline.json
```

### Options

| Option                              | Description                                                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sizes=small,medium,large,xlarge` | Which workspace sizes to test.                                                                                                                        |
| `--iterations=N`                    | Measured iterations per benchmark. Default is 10.                                                                                                     |
| `--warmup=N`                        | Warmup iterations to discard. Default is 2.                                                                                                           |
| `--modes=api,cli`                   | Comma-separated list of modes to test. Running both modes, which is the default, is intended to help identify performance regressions in either mode. |
| `--save=FILE`                       | Save results to JSON.                                                                                                                                 |
| `--show=FILE`                       | Display results from a saved JSON file.                                                                                                               |
| `--compare=FILE`                    | Compare against baseline.                                                                                                                             |
| `--compare-to=FILE`                 | Compare `--compare` file against this file directly without running benchmarks.                                                                       |
| `--benchmark-only`                  | Skip workspace generation.                                                                                                                            |

### Interpreting results

#### Summary

```text
──────────────────────────────────────────────────────────────────────────────────────────
Size      Files   API time    ±CV    /file     CLI time    ±CV    /file
──────────────────────────────────────────────────────────────────────────────────────────
Small     20      32.96ms     32.1%  1.65ms    331.55ms    15.2%  16.58ms
Medium    100     191.33ms    10.1%  1.91ms    551.01ms    12.2%  5.51ms
Large     500     1.33s       3.7%   2.66ms    1.77s       7.1%   3.55ms
X-Large   1000    4.79s       9.4%   4.79ms    5.72s       3.4%   5.72ms
──────────────────────────────────────────────────────────────────────────────────────────
```

- **Time**: mean with the top and bottom 10% of iterations removed for stability.
- **±CV**: coefficient of variation, which measures how consistent the results are. Lower is better.
- **/file**: time per file. If this increases significantly for larger workspaces, it may indicate a performance issue. Higher values at small sizes can be explained by fixed overheads, such as process startup time.

#### Comparisons

```text
────────────────────────────────────────────────────────────────────────────
Size      Baseline    Current     Diff        Change    Status
────────────────────────────────────────────────────────────────────────────
Small     265.98ms    331.55ms    +65.57ms    +24.7%    ✗ Slower
Medium    563.36ms    551.01ms    12.35ms     -2.2%     ≈ Same
Large     1.81s       1.77s       39.93ms     -2.2%     ≈ Same
X-Large   5.63s       5.72s       +97.60ms    +1.7%     ≈ Same
────────────────────────────────────────────────────────────────────────────
```

The significance threshold is dynamic based on the coefficient of variation (CV) of both baseline and current runs. If the CV is high, indicating noisy measurements, the threshold is raised to avoid false positives.

- **✓ Faster**: improvement beyond the CV-based threshold.
- **✗ Slower**: regression beyond the CV-based threshold.
- **≈ Same**: within measurement noise.

### Workspace sizes

| Size   | Files | Rules | Overrides | Plugins | Simulates                                     |
| ------ | ----- | ----- | --------- | ------- | --------------------------------------------- |
| small  | 20    | 10    | 0         | 0       | Personal site or small library                |
| medium | 100   | 25    | 10        | 2       | Moderately-sized product or component library |
| large  | 500   | 50    | 50        | 5       | Enterprise app or design system               |
| xlarge | 1000  | 80    | 200       | 8       | Huge, sprawling monorepo                      |

### Tips

- The `xlarge` size is useful for stress testing, but takes longer to run. For faster feedback, use `--sizes=small,medium,large`.
- Warmup iterations are discarded to account for JIT compilation and cache warming.
- The trimmed mean removes the top and bottom 10% of iterations to reduce impact of outliers.
- A high CV of over 15% indicates noisy measurements. Consider increasing `--iterations` or reducing system load.
- For the most reliable results, close other applications and avoid running on battery power.
