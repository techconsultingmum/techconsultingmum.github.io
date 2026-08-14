import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Calendar, Linkedin, RefreshCw, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  date: string;
  day: string;
  topic: string;
  audience: string;
  language: string;
  title: string;
  excerpt: string;
  url: string | null;
  likes: number;
  comments: number;
}

const PAGE_SIZE = 6;
const MAX_ATTEMPTS = 3;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });

const ArticleSkeleton = () => (
  <Card className="flex flex-col h-full" aria-hidden="true">
    <CardHeader>
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5 mt-2" />
    </CardHeader>
    <CardContent className="flex flex-col flex-1 gap-2">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-2/3" />
      <div className="mt-auto pt-4 flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-28" />
      </div>
    </CardContent>
  </Card>
);

const LinkedInArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // Single-flight: cancel any request still running (StrictMode, fast retries).
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    setIsLoading(true);
    setError(null);

    let lastErr: unknown = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('linkedin-articles', {
          method: 'GET',
        });
        if (controller.signal.aborted) return;
        if (fnError) throw fnError;
        if (data?.error) throw new Error(String(data.error));

        setArticles(Array.isArray(data?.articles) ? data.articles : []);
        setVisible(PAGE_SIZE);
        setIsLoading(false);
        return;
      } catch (err) {
        if (controller.signal.aborted) return;
        lastErr = err;
        if (attempt < MAX_ATTEMPTS - 1) {
          try {
            await sleep(600 * (attempt + 1), controller.signal);
          } catch {
            return; // aborted while backing off
          }
        }
      }
    }

    if (controller.signal.aborted) return;
    console.error('Failed to load articles:', lastErr);
    setError(
      typeof navigator !== 'undefined' && navigator.onLine === false
        ? "You appear to be offline. Reconnect and try again."
        : "We couldn't load the latest articles right now.",
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
    return () => inFlight.current?.abort();
  }, [load]);

  return (
    <section className="py-12 px-4" aria-labelledby="blog-article-feed">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-3 px-3 py-1">
              <Linkedin className="w-3 h-3 mr-1" aria-hidden="true" />
              From LinkedIn
            </Badge>
            <h2 id="blog-article-feed" className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Blog / Article
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Our latest published posts, synced live from our editorial sheet.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void load()}
            disabled={isLoading}
            aria-label="Refresh articles"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <div aria-live="polite" aria-busy={isLoading}>
          {isLoading && (
            <>
              <span className="sr-only">Loading articles…</span>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            </>
          )}

          {!isLoading && error && (
            <div role="alert" className="text-center py-12">
              <WifiOff className="w-8 h-8 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => void load()}>
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !error && articles.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No articles published yet.</p>
          )}

          {!isLoading && !error && articles.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, visible).map((article) => (
                  <Card key={article.id} className="flex flex-col h-full hover:border-primary/40 transition-colors">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {article.topic && (
                          <Badge variant="secondary" className="capitalize">{article.topic}</Badge>
                        )}
                        {article.language && (
                          <Badge variant="outline" className="uppercase">{article.language}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-snug line-clamp-3">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-4 mb-4">{article.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          {article.date || article.day || '—'}
                        </span>
                        {article.url && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-medium rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            Read on LinkedIn
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {visible < articles.length && (
                <div className="text-center mt-10">
                  <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more articles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LinkedInArticles;
