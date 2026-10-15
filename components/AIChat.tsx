"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import {
  Bot,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { ProductCard } from "@/components/ProductCard";

import {
  askShoppingAssistant,
  refineAssistantResults,
  ShoppingIntent,
} from "@/lib/ai-assistant";

import { Product } from "@/lib/types";

const CHAT_KEY = "shopsphere-ai-chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
};

const starterPrompts = [
  "Show me electronics",
  "Show me products under ₹5000",
  "Show me the best rated products",
];

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm ShopSphere AI. Tell me what you're looking for and I'll help you find relevant products.",
};

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [initialMessage];
  }

  try {
    const stored = localStorage.getItem(CHAT_KEY);

    if (!stored) {
      return [initialMessage];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [initialMessage];
    }

    return parsed;
  } catch {
    return [initialMessage];
  }
}

export default function AIChat() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [lastIntent, setLastIntent] = useState<ShoppingIntent | null>(null);

  const [lastProducts, setLastProducts] = useState<Product[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMessages(loadMessages());
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [messages, loading, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = input.trim();

    if (!query || loading) {
      return;
    }

    setInput("");

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      text: query,
    };

    setMessages((previous) => [...previous, userMessage]);

    setLoading(true);

    window.setTimeout(() => {
      const lowerQuery = query.toLowerCase();

      const isRefinement =
        lastIntent !== null &&
        lastProducts.length > 0 &&
        (lowerQuery.includes("cheaper") ||
          lowerQuery.includes("lower price") ||
          lowerQuery.includes("more affordable") ||
          lowerQuery.includes("budget") ||
          lowerQuery.includes("better rating") ||
          lowerQuery.includes("better rated") ||
          lowerQuery.includes("higher rating") ||
          lowerQuery.includes("higher rated") ||
          lowerQuery.includes("best rated") ||
          lowerQuery.includes("more like") ||
          lowerQuery.includes("similar") ||
          lowerQuery.includes("like this"));

      const result = isRefinement
        ? refineAssistantResults(lastIntent, lastProducts, query)
        : askShoppingAssistant(query);

      setLastIntent(result.intent);
      setLastProducts(result.products);

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        text: result.message,
        products: result.products,
      };

      setMessages((previous) => [...previous, assistantMessage]);

      setLoading(false);
    }, 500);
  };

  const handleStarterPrompt = (prompt: string) => {
    if (loading) {
      return;
    }

    setInput(prompt);

    window.setTimeout(() => {
      const fakeEvent = {
        preventDefault: () => undefined,
      } as FormEvent<HTMLFormElement>;

      setInput("");

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: "user",
        text: prompt,
      };

      setMessages((previous) => [...previous, userMessage]);

      setLoading(true);

      window.setTimeout(() => {
        const result = askShoppingAssistant(prompt);

        setLastIntent(result.intent);
        setLastProducts(result.products);

        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          text: result.message,
          products: result.products,
        };

        setMessages((previous) => [...previous, assistantMessage]);

        setLoading(false);
      }, 500);

      fakeEvent.preventDefault();
    }, 0);
  };

  const handleClearChat = () => {
    localStorage.removeItem(CHAT_KEY);

    setMessages([initialMessage]);
    setLastIntent(null);
    setLastProducts([]);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open ShopSphere AI assistant"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-300 transition hover:scale-105 hover:shadow-indigo-400"
      >
        <div className="relative">
          <MessageCircle size={27} />

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-indigo-600">
            AI
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-105 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl sm:bottom-6 sm:right-6">
      <div className="bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="font-black">ShopSphere AI</h2>

              <p className="text-xs text-indigo-100">Your shopping assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearChat}
              className="rounded-lg px-2 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-white/10 hover:text-white"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close ShopSphere AI assistant"
              className="rounded-xl p-2 transition hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-xs leading-5 text-indigo-100">
          Rule-based demo assistant. No external AI API is used.
        </div>
      </div>

      <div className="h-105 overflow-y-auto bg-gray-50 px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "mb-4 flex justify-end"
                : "mb-4 flex justify-start"
            }
          >
            <div
              className={
                message.role === "user" ? "max-w-[88%]" : "max-w-[96%]"
              }
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={
                    message.role === "user"
                      ? "rounded-2xl rounded-br-md bg-indigo-600 px-4 py-3 text-sm leading-6 text-white shadow-sm"
                      : "rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-700 shadow-sm"
                  }
                >
                  {message.text}
                </div>

                {message.role === "user" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    <User size={15} />
                  </div>
                )}
              </div>

              {message.products && message.products.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 pl-9">
                  {message.products.map((product) => (
                    <div
                      key={String(product.id)}
                      className="overflow-hidden rounded-xl bg-white"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-4 flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Bot size={15} />
            </div>

            <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                  style={{
                    animationDelay: "120ms",
                  }}
                />

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                  style={{
                    animationDelay: "240ms",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="border-t bg-white px-4 py-3">
          <p className="mb-2 text-xs font-bold text-gray-500">Try asking</p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleStarterPrompt(prompt)}
                className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t bg-white p-3">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask me what you're looking for..."
            disabled={loading}
            aria-label="Ask ShopSphere AI"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute -top-3 left-1/2 hidden -translate-x-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 shadow-sm transition hover:text-gray-900 sm:block"
        aria-label="Collapse assistant"
      >
        <ChevronDown size={15} />
      </button>
    </div>
  );
}
