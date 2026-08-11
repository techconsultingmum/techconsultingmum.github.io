import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Calendar, Linkedin, Loader2, RefreshCw } from 'lucide-react';
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

const LinkedInArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('linkedin-articles', {
        method: 'GET',
      });
      if (fnError) throw fnError;
      setArticles(Array.isArray(data?.articles) ? data.articles : []);
    } catch (err) {
      console.error('Failed to load LinkedIn articles:', err);
      setError("We couldn't load the latest articles right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="py-12 px-4" aria-labelledby="blog-article-feed">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-3 px-3 py-1">
              <Linkedin className="w-3 h-3 mr-1" />
              From LinkedIn
            </Badge>
            <h2 id="blog-article-feed" className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Blog / Article
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Our latest published posts, synced live from our editorial sheet.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading articles...
          </div>
        )}

        {!isLoading && error && (
          <div role="alert" className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={load}>Try again</Button>
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
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date || article.day || '—'}
                      </span>
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          Read on LinkedIn
                          <ArrowUpRight className="w-3.5 h-3.5" />
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
    </section>
  );
};

export default LinkedInArticles;