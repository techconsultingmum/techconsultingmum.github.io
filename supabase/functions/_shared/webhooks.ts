// Resolves webhook endpoints from the admin-managed webhook_settings table,
// falling back to the hard-coded default when the table is unreachable.

type Setting = { key: string; url: string; method: string; is_active: boolean };

let cache: { at: number; rows: Setting[] } | null = null;
const CACHE_MS = 30_000;

async function loadSettings(): Promise<Setting[]> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.rows;

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return cache?.rows ?? [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(
      `${url}/rest/v1/webhook_settings?select=key,url,method,is_active`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: controller.signal,
      },
    );
    if (!res.ok) return cache?.rows ?? [];
    const rows = (await res.json()) as Setting[];
    cache = { at: now, rows };
    return rows;
  } catch {
    return cache?.rows ?? [];
  } finally {
    clearTimeout(timer);
  }
}

export async function getWebhook(
  key: string,
  fallback: { url: string; method?: "GET" | "POST" },
): Promise<{ url: string; method: "GET" | "POST" }> {
  const rows = await loadSettings();
  const row = rows.find((r) => r.key === key);
  const method = (row?.method === "GET" || row?.method === "POST")
    ? row.method
    : (fallback.method ?? "POST");
  if (!row || !row.is_active || !/^https:\/\//i.test(row.url ?? "")) {
    return { url: fallback.url, method: fallback.method ?? "POST" };
  }
  return { url: row.url, method };
}

export async function getWebhookUrl(key: string, fallbackUrl: string): Promise<string> {
  return (await getWebhook(key, { url: fallbackUrl })).url;
}
