import { mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const SITE_URL = process.env.SITE_URL || "https://agenticailab.in";
const minPerformance = Number(process.env.LIGHTHOUSE_MIN_PERFORMANCE || "0.70");
const minSeo = Number(process.env.LIGHTHOUSE_MIN_SEO || "0.90");
const maxLcpMs = Number(process.env.LIGHTHOUSE_MAX_LCP_MS || "4000");
const runs = Math.max(1, Number(process.env.LIGHTHOUSE_RUNS || "3"));
const outDir = resolve("lighthouse-report");

mkdirSync(outDir, { recursive: true });

function runOnce(i) {
  const outFile = resolve(outDir, `report-${i}.json`);
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
  return {
    performance: report.categories.performance.score,
    seo: report.categories.seo.score,
    lcp: report.audits["largest-contentful-paint"].numericValue,
  };
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const results = [];
for (let i = 0; i < runs; i++) {
  const r = runOnce(i);
  results.push(r);
  console.log(
    `Run ${i + 1}/${runs}: performance=${r.performance}, seo=${r.seo}, LCP=${Math.round(r.lcp)}ms`,
  );
}

const performance = median(results.map((r) => r.performance));
const seo = median(results.map((r) => r.seo));
const lcp = median(results.map((r) => r.lcp));

const failures = [];
if (performance < minPerformance) failures.push(`Performance score ${performance} < ${minPerformance}`);
if (seo < minSeo) failures.push(`SEO score ${seo} < ${minSeo}`);
if (lcp > maxLcpMs) failures.push(`LCP ${Math.round(lcp)}ms > ${maxLcpMs}ms`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Lighthouse passed: performance=${performance}, seo=${seo}, LCP=${Math.round(lcp)}ms.`);
