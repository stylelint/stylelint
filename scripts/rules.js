import fs from "fs"

const ruleDirectory = "src/rules"
const rulesMdFile = "docs/rules.md"

fs.writeFileSync(rulesMdFile, `# Rules\n\n`)

fs.readdirSync(ruleDirectory).forEach(filename => {

  let readmeFile = `${ruleDirectory}/${filename}/README.md`

  if (!fs.existsSync(readmeFile)) { return }

  let lines = fs.readFileSync(readmeFile).toString("utf-8").split("\n")

  fs.appendFileSync(rulesMdFile, `* [\`${filename}\`](../${readmeFile}): ${lines[2]}\n`)
})
