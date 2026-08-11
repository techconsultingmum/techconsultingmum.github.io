/**
 * Browser text-to-speech helper.
 *
 * Works around the well-known SpeechSynthesis quirks:
 *  - voices load asynchronously (`voiceschanged`)
 *  - Chrome silently drops `speak()` calls issued immediately after `cancel()`
 *  - Chrome stops long utterances after ~15s unless `resume()` is pinged
 *  - some engines require a user-gesture "warm up" before audio is allowed
 */

const MAX_CHUNK_CHARS = 180;

let warmedUp = false;
let resumeTimer: number | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) return resolve(existing);

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = done;
    window.setTimeout(done, 1200);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;
  return (
    pool.find((v) => /google/i.test(v.name) && /female|us/i.test(v.name)) ||
    pool.find((v) => /google/i.test(v.name)) ||
    pool.find((v) => /samantha|aria|jenny|natural/i.test(v.name)) ||
    pool.find((v) => v.default) ||
    pool[0]
  );
}

/**
 * Unlock audio output. Must be called from inside a user gesture (click/tap)
 * or some browsers will refuse to play the first real utterance.
 */
export function warmUpSpeech(): void {
  if (!isSpeechSupported() || warmedUp) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.rate = 10;
    window.speechSynthesis.speak(u);
    warmedUp = true;
  } catch {
    /* ignore */
  }
  // Populate the voice list early.
  void getVoices();
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  if (resumeTimer !== null) {
    window.clearInterval(resumeTimer);
    resumeTimer = null;
  }
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

/** Strip markdown so the voice doesn't read symbols aloud. */
export function toPlainSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^[\s>#-]*\d+\.\s+/gm, "")
    .replace(/^[\s>#*-]+/gm, "")
    .replace(/[*_`#>|~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text: string): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    if (sentence.length > MAX_CHUNK_CHARS) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      for (let i = 0; i < sentence.length; i += MAX_CHUNK_CHARS) {
        chunks.push(sentence.slice(i, i + MAX_CHUNK_CHARS));
      }
      continue;
    }
    if ((current + " " + sentence).trim().length > MAX_CHUNK_CHARS) {
      chunks.push(current);
      current = sentence;
    } else {
      current = (current ? current + " " : "") + sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

/** Speak `text` aloud. Resolves once playback finishes (or fails). */
export async function speakText(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!isSpeechSupported()) {
    options.onError?.("Speech output isn't supported in this browser.");
    return;
  }

  const plain = toPlainSpeech(text).slice(0, 4000);
  if (!plain) return;

  stopSpeaking();
  const voices = await getVoices();
  const voice = pickVoice(voices);
  const chunks = chunkText(plain);
  if (!chunks.length) return;

  // Chrome drops utterances queued in the same tick as cancel().
  await new Promise((r) => window.setTimeout(r, 120));

  options.onStart?.();

  // Defeat Chrome's ~15s auto-pause.
  resumeTimer = window.setInterval(() => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
  }, 5000);

  await new Promise<void>((resolve) => {
    let index = 0;
    let finished = false;

    const finish = (errorMessage?: string) => {
      if (finished) return;
      finished = true;
      if (resumeTimer !== null) {
        window.clearInterval(resumeTimer);
        resumeTimer = null;
      }
      if (errorMessage) options.onError?.(errorMessage);
      options.onEnd?.();
      resolve();
    };

    const speakNext = () => {
      if (index >= chunks.length) return finish();
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      index += 1;
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => speakNext();
      utterance.onerror = (event) => {
        const err = (event as SpeechSynthesisErrorEvent).error;
        if (err === "interrupted" || err === "canceled") return finish();
        finish("Audio playback failed. Check your device volume or browser sound permissions.");
      };
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        finish("Audio playback failed.");
      }
    };

    speakNext();
  });
}