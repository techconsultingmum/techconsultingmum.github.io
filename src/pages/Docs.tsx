import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Info,
  AlertTriangle,
  CheckCircle2,
  StickyNote,
  Search,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import {
  DOC_CATEGORIES,
  DOC_PAGES,
  DocBlock,
  DocPage,
  findDocBySlug,
  getPrevNext,
} from "@/lib/docs-content";
import { cn } from "@/lib/utils";

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function CodeBlock({ code, lang, title }: { code: string; lang: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  };
  return (
    <div className="my-4 rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border text-xs">
        <span className="font-mono text-muted-foreground">{title ?? lang}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground/90 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

const calloutStyles = {
  info: { icon: Info, cls: "border-blue-500/40 bg-blue-500/5 text-blue-300" },
  warning: { icon: AlertTriangle, cls: "border-yellow-500/40 bg-yellow-500/5 text-yellow-300" },
  success: { icon: CheckCircle2, cls: "border-green-500/40 bg-green-500/5 text-green-300" },
  note: { icon: StickyNote, cls: "border-purple-500/40 bg-purple-500/5 text-purple-300" },
} as const;

function Callout({ variant, title, text }: { variant: keyof typeof calloutStyles; title?: string; text: string }) {
  const { icon: Icon, cls } = calloutStyles[variant];
  return (
    <div className={cn("my-4 flex gap-3 rounded-lg border p-4", cls)}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        {title && <div className="font-semibold text-foreground mb-1">{title}</div>}
        <div className="text-sm text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}

function renderBlock(block: DocBlock, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} id={slugifyHeading(block.text)} className="scroll-mt-24 text-2xl font-display font-bold text-foreground mt-10 mb-3">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} id={slugifyHeading(block.text)} className="scroll-mt-24 text-xl font-semibold text-foreground mt-6 mb-2">
          {block.text}
        </h3>
      );
    case "p":
      return <p key={i} className="text-muted-foreground leading-relaxed my-3">{block.text}</p>;
    case "code":
      return <CodeBlock key={i} code={block.code} lang={block.lang} title={block.title} />;
    case "callout":
      return <Callout key={i} variant={block.variant} title={block.title} text={block.text} />;
    case "list":
      return block.ordered ? (
        <ol key={i} className="list-decimal pl-6 space-y-1.5 text-muted-foreground my-3">
          {block.items.map((it, j) => <li key={j}>{it}</li>)}
        </ol>
      ) : (
        <ul key={i} className="list-disc pl-6 space-y-1.5 text-muted-foreground my-3">
          {block.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="my-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j} className="text-left font-semibold px-4 py-2 text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-border">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-2 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function Sidebar({ activeSlug, onNavigate }: { activeSlug: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of DOC_CATEGORIES) initial[cat.slug] = cat.pages.some((p) => p.slug === activeSlug);
    if (!Object.values(initial).some(Boolean)) initial[DOC_CATEGORIES[0].slug] = true;
    return initial;
  });
  return (
    <nav className="space-y-1 text-sm">
      {DOC_CATEGORIES.map((cat) => {
        const isOpen = open[cat.slug];
        return (
          <div key={cat.slug}>
            <button
              onClick={() => setOpen((o) => ({ ...o, [cat.slug]: !o[cat.slug] }))}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-foreground font-semibold hover:bg-muted/40 transition-colors"
            >
              <span>{cat.title}</span>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isOpen && (
              <ul className="mt-1 ml-2 border-l border-border space-y-0.5">
                {cat.pages.map((page) => {
                  const active = page.slug === activeSlug;
                  return (
                    <li key={page.slug}>
                      <Link
                        to={`/docs/${page.slug}`}
                        onClick={onNavigate}
                        className={cn(
                          "block pl-4 pr-3 py-1.5 -ml-px border-l-2 transition-colors",
                          active
                            ? "border-primary text-primary font-medium bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return DOC_PAGES.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [q]);
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Search documentation..."
        className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Search documentation"
      />
      {focused && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full max-h-96 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
          {results.map((r) => (
            <button
              key={r.slug}
              onMouseDown={(e) => { e.preventDefault(); navigate(`/docs/${r.slug}`); setQ(""); }}
              className="w-full text-left px-3 py-2 hover:bg-muted/40 transition-colors"
            >
              <div className="text-xs text-muted-foreground">{r.category}</div>
              <div className="text-sm font-medium text-foreground">{r.title}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TableOfContents({ blocks }: { blocks: DocBlock[] }) {
  const headings = blocks
    .map((b, i) => (b.type === "h2" || b.type === "h3" ? { ...b, i } : null))
    .filter((b): b is { type: "h2" | "h3"; text: string; i: number } => b !== null);
  if (headings.length === 0) return null;
  return (
    <div className="text-sm">
      <div className="font-semibold text-foreground mb-3 uppercase tracking-wide text-xs">On this page</div>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.i} className={cn(h.type === "h3" && "pl-3")}>
            <a
              href={`#${slugifyHeading(h.text)}`}
              className="block pl-3 -ml-px border-l-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DocsPage = () => {
  const params = useParams<{ "*": string }>();
  const navigate = useNavigate();
  const slug = (params["*"] || "getting-started").replace(/\/$/, "");
  const page = findDocBySlug(slug);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!page) navigate("/docs/getting-started", { replace: true });
  }, [page, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!page) return null;

  const { prev, next } = getPrevNext(page.slug);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${page.title} — Documentation`}
        description={page.description}
        canonicalUrl={`/docs/${page.slug}`}
      />
      <SkipToContent />
      <Header />

      <main id="main-content" className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Mobile nav toggle */}
          <div className="lg:hidden mb-4 flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card text-sm"
            >
              <Menu className="w-4 h-4" /> Docs menu
            </button>
            <div className="flex-1"><SearchBox /></div>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr_220px] gap-8">
            {/* Sidebar - desktop */}
            <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <div className="mb-4"><SearchBox /></div>
              <Sidebar activeSlug={page.slug} />
            </aside>

            {/* Sidebar - mobile drawer */}
            {mobileNavOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border p-4 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4" /> Docs</span>
                    <button onClick={() => setMobileNavOpen(false)} aria-label="Close">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <Sidebar activeSlug={page.slug} onNavigate={() => setMobileNavOpen(false)} />
                </div>
              </div>
            )}

            {/* Content */}
            <article className="min-w-0">
              {/* Breadcrumbs */}
              <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-foreground">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/docs" className="hover:text-foreground">Docs</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground">{page.category}</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground">{page.title}</span>
              </nav>

              <header className="mb-6 pb-6 border-b border-border">
                <div className="text-sm text-primary font-medium mb-2">{page.category}</div>
                <h1 className="text-4xl font-display font-bold text-foreground mb-3">{page.title}</h1>
                <p className="text-lg text-muted-foreground">{page.description}</p>
                <div className="text-xs text-muted-foreground mt-4">Last updated: {page.updated} · v1.0</div>
              </header>

              <div>{page.blocks.map((b, i) => renderBlock(b, i))}</div>

              {/* Prev/Next */}
              <div className="mt-12 pt-8 border-t border-border grid sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link to={`/docs/${prev.slug}`} className="group rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </div>
                    <div className="font-semibold text-foreground group-hover:text-primary">{prev.title}</div>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link to={`/docs/${next.slug}`} className="group rounded-lg border border-border p-4 hover:border-primary/50 transition-colors text-right sm:text-right">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1 justify-end">
                      Next <ArrowRight className="w-3 h-3" />
                    </div>
                    <div className="font-semibold text-foreground group-hover:text-primary">{next.title}</div>
                  </Link>
                ) : <div />}
              </div>
            </article>

            {/* TOC */}
            <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
              <TableOfContents blocks={page.blocks} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocsPage;