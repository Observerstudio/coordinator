// Every skills/<name>/SKILL.md has a frontmatter block whose `name` matches its folder and a `description`,
// and every folder is listed in .claude-plugin/plugin.json. A header the YAML parser rejects
// makes `npx skills add` skip the skill without failing, so this check fails loudly instead.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

const plugin = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
const errors = [];
for (const dir of readdirSync("skills", { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const path = `skills/${dir.name}/SKILL.md`;
  const head = readFileSync(path, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1];
  let meta;
  try { meta = head ? parse(head) : null; } catch (e) { errors.push(`${path}: ${e.message.split("\n")[0]}`); continue; }
  if (!meta) errors.push(`${path}: no frontmatter`);
  else {
    if (meta.name !== dir.name) errors.push(`${path}: name "${meta.name}" does not match folder "${dir.name}"`);
    if (!meta.description) errors.push(`${path}: no description`);
  }
  if (!plugin.skills.includes(`./skills/${dir.name}`)) errors.push(`${path}: missing from .claude-plugin/plugin.json`);
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("skills ok");
