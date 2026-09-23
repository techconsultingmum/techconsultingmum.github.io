import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Loader2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";

interface WebhookRow {
  id: string;
  key: string;
  label: string;
  url: string;
  method: string;
  is_active: boolean;
  notes: string | null;
  updated_at: string;
}

type Draft = Pick<WebhookRow, "key" | "label" | "url" | "method" | "is_active" | "notes">;

const emptyDraft: Draft = {
  key: "",
  label: "",
  url: "",
  method: "POST",
  is_active: true,
  notes: "",
};

const isHttps = (value: string) => /^https:\/\/\S+$/i.test(value.trim());

/* -------------------------------------------------------------------------- */
/*                                   Sign in                                  */
/* -------------------------------------------------------------------------- */

const SignIn = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    toast({ title: "Signed in" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-6 shadow-lg"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Backend settings</h1>
          <p className="text-sm text-muted-foreground">Administrator sign in required.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Webhook manager                              */
/* -------------------------------------------------------------------------- */

const WebhookManager = ({ onSignOut }: { onSignOut: () => void }) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<WebhookRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newDraft, setNewDraft] = useState<Draft>(emptyDraft);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("webhook_settings")
      .select("*")
      .order("label", { ascending: true });
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't load settings", description: error.message, variant: "destructive" });
      return;
    }
    const list = (data ?? []) as WebhookRow[];
    setRows(list);
    setDrafts(
      Object.fromEntries(
        list.map((r) => [
          r.id,
          { key: r.key, label: r.label, url: r.url, method: r.method, is_active: r.is_active, notes: r.notes ?? "" },
        ]),
      ),
    );
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const dirty = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const d = drafts[r.id];
      if (!d) continue;
      if (
        d.label !== r.label ||
        d.url !== r.url ||
        d.method !== r.method ||
        d.is_active !== r.is_active ||
        (d.notes ?? "") !== (r.notes ?? "")
      ) {
        set.add(r.id);
      }
    }
    return set;
  }, [rows, drafts]);

  const save = async (row: WebhookRow) => {
    const d = drafts[row.id];
    if (!d) return;
    if (!d.label.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (!isHttps(d.url)) {
      toast({ title: "Link must start with https://", variant: "destructive" });
      return;
    }
    setSavingId(row.id);
    const { error } = await supabase
      .from("webhook_settings")
      .update({
        label: d.label.trim(),
        url: d.url.trim(),
        method: d.method,
        is_active: d.is_active,
        notes: d.notes?.trim() || null,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Saved", description: `${d.label} updated.` });
    void load();
  };

  const create = async () => {
    const key = newDraft.key.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    if (!key || !newDraft.label.trim()) {
      toast({ title: "Reference and name are required", variant: "destructive" });
      return;
    }
    if (!isHttps(newDraft.url)) {
      toast({ title: "Link must start with https://", variant: "destructive" });
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("webhook_settings").insert({
      key,
      label: newDraft.label.trim(),
      url: newDraft.url.trim(),
      method: newDraft.method,
      is_active: newDraft.is_active,
      notes: newDraft.notes?.trim() || null,
    });
    setCreating(false);
    if (error) {
      toast({ title: "Couldn't add", description: error.message, variant: "destructive" });
      return;
    }
    setNewDraft(emptyDraft);
    toast({ title: "Webhook added" });
    void load();
  };

  const remove = async (row: WebhookRow) => {
    if (!window.confirm(`Delete "${row.label}"? Forms using it will fall back to the built-in link.`)) return;
    const { error } = await supabase.from("webhook_settings").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    void load();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Webhook settings</h1>
          <p className="text-sm text-muted-foreground">
            Internal configuration. Changes take effect within about a minute.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" label="Loading settings..." />
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const d = drafts[row.id];
            if (!d) return null;
            return (
              <section
                key={row.id}
                className="rounded-xl border border-border bg-card p-5 space-y-4"
                aria-label={row.label}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Input
                      aria-label="Name"
                      value={d.label}
                      onChange={(e) => update(row.id, { label: e.target.value })}
                      className="font-medium"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Reference: {row.key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`active-${row.id}`}
                      checked={d.is_active}
                      onCheckedChange={(v) => update(row.id, { is_active: v })}
                    />
                    <Label htmlFor={`active-${row.id}`} className="text-sm">
                      {d.is_active ? "Active" : "Paused"}
                    </Label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <div className="space-y-2">
                    <Label htmlFor={`url-${row.id}`}>Link</Label>
                    <Input
                      id={`url-${row.id}`}
                      value={d.url}
                      inputMode="url"
                      onChange={(e) => update(row.id, { url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`method-${row.id}`}>Method</Label>
                    <Select value={d.method} onValueChange={(v) => update(row.id, { method: v })}>
                      <SelectTrigger id={`method-${row.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="GET">GET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`notes-${row.id}`}>Notes</Label>
                  <Textarea
                    id={`notes-${row.id}`}
                    rows={2}
                    value={d.notes ?? ""}
                    onChange={(e) => update(row.id, { notes: e.target.value })}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Last updated {new Date(row.updated_at).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void remove(row)}
                      aria-label={`Delete ${row.label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => void save(row)}
                      disabled={savingId === row.id || !dirty.has(row.id)}
                    >
                      {savingId === row.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </section>
            );
          })}

          <section className="rounded-xl border border-dashed border-border bg-card/50 p-5 space-y-4">
            <h2 className="text-lg font-medium text-foreground">Add a webhook</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-key">Reference (used in code)</Label>
                <Input
                  id="new-key"
                  placeholder="careers"
                  value={newDraft.key}
                  onChange={(e) => setNewDraft((p) => ({ ...p, key: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-label">Name</Label>
                <Input
                  id="new-label"
                  placeholder="Careers form"
                  value={newDraft.label}
                  onChange={(e) => setNewDraft((p) => ({ ...p, label: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-url">Link</Label>
                <Input
                  id="new-url"
                  placeholder="https://example.app.n8n.cloud/webhook/..."
                  value={newDraft.url}
                  onChange={(e) => setNewDraft((p) => ({ ...p, url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-method">Method</Label>
                <Select
                  value={newDraft.method}
                  onValueChange={(v) => setNewDraft((p) => ({ ...p, method: v }))}
                >
                  <SelectTrigger id="new-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-notes">Notes</Label>
                <Input
                  id="new-notes"
                  value={newDraft.notes ?? ""}
                  onChange={(e) => setNewDraft((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={() => void create()} disabled={creating}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add webhook
            </Button>
          </section>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setIsAdmin(null);
        setChecking(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    setChecking(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsAdmin(Boolean(data));
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(null);
  };

  const head = (
    <Helmet>
      <title>Backend settings</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );

  if (!session) {
    return (
      <main id="main-content">
        {head}
        <SignIn />
      </main>
    );
  }

  if (checking || isAdmin === null) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-background">
        {head}
        <LoadingSpinner size="lg" label="Checking access..." />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-background px-4">
        {head}
        <div className="max-w-sm space-y-4 text-center">
          <h1 className="text-xl font-semibold text-foreground">No access</h1>
          <p className="text-sm text-muted-foreground">
            This account isn't an administrator.
          </p>
          <Button variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-background">
      {head}
      <WebhookManager onSignOut={() => void signOut()} />
    </main>
  );
};

export default Admin;
