import React, { useState } from 'react';
import { FiSend, FiFileText } from 'react-icons/fi';

export default function AskAnythingSection() {
  const [queryInput, setQueryInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'user',
      text: 'What potential risks or liabilities are identified in this document?',
    },
    {
      role: 'assistant',
      text: 'Based on the document context, several potential risks and design liabilities are identified — rigid inheritance hierarchies, hidden dependencies between subsystems and uncontrolled object lifecycles.',
      source: 'Design Patterns.pdf • Page 89',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    'What potential risks or liabilities are identified in this document?',
    'Summarize the core architectural patterns in Chapter 3.',
    'List all key dates and compliance requirements.',
  ];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!queryInput.trim() || isTyping) return;

    const userText = queryInput;
    setQueryInput('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let source = 'Design Patterns.pdf • Page 89';

      if (userText.toLowerCase().includes('date') || userText.toLowerCase().includes('compliance')) {
        reply = 'The document specifies strict milestone dates across Q3 and Q4, requiring verified compliance audits before production deployment.';
        source = 'Business Plan.docx • Page 32';
      } else if (userText.toLowerCase().includes('architect') || userText.toLowerCase().includes('chapter')) {
        reply = 'Chapter 3 establishes decoupled interfaces via factory method generators, observer notifications, and immutable state buffers.';
        source = 'Design Patterns.pdf • Page 45';
      } else {
        reply = 'Based on the document context, several potential risks and design liabilities are identified — rigid inheritance hierarchies, hidden dependencies between subsystems and uncontrolled object lifecycles.';
        source = 'Design Patterns.pdf • Page 89';
      }

      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          source,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const featureCards = [
    {
      title: 'Ask Document',
      desc: 'natural language',
      sphereColor: 'from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    },
    {
      title: 'Insights',
      desc: 'auto-extracted',
      sphereColor: 'from-purple-500 to-indigo-600 shadow-[0_0_15px_rgba(168,85,247,0.6)]',
    },
    {
      title: 'Key Sections',
      desc: 'navigate fast',
      sphereColor: 'from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]',
    },
    {
      title: 'Notes',
      desc: 'your thinking',
      sphereColor: 'from-purple-600 to-violet-700 shadow-[0_0_15px_rgba(147,51,234,0.6)]',
    },
    {
      title: 'Bookmarks',
      desc: 'never lose it',
      sphereColor: 'from-blue-500 to-sky-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    },
    {
      title: 'Compare',
      desc: 'two documents',
      sphereColor: 'from-teal-400 to-cyan-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]',
    },
    {
      title: 'Flashcards',
      desc: 'learn & revise',
      sphereColor: 'from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    },
  ];

  return (
    <section
      id="ask-anything"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#030712] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* 3D Depth Background Watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none">
        <span className="text-[12vw] font-black text-watermark absolute top-1/2 -translate-y-1/2 tracking-[0.2em] whitespace-nowrap opacity-[0.035]">
          UNDERSTAND
        </span>
        <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[36rem] h-[36rem] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* Centered Heading */}
        <div className="max-w-3xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10.5px] font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            <span>ASK, UNDERSTAND, EXPLORE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-4">
            Ask Anything. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              Understand Everything.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Talk to your documents naturally and get answers grounded in the
            information that matters.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TWO-COLUMN LAYOUT: CHAT WINDOW (LEFT) & FEATURE GRID (RIGHT)
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-6xl">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: ASK DOCUMENT CHAT CONTAINER
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="w-full rounded-3xl bg-[#081028]/95 border border-blue-500/35 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-5 flex flex-col space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                  ASK DOCUMENT
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Design Patterns.pdf
                </span>
              </div>

              {/* Chat Container */}
              <div className="space-y-4 min-h-[220px]">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-xs font-semibold max-w-[85%] leading-relaxed shadow-md">
                    {chatHistory[0]?.text || 'What potential risks or liabilities are identified in this document?'}
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start gap-3">
                  {/* Glowing AI Avatar Sphere */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1.5px] flex-shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                    <div className="w-full h-full rounded-full bg-[#060c20] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5">
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      Based on the document context, several potential risks and design
                      liabilities are identified —{' '}
                      <span className="text-cyan-300 font-semibold bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        rigid inheritance hierarchies
                      </span>
                      ,{' '}
                      <span className="text-purple-300 font-semibold bg-purple-950/70 px-1.5 py-0.5 rounded border border-purple-500/30">
                        hidden dependencies between subsystems
                      </span>{' '}
                      and{' '}
                      <span className="text-cyan-300 font-semibold bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        uncontrolled object lifecycles
                      </span>
                      .
                    </p>

                    {/* Source Box */}
                    <div className="p-3 rounded-2xl bg-[#060c20] border border-blue-500/25 space-y-1">
                      <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase block">
                        SOURCE
                      </span>
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <FiFileText className="text-cyan-400 text-xs" /> Design Patterns.pdf
                        </span>
                        <span className="text-cyan-300 font-medium">Page 89</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-cyan-300 pl-10">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.3s]" />
                    <span className="text-[11px] text-slate-400">Grounding answer in document...</span>
                  </div>
                )}
              </div>

              {/* Interactive Input Form */}
              <form
                onSubmit={handleSend}
                className="pt-2 border-t border-white/[0.08] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Ask a question about your document..."
                  className="flex-1 bg-[#060c20] border border-blue-500/25 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/80 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!queryInput.trim() || isTyping}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 transition-all cursor-pointer shadow-md"
                >
                  <FiSend className="text-xs" />
                </button>
              </form>

              {/* Subtext Footer */}
              <p className="text-[10px] text-slate-500 pt-1 text-center">
                AI-powered answers grounded in your documents.
              </p>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: 8-ITEM FEATURE GRID
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featureCards.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#081028]/85 border border-white/[0.08] hover:border-blue-500/50 hover:bg-[#0c1840] backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-md hover:scale-[1.02] flex flex-col justify-center"
                >
                  {/* Glowing Sphere Icon */}
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-tr ${feat.sphereColor} mb-2.5 flex items-center justify-center`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  </div>
                  <p className="text-xs font-bold text-white tracking-tight leading-tight">
                    {feat.title}
                  </p>
                  <p className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              ))}

              {/* 8th Card matching 4x2 grid in Screenshot 3 */}
              <div className="p-4 rounded-2xl bg-[#081028]/85 border border-white/[0.08] hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-center shadow-md">
                <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                  A full document intelligence workspace — not just a chatbot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
