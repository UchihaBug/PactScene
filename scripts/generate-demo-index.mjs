import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sceneDir = path.join(root, "spec/examples/scenes");
const outDir = path.join(root, "examples/demo-web/src/generated");
const outFile = path.join(outDir, "scene-index.json");

const sceneFiles = (await readdir(sceneDir)).filter((file) => file.endsWith(".json")).sort();
const scenes = [];

for (const file of sceneFiles) {
  const raw = await readFile(path.join(sceneDir, file), "utf8");
  const scene = JSON.parse(raw);
  scenes.push({
    code: scene.code,
    intent: scene.intent,
    sceneType: scene.sceneType,
    label: scene.label,
    suggestions: scene.suggestions || []
  });
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, `${JSON.stringify({ generatedAt: new Date().toISOString(), scenes }, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outFile)} with ${scenes.length} scenes.`);

