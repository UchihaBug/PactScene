import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignored = new Set([".git", "node_modules", "dist", "coverage", "playwright-report", "test-results"]);
const envTerms = (process.env.RISK_SCAN_TERMS || "")
  .split(",")
  .map((term) => term.trim())
  .filter(Boolean);

const secretPatterns = [
  { name: "OpenAI-like secret key", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { name: "Generic bearer token", regex: /\bBearer\s+[A-Za-z0-9._-]{20,}\b/g },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: "Absolute local project path", regex: /\/Users\/[^/\s]+\/|[A-Z]:\\[^"\s]+/g }
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
    } else if (entry.isFile()) {
      files.push(absolute);
    }
  }
  return files;
}

function isProbablyText(buffer) {
  if (!buffer.length) return true;
  return !buffer.subarray(0, 512).includes(0);
}

const findings = [];
const files = await walk(root);

for (const file of files) {
  const info = await stat(file);
  if (info.size > 1024 * 1024) continue;
  const buffer = await readFile(file);
  if (!isProbablyText(buffer)) continue;
  const text = buffer.toString("utf8");
  const relative = path.relative(root, file);

  for (const pattern of secretPatterns) {
    const matches = text.match(pattern.regex);
    if (matches?.length) {
      findings.push(`${relative}: matched ${pattern.name}`);
    }
  }

  for (const term of envTerms) {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      findings.push(`${relative}: matched private term from RISK_SCAN_TERMS`);
    }
  }
}

if (findings.length) {
  console.error("Risk scan failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Risk scan passed across ${files.length} files.`);

