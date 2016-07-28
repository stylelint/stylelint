import ignore from "ignore"
import multimatch from "multimatch"
import path from "path"

export default function getIgnoredFilter(ignorePatterns, ignoreFiles) {
  const ignorePatternsFilter = ignore().add(ignorePatterns).createFilter()

  return (file) => {
    const filepathRelativeToCwd = path.relative(process.cwd(), file)
    return !(
      (ignorePatternsFilter && !ignorePatternsFilter(filepathRelativeToCwd))
      || (ignoreFiles && multimatch(file, ignoreFiles).length)
    )
  }
}
