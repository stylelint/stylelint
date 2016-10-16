// A processor which returns an invalid transformed code
export default function () {
  return {
    code: () => "invalid-transformed-source-code",
    result: (stylelintResult) => stylelintResult,
  }
}
