const SITE_URL = (process.env.SITE_URL || "https://agenticailab.in").replace(/\/$/, "");

async function checkUrl(url, expectedContentType) {
  const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": "AgenticAI-SmokeTest/1.0" } });
  const contentType = response.headers.get("content-type") || "";
  if (response.status !== 200) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  if (expectedContentType && !contentType.includes(expectedContentType)) {
    throw new Error(`${url} returned unexpected content-type ${contentType}`);
  }
  return response.text();
}

const robotsUrl = `${SITE_URL}/robots.txt`;
const sitemapUrl = `${SITE_URL}/sitemap.xml`;

await checkUrl(robotsUrl, "text/plain");
const sitemap = await checkUrl(sitemapUrl, "xml");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (!urls.length) throw new Error("No sitemap URLs found.");

const failures = [];
for (const url of urls) {
  try {
    await checkUrl(url, "text/html");
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Smoke test passed: robots.txt, sitemap.xml, and ${urls.length} sitemap URLs returned HTTP 200.`);