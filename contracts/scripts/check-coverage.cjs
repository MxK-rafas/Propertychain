const fs = require("node:fs");
const path = require("node:path");
const { createCoverageMap } = require("istanbul-lib-coverage");

// Medir cada contrato do projeto impede que um arquivo bem coberto esconda outro.
const report = JSON.parse(fs.readFileSync(path.join(__dirname, "../coverage.json"), "utf8"));
const map = createCoverageMap(report);
const sourceRoot = path.resolve(__dirname, "../contracts");
const sources = fs.readdirSync(sourceRoot, { recursive: true })
  .filter((file) => file.endsWith(".sol"));
if (sources.length === 0) throw new Error("Nenhum contrato encontrado para verificar a cobertura.");

const summaries = {};
for (const source of sources) {
  const suffix = `/contracts/${source.split(path.sep).join("/")}`;
  const file = map.files().find((name) => `/${name.replaceAll("\\", "/")}`.endsWith(suffix));
  if (!file) throw new Error(`Relatório sem cobertura de ${source}.`);
  const summary = map.fileCoverageFor(file).toSummary().toJSON();
  summaries[source] = summary;
  console.log(`${source}: ${summary.lines.pct}% de linhas (mínimo: 90%).`);
  if (summary.lines.total === 0 || summary.lines.pct < 90) {
    throw new Error(`Cobertura de linhas insuficiente em ${source}.`);
  }
}
fs.writeFileSync(path.join(__dirname, "../coverage-summary.json"), JSON.stringify(summaries, null, 2) + "\n");
