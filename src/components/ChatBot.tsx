import { useCallback, useEffect, useRef, useState, FormEvent } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

// Minimal typings for the Web Speech API (not in lib.dom for all TS targets)
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition || w.webkitSpeechRecognition) as (new () => SpeechRecognitionLike) | null;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const isChatConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && PUBLISHABLE_KEY);

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
  const [isListening, setIsListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const autoSendRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    setVoiceSupported(Boolean(getSpeechRecognitionCtor()));
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!speakReplies || !text.trim()) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      // Strip markdown so the voice doesn't read symbols aloud
      const plain = text
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[*_`#>|]/g, "")
        .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1000);
      if (!plain) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(plain);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    },
    [speakReplies],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Voice input isn't supported in this browser. Please type your message.");
      return;
    }
    stopSpeaking();
    setError(null);

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      setInput(transcript.trim().slice(0, 2000));
      if (isFinal && transcript.trim()) {
        autoSendRef.current = true;
        setSpeakReplies(true);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        setError("Microphone access was blocked. Enable it in your browser settings to use voice.");
      } else if (event?.error !== "aborted" && event?.error !== "no-speech") {
        setError("Voice input failed. Please try again or type your message.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (autoSendRef.current) {
        autoSendRef.current = false;
        // Submit whatever was transcribed
        setTimeout(() => formRef.current?.requestSubmit(), 60);
      }
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [stopSpeaking]);

  // Clean up voice sessions when the widget closes or unmounts
  useEffect(() => {
    if (!open) {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      setIsListening(false);
      stopSpeaking();
    }
  }, [open, stopSpeaking]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    if (text.length > 2000) {
      setError("Message is too long (max 2000 characters).");
      return;
    }

    setError(null);
    stopSpeaking();

    if (!isChatConfigured) {
      setError("Chat is temporarily unavailable. Please try again later.");
      return;
    }

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
          apikey: PUBLISHABLE_KEY,
          Authorization: `Bearer ${PUBLISHABLE_KEY}`,
          "X-Client-Info": "agenticailab-chat/1.0",
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: next.filter((m) => m !== INITIAL_MSG).slice(-20),
        }),
      });

      if (!resp.ok || !resp.body) {
        let msg = "Something went wrong. Please try again.";
        if (resp.status === 401) msg = "Chat is temporarily unavailable. Please refresh the page and try again.";
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
      speak(assistantSoFar);
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