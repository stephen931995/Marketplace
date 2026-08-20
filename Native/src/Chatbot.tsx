import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Plus, Mic, MicOff, Maximize2, Minimize2,
  Square, Copy, Check, Sparkles, ArrowRight,
} from 'lucide-react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { apps, AppDetail } from './data';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const GREETING =
  "Hi! 👋 I'm the **Systech Marketplace assistant**.\n\nAsk me about any of our applications — what they do, which category they're in, or which one fits a problem you're solving.";

const SUGGESTIONS = [
  'List the applications in the L&D category',
  'What does VisionIQ™ do?',
  'Which apps help with procurement?',
  'Compare SafeWatch™ and VisionIQ™',
];

/* ─────────────────────────────────────────────────────────────
   Turn application names inside the reply into clickable links.
   Longest names first so "Retail Concierge" wins over "Retail…",
   and already-linked text is never re-processed.
───────────────────────────────────────────────────────────── */
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const linkifyApps = (markdown: string, list: AppDetail[]) => {
  const sorted = [...list].sort((a, b) => b.name.length - a.name.length);
  // Split on fenced/inline code and existing links so we never touch them.
  const segments = markdown.split(/(`[^`]*`|\[[^\]]*\]\([^)]*\))/g);
  return segments
    .map((seg, i) => {
      if (i % 2 === 1) return seg; // code or existing link — leave alone
      let out = seg;
      for (const app of sorted) {
        // Match the name with or without its trademark suffix.
        const bare = app.name.replace(/[™®°]/g, '').trim();
        const pattern = new RegExp(
          `(?<![\\w[])(${escapeRe(app.name)}|${escapeRe(bare)})(?![\\w\\]])`,
          'g',
        );
        out = out.replace(pattern, `[${app.name}](app://${app.id})`);
      }
      return out;
    })
    .join('');
};

/* ─────────────────────────────────────────────────────────────
   Detect which category a question is about, so the marketplace
   grid can filter to match the answer.
───────────────────────────────────────────────────────────── */
const CATEGORIES = Array.from(new Set(apps.map((a) => a.category)));

/** Lowercase, treat "&" and "and" alike, and flatten punctuation to spaces. */
const normalize = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();

/** Extra ways people refer to a category beyond its literal name. */
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'L&D': ['learning and development', 'learning', 'training', 'upskilling'],
  'HR Tech': ['hr', 'human resources', 'recruitment', 'hiring'],
  'Data Engineering': ['data eng'],
  'Life Sciences': ['pharma', 'pharmaceutical'],
};

/** Only treat a question as a category query when it reads like one. */
const LIST_INTENT =
  /\b(list|show|display|give|tell|what|which|all|any|apps?|applications?|categor(?:y|ies)|under|available|have)\b/i;

/* Stricter gate for routing off the *answer* rather than the question. "What is
   RAG?" may well mention AeroIntel in passing, and jumping to its page would be
   unwelcome; "which apps help with procurement?" is a genuine request to see
   applications. */
const DISCOVERY_INTENT =
  /\b(list|show|which|recommend|suggest|apps?|applications?|options?|tools?|solutions?)\b/i;

const CATEGORY_MATCHERS = CATEGORIES.map((cat) => {
  const phrases = [normalize(cat), ...(CATEGORY_SYNONYMS[cat] ?? []).map(normalize)];
  return { cat, phrases };
})
  // Longest phrase first so "HR Tech" wins over "Tech" and never matches "Systech".
  .sort((a, b) => Math.max(...b.phrases.map((p) => p.length)) - Math.max(...a.phrases.map((p) => p.length)));

/** App names that contain a category word, longest first. */
const APP_NAME_PHRASES = apps
  .map((a) => normalize(a.name))
  .filter(Boolean)
  .sort((a, b) => b.length - a.length);

/** Normalised with spaces removed: "Retail Concierge" → "retailconcierge". */
const squash = (s: string) => normalize(s).replace(/ /g, '');

/**
 * Optimal string alignment distance — Levenshtein plus adjacent transpositions,
 * so "conceirge" is 1 edit from "concierge" rather than 2. Bails out early once
 * the distance can no longer come in under `max`.
 */
const editDistance = (a: string, b: string, max: number): number => {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1); // transposition
      }
      row.push(v);
      if (v < best) best = v;
    }
    if (best > max) return max + 1; // no cell can recover
    prev2 = prev;
    prev = row;
  }
  return prev[b.length];
};

/** Typo budget scales with name length; short names must match exactly. */
const typoBudget = (len: number) => (len <= 5 ? 0 : len <= 9 ? 1 : 2);

/* Longest name first so "Retail Concierge" is considered before "RetailIQ". */
const APP_MATCHERS = apps
  .map((app) => ({ app, phrase: normalize(app.name), squashed: squash(app.name) }))
  .filter((m) => m.squashed.length >= 4)
  .sort((a, b) => b.squashed.length - a.squashed.length);

/**
 * Find applications named in a sentence, tolerating the way people actually
 * type: "RetailConceirge" (run together and misspelled) must still resolve to
 * Retail Concierge.
 */
const detectApps = (text: string): AppDetail[] => {
  const words = normalize(text).split(' ').filter(Boolean);
  // Words are consumed once claimed, so the same text cannot satisfy two apps.
  // "retail concierge" must not also register ConciergeAI™, whose squashed name
  // sits only two edits from "concierge".
  const used = new Array(words.length).fill(false);
  const found: AppDetail[] = [];

  /** Find a run of unclaimed words matching this app; claim it and record a hit. */
  const tryMatch = (
    m: (typeof APP_MATCHERS)[number],
    allowTypos: boolean,
  ): boolean => {
    const budget = allowTypos ? typoBudget(m.squashed.length) : 0;
    if (allowTypos && budget === 0) return false;
    const maxWords = Math.min(5, m.phrase.split(' ').length + 1);

    for (let n = 1; n <= maxWords; n++) {
      for (let i = 0; i + n <= words.length; i++) {
        if (used.slice(i, i + n).some(Boolean)) continue;
        const candidate = words.slice(i, i + n).join('');
        const ok = allowTypos
          ? Math.abs(candidate.length - m.squashed.length) <= budget &&
            editDistance(candidate, m.squashed, budget) <= budget
          : candidate === m.squashed;
        if (ok) {
          for (let k = i; k < i + n; k++) used[k] = true;
          found.push(m.app);
          return true;
        }
      }
    }
    return false;
  };

  // Exact spellings claim their words first, so a fuzzy match can never steal
  // text that an exactly-named application was entitled to.
  const remaining = APP_MATCHERS.filter((m) => !tryMatch(m, false));
  for (const m of remaining) tryMatch(m, true);

  return found;
};

/* Phrases where a category word means something else entirely. Without this,
   "what is the tech stack of X" filters the grid to the Tech category. */
const NON_CATEGORY_PHRASES = [
  'tech stack', 'tech stacks', 'technology stack', 'technical stack',
  'tech spec', 'tech specs', 'tech support', 'tech team',
  'design pattern', 'design patterns', 'system design',
].map(normalize);

const detectCategory = (question: string): string | null => {
  if (!LIST_INTENT.test(question)) return null;

  // Remove app names before matching: "tell me about Retail Concierge" must not
  // be read as a request to filter the Retail category.
  let hay = ` ${normalize(question)} `;
  for (const name of APP_NAME_PHRASES) {
    hay = hay.split(` ${name} `).join(' ');
  }
  for (const phrase of NON_CATEGORY_PHRASES) {
    hay = hay.split(` ${phrase} `).join(' ');
  }

  for (const { cat, phrases } of CATEGORY_MATCHERS) {
    // Space-padded whole-phrase match, so "tech" cannot match inside "systech".
    if (phrases.some((p) => p && hay.includes(` ${p} `))) return cat;
  }
  return null;
};

/** react-markdown strips unknown protocols, which would kill our app:// links. */
const keepAppUrls = (url: string) => (url.startsWith('app://') ? url : defaultUrlTransform(url));

export default function Chatbot({
  onOpenApp,
  onFilterCategory,
  onShowApps,
}: {
  onOpenApp?: (app: AppDetail) => void;
  onFilterCategory?: (category: string) => void;
  onShowApps?: (appIds: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', sender: 'bot', text: GREETING, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  const appList = useMemo(() => apps, []);

  /* Keep pinned to the newest content while streaming. */
  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' });
  }, [messages, isOpen, isStreaming]);

  /* Focus the composer when the panel opens. */
  useEffect(() => {
    if (isOpen) setTimeout(() => taRef.current?.focus(), 220);
  }, [isOpen]);

  /* Esc closes the panel (or exits full-screen first). */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (expanded) setExpanded(false);
      else setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, expanded]);

  /* Auto-grow the textarea up to a cap, then scroll internally. */
  const autoGrow = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, []);
  useEffect(autoGrow, [inputValue, autoGrow]);

  /**
   * Decide what the page should do for a question, then do it. Ordering matters:
   *   1 app named   → open that application's detail page
   *   2+ apps named → show exactly those applications in the marketplace
   *   category      → filter the marketplace to that category
   * Returns true when the UI was routed, so the answer-based pass can skip.
   *
   * Auto-routing keeps the panel open (unlike clicking a name, which closes it)
   * because the user is still waiting to read the answer they just asked for.
   */
  const applyRoute = useCallback(
    (named: AppDetail[], cat: string | null): boolean => {
      const narrowPanel = () => {
        // Full-screen layouts hide the page behind the panel.
        if (window.innerWidth <= 640) setIsOpen(false);
        else if (expanded) setExpanded(false);
      };

      if (named.length === 1 && onOpenApp) {
        onOpenApp(named[0]);
        narrowPanel();
        return true;
      }
      if (named.length > 1 && onShowApps) {
        onShowApps(named.map((a) => a.id));
        narrowPanel();
        return true;
      }
      if (cat && onFilterCategory) {
        onFilterCategory(cat);
        narrowPanel();
        return true;
      }
      return false;
    },
    [expanded, onOpenApp, onShowApps, onFilterCategory],
  );

  const routeForQuestion = useCallback(
    (question: string) => applyRoute(detectApps(question), detectCategory(question)),
    [applyRoute],
  );

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([{ id: `g-${Date.now()}`, sender: 'bot', text: GREETING, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(false);
    setIsStreaming(false);
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1600);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const send = async (raw?: string) => {
    const query = (raw ?? inputValue).trim();
    if (!query || isLoading || isStreaming) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInputValue('');
    setIsLoading(true);

    // Route the UI straight away rather than waiting for the answer, so the
    // page updates while the reply is still streaming in.
    const routed = routeForQuestion(query);

    const controller = new AbortController();
    abortRef.current = controller;
    const botId = `b-${Date.now()}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error('Network response was not ok');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      setMessages((prev) => [
        ...prev,
        { id: botId, sender: 'bot', text: '', timestamp: new Date() },
      ]);
      setIsLoading(false);
      setIsStreaming(true);

      let botText = '';
      let smallTalk = false;
      // SSE frames can split mid-line across network chunks. Buffering here and
      // only consuming complete lines prevents silently dropping partial JSON —
      // which previously showed up as missing words in the middle of answers.
      let buffer = '';
      let done = false;

      while (!done) {
        const { done: finished, value } = await reader.read();
        if (finished) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep the trailing partial line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(payload);
            if (parsed.type === 'metadata' && parsed.smallTalk) smallTalk = true;
            if (parsed.type === 'chunk' || parsed.type === 'error') {
              botText += parsed.text ?? '';
              // Strip [ref_id:N] / [N] citation markers as they arrive.
              const clean = botText.replace(/\s*\[(?:ref_id:)?\d+\]/g, '');
              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, text: clean } : m)),
              );
            }
          } catch {
            /* incomplete frame — it will arrive with the next chunk */
          }
        }
      }

      if (!botText.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, text: "I couldn't find an answer for that. Try rephrasing, or ask about a specific application or category." }
              : m,
          ),
        );
      } else if (!routed && !smallTalk && DISCOVERY_INTENT.test(query)) {
        // The question named no application ("which apps help with procurement?"),
        // so route from whatever the answer surfaced instead.
        applyRoute(detectApps(botText), null);
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        setMessages((prev) => prev.filter((m) => m.id !== botId || m.text.trim() !== ''));
      } else {
        console.error(err);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== botId),
          {
            id: `e-${Date.now()}`,
            sender: 'bot',
            text: 'Sorry — I ran into a problem reaching the knowledge base. Please try again.',
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  /* Enter sends, Shift+Enter inserts a newline. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  /* Intercept app:// links and route to the application's detail page. */
  const handleAppLink = (id: string) => {
    const app = appList.find((a) => a.id === id);
    if (!app || !onOpenApp) return;
    onOpenApp(app);
    setIsOpen(false);
    setExpanded(false);
  };

  const showSuggestions = messages.length === 1 && !isLoading && !isStreaming;

  const markdownComponents = {
    a: ({ href, children, ...props }: any) => {
      if (typeof href === 'string' && href.startsWith('app://')) {
        const id = href.replace('app://', '');
        return (
          <button
            type="button"
            className="sc-app-pill"
            onClick={() => handleAppLink(id)}
            title="Open this application"
          >
            {children}
            <ArrowRight size={11} strokeWidth={2.5} />
          </button>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    },
    h1: (p: any) => <h4 className="sc-md-h" {...p} />,
    h2: (p: any) => <h4 className="sc-md-h" {...p} />,
    h3: (p: any) => <h4 className="sc-md-h" {...p} />,
    p: (p: any) => <p className="sc-md-p" {...p} />,
    ul: (p: any) => <ul className="sc-md-ul" {...p} />,
    ol: (p: any) => <ol className="sc-md-ul" {...p} />,
    li: (p: any) => <li className="sc-md-li" {...p} />,
    strong: (p: any) => <strong className="sc-md-strong" {...p} />,
    code: (p: any) => <code className="sc-md-code" {...p} />,
    blockquote: (p: any) => <blockquote className="sc-md-quote" {...p} />,
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="sc-fab"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            aria-label="Open the marketplace assistant"
          >
            <span className="sc-fab-glow" />
            <MessageSquare size={23} strokeWidth={2.2} />
            <span className="sc-fab-badge"><Sparkles size={9} strokeWidth={3} /></span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {expanded && (
              <motion.div
                className="sc-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpanded(false)}
              />
            )}

            <motion.div
              className={`sc-panel ${expanded ? 'sc-panel-expanded' : ''}`}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              role="dialog"
              aria-label="Marketplace assistant"
            >
              {/* Header */}
              <div className="sc-header">
                <div className="sc-header-left">
                  <span className="sc-avatar">
                    <img src="/ai-profile.png" alt="" />
                    <span className="sc-avatar-dot" />
                  </span>
                  <div className="sc-header-text">
                    <span className="sc-title">Marketplace Assistant</span>
                    <span className="sc-subtitle">
                      {isLoading ? 'Searching the knowledge base…'
                        : isStreaming ? 'Writing…'
                        : 'Online'}
                    </span>
                  </div>
                </div>
                <div className="sc-header-actions">
                  <button className="sc-icon-btn" onClick={resetChat} title="New chat">
                    <Plus size={17} />
                  </button>
                  <button
                    className="sc-icon-btn sc-hide-sm"
                    onClick={() => setExpanded((v) => !v)}
                    title={expanded ? 'Exit full screen' : 'Expand'}
                  >
                    {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button className="sc-icon-btn" onClick={() => setIsOpen(false)} title="Close">
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Transcript */}
              <div className="sc-scroll" ref={scrollRef}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`sc-row ${msg.sender === 'user' ? 'sc-row-user' : ''}`}>
                    {msg.sender === 'bot' && (
                      <span className="sc-row-avatar">
                        <img src="/ai-profile.png" alt="" />
                      </span>
                    )}
                    <div className="sc-bubble-wrap">
                      <div className={`sc-bubble ${msg.sender === 'user' ? 'sc-bubble-user' : 'sc-bubble-bot'}`}>
                        {msg.sender === 'bot' ? (
                          <>
                            <ReactMarkdown
                              remarkPlugins={[remarkBreaks]}
                              urlTransform={keepAppUrls}
                              components={markdownComponents}
                            >
                              {linkifyApps(msg.text, appList)}
                            </ReactMarkdown>
                            {isStreaming && !msg.text && <span className="sc-caret" />}
                          </>
                        ) : (
                          msg.text
                        )}
                      </div>
                      {msg.sender === 'bot' && msg.text.length > 80 && !isStreaming && (
                        <button
                          className="sc-copy-btn"
                          onClick={() => copyMessage(msg.id, msg.text)}
                          title="Copy answer"
                        >
                          {copiedId === msg.id
                            ? <><Check size={11} /> Copied</>
                            : <><Copy size={11} /> Copy</>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="sc-row">
                    <span className="sc-row-avatar">
                      <img src="/ai-profile.png" alt="" />
                    </span>
                    <div className="sc-bubble sc-bubble-bot sc-thinking">
                      <span className="sc-dots"><i /><i /><i /></span>
                      <span className="sc-thinking-label">Searching documentation…</span>
                    </div>
                  </div>
                )}

                {showSuggestions && (
                  <motion.div
                    className="sc-suggestions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <span className="sc-suggestions-label">Suggested questions</span>
                    {SUGGESTIONS.map((s) => (
                      <button key={s} className="sc-chip" onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}

                <div ref={endRef} />
              </div>

              {/* Composer */}
              <div className="sc-composer">
                <div className="sc-input-shell">
                  <textarea
                    ref={taRef}
                    className="sc-textarea"
                    placeholder="Ask about an application…"
                    value={inputValue}
                    rows={1}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={isStreaming}
                  />
                  <button
                    type="button"
                    className={`sc-mic-btn ${isListening ? 'sc-mic-on' : ''}`}
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>

                {isLoading || isStreaming ? (
                  <button className="sc-send-btn sc-stop-btn" onClick={stopStreaming} title="Stop">
                    <Square size={14} strokeWidth={3} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    className="sc-send-btn"
                    onClick={() => send()}
                    disabled={!inputValue.trim()}
                    title="Send"
                  >
                    <Send size={16} />
                  </button>
                )}
              </div>
              <div className="sc-hint">
                <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
