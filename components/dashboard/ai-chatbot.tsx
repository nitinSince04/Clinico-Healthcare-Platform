"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { sendPatientChatMessage, ChatMessage } from "@/lib/actions/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Loader2,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  X,
} from "lucide-react";

const INITIAL_WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `### 👋 Welcome to Clinico AI Health Assistant!

I am your 24/7 intelligent medical triage assistant. Describe your symptoms or healthcare questions below, and I will recommend appropriate medical specialists and telehealth preparation steps.

*Emergency Notice: Clinico AI provides informational guidance. In emergency situations, please call emergency services immediately.*`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const STARTER_PROMPTS = [
  "🫀 Chest tightness & heart advice",
  "🩺 Skin rash & eczema triage",
  "🧠 Migraines & persistent headaches",
  "👶 Infant fever & pediatric care",
  "🦴 Joint pain & knee discomfort",
  "💊 How do PDF prescriptions work?",
];

export function AiChatbotWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input.trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);
    setError(null);

    const historyForApi = [...messages, userMessage].map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const res = await sendPatientChatMessage(historyForApi);
    setIsLoading(false);

    if (!res.success || !res.reply) {
      setError(res.error || "Failed to reach Clinico AI.");
    } else {
      setMessages((prev) => [...prev, res.reply!]);
    }
  };

  const handleClear = () => {
    setMessages([INITIAL_WELCOME]);
    setError(null);
  };

  return (
    <Card className="border-teal-100 shadow-xl overflow-hidden bg-gradient-to-b from-teal-50/30 via-background to-background">
      {/* AI Header */}
      <CardHeader className="bg-gradient-to-r from-teal-700 via-sky-800 to-indigo-900 text-white p-4 sm:p-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-inner">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              Clinico AI Health Assistant <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            </CardTitle>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] text-teal-100 font-medium">Triage Engine Online (24/7)</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="h-8 border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs gap-1 font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset Chat
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Medical Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2.5 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <span>AI Triage Assistant provides guidance only. In life-threatening emergencies, call 911 immediately.</span>
        </div>

        {/* Message Stream Box */}
        <div className="h-[380px] sm:h-[420px] overflow-y-auto p-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-2 leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "medical-gradient text-white font-medium rounded-br-none"
                    : "bg-white dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-slate-200 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-line font-sans">
                  {msg.content}
                </div>

                {/* Direct Action Link to Doctor Directory */}
                {msg.suggestedDoctorLink && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">
                    <Link href={msg.suggestedDoctorLink}>
                      <Button
                        size="sm"
                        variant="gradient"
                        className="w-full text-xs font-bold gap-2 shadow-md h-8"
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        Find {msg.suggestedSpecialty || "Specialist"} Doctors <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}

                <div
                  className={`text-[9px] font-mono text-right mt-1 ${
                    msg.role === "user" ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                <span>Clinico AI is analyzing clinical triage data...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Starter Chips */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-teal-600" /> Quick Clinical Questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STARTER_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSend(promptText)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 text-slate-700 font-semibold transition-all"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms or health questions (e.g. 'I have a high fever and headache')..."
            className="h-11 text-xs rounded-xl bg-white border-slate-300 focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="gradient"
            className="h-11 px-5 rounded-xl font-bold gap-2 text-xs shrink-0 shadow-md"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" /> Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
