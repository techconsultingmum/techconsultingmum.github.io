import { mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const SITE_URL = process.env.SITE_URL || "https://agenticailab.in";
const minPerformance = Number(process.env.LIGHTHOUSE_MIN_PERFORMANCE || "0.70");
const minSeo = Number(process.env.LIGHTHOUSE_MIN_SEO || "0.90");
const maxLcpMs = Number(process.env.LIGHTHOUSE_MAX_LCP_MS || "4000");
const outDir = resolve("lighthouse-report");
const outFile = resolve(outDir, "report.json");

mkdirSync(outDir, { recursive: true });

const result = spawnSync(
  "npx",
  [
    "--yes",
    "lighthouse@latest",
    SITE_URL,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox",
    "--only-categories=performance,seo,best-practices,accessibility",
    "--output=json",
    `--output-path=${outFile}`,
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status || 1);

const report = JSON.parse(readFileSync(outFile, "utf8"));
const performance = report.categories.performance.score;
const seo = report.categories.seo.score;
const lcp = report.audits["largest-contentful-paint"].numericValue;

const failures = [];
if (performance < minPerformance) failures.push(`Performance score ${performance} < ${minPerformance}`);
if (seo < minSeo) failures.push(`SEO score ${seo} < ${minSeo}`);
if (lcp > maxLcpMs) failures.push(`LCP ${Math.round(lcp)}ms > ${maxLcpMs}ms`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Lighthouse passed: performance=${performance}, seo=${seo}, LCP=${Math.round(lcp)}ms.`);