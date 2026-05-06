import { useEffect, useRef, useState, FormEvent } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const INITIAL_MSG: Msg = {
  role: "assistant",
  content:
    "Hi! I'm AgenticAI Lab's assistant. Ask about our services, process, or how to get started.",
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    if (text.length > 2000) {
      setError("Message is too long (max 2000 characters).");
      return;
    }

    setError(null);
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PUBLISHABLE_KEY}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: next.filter((m) => m !== INITIAL_MSG).slice(-20),
        }),
      });

      if (!resp.ok || !resp.body) {
        let msg = "Something went wrong. Please try again.";
        if (resp.status === 429) msg = "Too many requests. Please wait a moment.";
        else if (resp.status === 402) msg = "AI service unavailable. Please contact support.";
        try {
          const j = await resp.json();
          if (j?.error) msg = j.error;
        } catch { /* ignore */ }
        throw new Error(msg);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last !== INITIAL_MSG && prev.includes(userMsg)) {
            const lastIdx = prev.length - 1;
            if (prev[lastIdx].role === "assistant" && lastIdx > prev.indexOf(userMsg)) {
              return prev.map((m, i) => (i === lastIdx ? { ...m, content: assistantSoFar } : m));
            }
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Failed to get a response.";
      setError(msg);
      // remove failed user message? keep it for retry
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-glow",
          "bg-primary text-primary-foreground flex items-center justify-center",
          "transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="AgenticAI Lab chat assistant"
          className={cn(
            "fixed z-50 bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col",
            "bottom-24 right-6 w-[calc(100vw-3rem)] max-w-[380px] h-[min(560px,calc(100vh-8rem))]"
          )}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">AgenticAI Assistant</p>
              <p className="text-xs text-muted-foreground">Typically replies instantly</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-secondary text-secondary-foreground"
                )}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="mr-auto bg-secondary text-secondary-foreground rounded-xl px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            {error && (
              <div role="alert" className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={send} className="border-t border-border p-3 flex gap-2 bg-card">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              maxLength={2000}
              disabled={isLoading}
              aria-label="Chat message"
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;