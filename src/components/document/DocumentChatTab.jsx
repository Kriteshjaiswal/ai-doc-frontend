import { useState, useEffect, useRef } from 'react';
import {
  FiSend,
  FiUser,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiTrash2,
  FiZap,
  FiCornerDownRight,
  FiBookOpen,
  FiBookmark,
} from 'react-icons/fi';
import { DocumindIcon } from '../DocumindLogo';
import { askQuestion, getChatHistory, deleteChatsByDocument } from '../../api/chatApi';
import { addDocumentNote, addDocumentBookmark } from '../../api/documentApi';
import MarkdownRenderer from '../MarkdownRenderer';

export default function DocumentChatTab({
  documentId,
  documentTitle,
  topics = [],
  currentPage = 1,
  notes = [],
  bookmarks = [],
  onSelectCitationPage,
  onUpdateNotes,
  onUpdateBookmarks,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [savedNotes, setSavedNotes] = useState({});
  const [savedBookmarks, setSavedBookmarks] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const messagesEndRef = useRef(null);

  // Suggested contextual questions derived from document topics
  const suggestedQuestions = [
    'What are the primary objectives and key takeaways?',
    'What potential risks or liabilities are identified in this document?',
    'Are there any specific dates, deadlines, or milestones?',
    ...(topics.length > 0
      ? [`Explain key details regarding "${topics[0].name}"`]
      : ['Summarize the core findings.']),
  ];

  useEffect(() => {
    if (documentId) {
      loadHistory();
    }
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadHistory = async () => {
    try {
      const res = await getChatHistory(documentId);
      const history = (res.data || []).map((item) => ({
        id: item.id,
        sender: 'user',
        text: item.question,
        answer: item.answer,
        askedAt: item.askedAt,
      }));
      setMessages(history);
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const handleSend = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    const userMsgId = Date.now();
    const tempUserMsg = { id: userMsgId, sender: 'user', text: q };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await askQuestion(documentId, q);
      const answer = res.data?.answer || 'I could not generate an answer based on this document.';
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId ? { ...msg, answer, serverId: res.data?.id } : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId
            ? { ...msg, answer: 'Failed to process question. Please try again.' }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract first page citation from text
  const extractPageFromText = (text) => {
    if (!text) return currentPage || 1;
    const match = text.match(/(?:Pages?|p\.)\s*(\d+)/i);
    if (match) {
      const p = parseInt(match[1], 10);
      if (!isNaN(p) && p > 0) return p;
    }
    return currentPage || 1;
  };

  // 1. SAVE TO NOTES ACTION (Stores question + AI answer)
  const handleSaveToNote = async (msg) => {
    if (!documentId || !msg) return;

    const msgKey = msg.serverId || msg.id;
    try {
      setActionLoading((prev) => ({ ...prev, [`note-${msgKey}`]: true }));

      const pageNum = extractPageFromText(msg.answer);
      const rawTitle = (msg.text || 'Q&A Note').trim().replace(/^[#\*\s]+/, '');
      const title = rawTitle.length > 55 ? `${rawTitle.substring(0, 55)}...` : rawTitle;
      const content = `### ❓ Question\n${msg.text}\n\n### 💡 Answer\n${msg.answer}`;

      const newNote = {
        title,
        content,
        page: pageNum,
      };

      const res = await addDocumentNote(documentId, newNote);
      const updatedNotes = res.data || [];
      onUpdateNotes?.(updatedNotes);
      setSavedNotes((prev) => ({
        ...prev,
        [msgKey]: true,
        ...(msg.id ? { [msg.id]: true } : {}),
      }));
    } catch (err) {
      console.error('Failed to save chat to notes:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`note-${msgKey}`]: false }));
    }
  };

  // 2. BOOKMARK CHAT ACTION (Bookmarks key insight with page link)
  const handleBookmarkChat = async (msg) => {
    if (!documentId || !msg) return;

    const msgKey = msg.serverId || msg.id;
    try {
      setActionLoading((prev) => ({ ...prev, [`bm-${msgKey}`]: true }));

      const pageNum = extractPageFromText(msg.answer);
      const rawLabel = (msg.text || 'Insight').trim().replace(/^[#\*\s]+/, '');
      const label = rawLabel.length > 55 ? `${rawLabel.substring(0, 55)}...` : rawLabel;
      const snippet = msg.answer ? `${msg.answer.substring(0, 130)}...` : `Insight on Page ${pageNum}`;

      const newBm = {
        label,
        page: pageNum,
        snippet,
      };

      const res = await addDocumentBookmark(documentId, newBm);
      const updatedBookmarks = res.data || [];
      onUpdateBookmarks?.(updatedBookmarks);
      setSavedBookmarks((prev) => ({
        ...prev,
        [msgKey]: true,
        ...(msg.id ? { [msg.id]: true } : {}),
      }));
    } catch (err) {
      console.error('Failed to bookmark chat insight:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`bm-${msgKey}`]: false }));
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Clear all conversation history for this document?')) {
      try {
        await deleteChatsByDocument(documentId);
        setMessages([]);
      } catch (err) {
        console.error('Failed to clear chat:', err);
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl shadow-xs overflow-hidden flex flex-col h-[650px] border border-slate-200/90 dark:border-[#1E293B]">
      {/* Ask Document Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/70 dark:bg-[#0c111e]/70 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <DocumindIcon className="w-8 h-8 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Ask Document
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/40">
                Document Q&A
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-lg">
              Ask any question to extract insights, find facts, and get accurate answers cited directly from this document.
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <FiTrash2 className="text-xs" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200/40 dark:border-indigo-900/40 shadow-xs">
              <FiZap className="text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Ask anything about this document
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Answers are grounded strictly in the contents of this file with page citations.
              </p>
            </div>

            {/* Suggested Question Chips */}
            <div className="space-y-2 pt-2 text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Suggested Prompts
              </p>
              <div className="flex flex-col gap-1.5">
                {suggestedQuestions.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sq)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#141B2D] hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-[#1E293B] text-xs text-slate-700 dark:text-slate-300 text-left transition-colors shadow-2xs group cursor-pointer"
                  >
                    <FiCornerDownRight className="text-indigo-500 text-xs flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span className="truncate">{sq}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Exchanges */}
        {messages.map((msg, index) => {
          const isNoteSaved =
            savedNotes[msg.id] ||
            (msg.serverId && savedNotes[msg.serverId]) ||
            notes.some((n) => n.content && msg.text && n.content.includes(`### ❓ Question\n${msg.text}`));
          const isBookmarked =
            savedBookmarks[msg.id] ||
            (msg.serverId && savedBookmarks[msg.serverId]);
          const isNoteLoading = actionLoading[`note-${msg.id}`];
          const isBmLoading = actionLoading[`bm-${msg.id}`];

          return (
            <div key={index} className="space-y-4">
              {/* User Question */}
              <div className="flex items-start justify-end gap-2.5">
                <div className="max-w-[85%] sm:max-w-[75%] bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-[13px] leading-relaxed shadow-sm">
                  {msg.text}
                </div>
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  <FiUser />
                </div>
              </div>

              {/* Assistant Answer */}
              {msg.answer && (
                <div className="flex items-start gap-2.5">
                  <DocumindIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div className="max-w-[90%] sm:max-w-[85%] bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] p-4 rounded-2xl rounded-tl-xs shadow-xs space-y-3">
                    {/* Formatted Content */}
                    <div className="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 leading-relaxed">
                      <MarkdownRenderer content={msg.answer} onSelectPage={onSelectCitationPage} />
                    </div>

                    {/* Action Bar (Save to Note, Bookmark, Copy) */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 flex-wrap gap-2">
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        Document-grounded
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* 1. SAVE TO NOTE BUTTON */}
                        <button
                          onClick={() => handleSaveToNote(msg)}
                          disabled={isNoteSaved || isNoteLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isNoteSaved
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40'
                              : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/70 dark:hover:bg-orange-950/40'
                          }`}
                          title="Save this question & answer to Document Notes"
                        >
                          {isNoteSaved ? (
                            <>
                              <FiCheck className="text-emerald-500 text-xs" />
                              <span>Saved to Notes</span>
                            </>
                          ) : (
                            <>
                              <FiBookOpen className="text-xs text-orange-500" />
                              <span>{isNoteLoading ? 'Saving...' : 'Save to Note'}</span>
                            </>
                          )}
                        </button>

                        {/* 2. BOOKMARK BUTTON */}
                        <button
                          onClick={() => handleBookmarkChat(msg)}
                          disabled={isBookmarked || isBmLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isBookmarked
                              ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/40 dark:border-violet-900/40'
                              : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/70 dark:hover:bg-violet-950/40'
                          }`}
                          title="Bookmark this insight with page reference"
                        >
                          <FiBookmark
                            className={`text-xs ${
                              isBookmarked
                                ? 'text-violet-600 dark:text-violet-400 fill-violet-600 dark:fill-violet-400'
                                : 'text-violet-500'
                            }`}
                          />
                          <span>{isBookmarked ? 'Bookmarked' : isBmLoading ? 'Saving...' : 'Bookmark'}</span>
                        </button>

                        {/* 3. COPY BUTTON */}
                        <button
                          onClick={() => handleCopy(msg.answer, msg.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <FiCheck className="text-emerald-500 text-xs" />
                          ) : (
                            <FiCopy className="text-xs" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <DocumindIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] p-3.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Analyzing document context...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-[#1E293B] bg-white dark:bg-[#0B0F17] flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl px-3.5 py-2 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question about ${documentTitle}...`}
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            aria-label="Send message"
          >
            <FiSend className="text-xs" />
          </button>
        </form>
      </div>
    </div>
  );
}
