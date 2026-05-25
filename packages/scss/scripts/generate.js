#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname, "../src");
const outFile = path.resolve(__dirname, "../all.scss");

// Match the order defined in index.scss
const FILE_ORDER = [
  "_colors.scss",
  "_typography.scss",
  "_mixins.scss",
  "_breakpoints.scss",
  "_animations.scss",
];

function generate() {
  const useStatements = new Set();
  const sections = [];

  for (const filename of FILE_ORDER) {
    const filePath = path.join(srcDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[scss-bundle] Warning: ${filename} not found, skipping.`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split("\n");
    const bodyLines = [];

    for (const line of lines) {
      if (/^@use\s+/.test(line.trim())) {
        useStatements.add(line.trim());
      } else {
        bodyLines.push(line);
      }
    }

    const body = bodyLines.join("\n").trim();
    if (body) {
      sections.push(`// ── ${filename} ${"─".repeat(Math.max(0, 50 - filename.length))}\n${body}`);
    }
  }

  const banner = `// AUTO-GENERATED — do not edit directly.
// Source: packages/scss/src/_*.scss
// Run \`node scripts/generate.js --watch\` to keep in sync.\n`;

  const useBlock =
    useStatements.size > 0 ? [...useStatements].join("\n") + "\n" : "";

  const output = [banner, useBlock, sections.join("\n\n")].join("\n").trimEnd() + "\n";

  fs.writeFileSync(outFile, output, "utf8");
  console.log(`[scss-bundle] ${new Date().toLocaleTimeString()} → all.scss updated`);
}

generate();

if (process.argv.includes("--watch")) {
  console.log(`[scss-bundle] Watching ${srcDir} for changes…`);

  const watchers = new Map();

  function watchFile(filePath) {
    if (watchers.has(filePath)) return;
    const w = fs.watch(filePath, () => {
      console.log(`[scss-bundle] Changed: ${path.basename(filePath)}`);
      generate();
    });
    watchers.set(filePath, w);
  }

  for (const filename of FILE_ORDER) {
    watchFile(path.join(srcDir, filename));
  }

  // Also watch for new files added to src/
  fs.watch(srcDir, (event, filename) => {
    if (!filename || !filename.startsWith("_") || !filename.endsWith(".scss")) return;
    const filePath = path.join(srcDir, filename);
    if (fs.existsSync(filePath) && !watchers.has(filePath)) {
      console.log(`[scss-bundle] New file detected: ${filename}`);
      watchFile(filePath);
      generate();
    }
  });
}
