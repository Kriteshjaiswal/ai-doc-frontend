import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSend,
  FiFileText,
  FiTrash2,
  FiZap,
  FiPaperclip,
  FiHelpCircle,
} from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { askQuestion, getChatHistory, deleteChat, deleteChatsByDocument } from '../api/chatApi';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';
import { ThreeDAiThinkingLoader } from '../components/ThreeDLoader';

/**
 * Clean Markdown Renderer component to render bold, headings, lists, code blocks, and tables.
 */
function FormattedMarkdownText({ content }) {
  if (!content) return null;

  // Clean unwanted prefixes like "[Document QA Answer]:", "Document QA Answer:", etc.
  const cleanedContent = String(content)
    .replace(/^\[?Document QA Answer\]?:?\s*/i, '')
    .replace(/^\[?AI Answer\]?:?\s*/i, '')
    .replace(/^Answer:\s*/i, '');

  // Unescape any escaped markdown characters if present
  const unescaped = cleanedContent
    .replace(/\\([*_#`\-\[\]])/g, '$1')
    .replace(/\\n/g, '\n');

  const lines = unescaped.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  const parseInline = (text) => {
    // Parse **bold** and `code`
    const parts = [];
    let regex = /(\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const str = match[0];
      if (str.startsWith('**') && str.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
            {str.slice(2, -2)}
          </strong>
        );
      } else if (str.startsWith('`') && str.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]"
          >
            {str.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-2 p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto border border-slate-800"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xs font-bold text-slate-900 dark:text-white mt-3 mb-1">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-4 mb-1.5">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-4 mb-2">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-xs text-slate-800 dark:text-slate-200 leading-relaxed my-0.5">
          {parseInline(trimmed.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const textAfterNumber = trimmed.replace(/^\d+\.\s/, '');
      elements.push(
        <li key={index} className="ml-4 list-decimal text-xs text-slate-800 dark:text-slate-200 leading-relaxed my-0.5">
          {parseInline(textAfterNumber)}
        </li>
      );
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={index} className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed my-1">
          {parseInline(line)}
        </p>
      );
    }
  });

  return <div className="space-y-1">{elements}</div>;
}

const defaultGeneralSuggestions = [
  'What is REST API architecture?',
  'Explain Object-Oriented Programming concepts',
  'How does vector semantic search work?',
  'Explain Microservices vs Monolith',
];

function getDynamicSuggestions(selectedDoc) {
  if (!selectedDoc) {
    return defaultGeneralSuggestions;
  }

  const rawName = selectedDoc.fileName || 'this document';
  const cleanName = rawName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  const lowerName = cleanName.toLowerCase();
  const text = (selectedDoc.extractedText || '').toLowerCase();
  const meta = (selectedDoc.meta || '').toLowerCase();

  const suggestions = [
    `Summarize ${cleanName} in 2-3 sentences`,
  ];

  if (lowerName.includes('resume') || meta.includes('resume') || text.includes('skills') || text.includes('experience')) {
    suggestions.push(`What key skills & experience are highlighted in ${cleanName}?`);
    suggestions.push(`Summarize candidate background & achievements`);
    suggestions.push(`What technical projects or roles are mentioned?`);
  } else if (lowerName.includes('spec') || lowerName.includes('architecture') || text.includes('architecture') || text.includes('pipeline')) {
    suggestions.push(`Explain system architecture & data flow in ${cleanName}`);
    suggestions.push(`What are the key technical specifications & components?`);
    suggestions.push(`Summarize requirements & system design`);
  } else if (lowerName.includes('agreement') || lowerName.includes('contract') || text.includes('sla') || text.includes('terms')) {
    suggestions.push(`What are the key terms, SLAs & obligations in ${cleanName}?`);
    suggestions.push(`Are there liability caps or termination clauses?`);
    suggestions.push(`What is the scope of services in this contract?`);
  } else if (lowerName.includes('update') || lowerName.includes('investor') || lowerName.includes('report') || text.includes('revenue') || text.includes('growth')) {
    suggestions.push(`What are the financial highlights & growth rates in ${cleanName}?`);
    suggestions.push(`Summarize performance metrics & key takeaways`);
    suggestions.push(`What strategic goals & risks are outlined?`);
  } else {
    suggestions.push(`What are the main key points and takeaways in ${cleanName}?`);
    suggestions.push(`Explain the core topic discussed in this document`);
    suggestions.push(`What key definitions or concepts are mentioned in ${cleanName}?`);
  }

  return suggestions.slice(0, 4);
}

function getDocSummary(selectedDoc) {
  if (!selectedDoc) return null;

  const rawText = selectedDoc.extractedText || '';
  if (!rawText.trim()) {
    return '**Core Content & Insights:**\n\nUnable to generate a reliable summary because the document content could not be sufficiently analyzed.';
  }

  // If rawText already contains "**Core Content & Insights:**", return it directly
  if (rawText.includes('**Core Content & Insights:**')) {
    return rawText;
  }

  const lowerText = rawText.toLowerCase();
  let typeDesc = "The document provides detailed information regarding core subject principles, functional guidelines, and key topic highlights.";

  if (lowerText.includes("book") || lowerText.includes("isbn") || lowerText.includes("edition") || (lowerText.includes("contents") && lowerText.includes("chapter"))) {
    if (lowerText.includes("design pattern") || lowerText.includes("object-oriented") || lowerText.includes("gang of four")) {
      typeDesc = "The book presents 23 reusable design patterns for object-oriented software design, organizing them into creational, structural, and behavioral categories.";
    } else {
      typeDesc = "The book provides a structured educational and conceptual overview divided across core chapters and key topic areas.";
    }
  } else if (lowerText.includes("rrb") || lowerText.includes("ibps") || lowerText.includes("syllabus") || lowerText.includes("prelims") || lowerText.includes("exam pattern")) {
    typeDesc = "The document outlines the competitive examination selection process, detailing Preliminary Exam, Mains Exam, and Interview evaluation stages.";
  } else if (lowerText.includes("resume") || lowerText.includes("curriculum vitae") || (lowerText.includes("skills") && lowerText.includes("experience") && lowerText.includes("education"))) {
    typeDesc = "The document outlines candidate professional qualifications, detailing technical skill sets, career history, achievements, and key project accomplishments.";
  } else if (lowerText.includes("agreement") || lowerText.includes("contract") || lowerText.includes("sla") || lowerText.includes("liability")) {
    typeDesc = "The legal document establishes a formal agreement and operational framework, defining service level commitments, compliance rules, and partner terms.";
  } else if (lowerText.includes("abstract") && (lowerText.includes("journal") || lowerText.includes("conference") || lowerText.includes("references"))) {
    typeDesc = "The research paper investigates core domain methodology and findings, presenting a structured theoretical framework and empirical results.";
  } else if (lowerText.includes("specification") || lowerText.includes("api reference") || lowerText.includes("technical spec")) {
    typeDesc = "The technical specification details system components, data schemas, interface protocols, and operational requirements.";
  }

  const sentences = rawText
    .split(/(?<=[.!?\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && !s.toLowerCase().startsWith("page") && !s.toLowerCase().includes("copyright") && !s.includes("===") && !s.includes("---"));

  const docSentences = sentences.slice(0, 2).join(' ');
  return `**Core Content & Insights:**\n\n${typeDesc} ${docSentences}`.trim();
}

export default function Chat() {
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(searchParams.get('documentId') || '');
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (selectedDocId) {
      getChatHistory(selectedDocId)
        .then((res) => {
          if (isCancelled) return;
          const history = (res.data || []).reverse().map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            source: selectedDoc?.fileName ? `${selectedDoc.fileName} · context` : null,
            time: item.askedAt,
          }));
          setQaPairs(history);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error(err);
          setQaPairs([]);
        });
    } else {
      setQaPairs([]);
    }
    return () => {
      isCancelled = true;
    };
  }, [selectedDocId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaPairs, loading]);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocuments();
      const docs = res.data || [];
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedDoc = documents.find((d) => String(d.id) === String(selectedDocId));
  const suggestionChips = useMemo(() => getDynamicSuggestions(selectedDoc), [selectedDoc]);

  const handleSend = async (questionToSend) => {
    const text = questionToSend || inputQuestion;
    if (!text.trim() || loading) return;
    setInputQuestion('');
    setLoading(true);

    try {
      const docIdParam = selectedDocId ? Number(selectedDocId) : null;
      const res = await askQuestion(docIdParam, text);
      const answerContent = res.data?.answer || res.data || 'No response received.';

      const newPair = {
        id: res.data?.id || Date.now(),
        question: res.data?.question || text,
        answer: answerContent,
        source: selectedDoc ? `${selectedDoc.fileName} · context` : null,
        time: res.data?.askedAt || new Date().toISOString(),
      };

      setQaPairs((prev) => [...prev, newPair]);
    } catch (err) {
      setQaPairs((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: text,
          answer: 'Unable to get a response right now. Please try again.',
          error: true,
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === 'single') {
        await deleteChat(deleteTarget.id);
        setQaPairs((prev) => prev.filter((pair) => pair.id !== deleteTarget.id));
        setStatus({ type: 'success', message: 'Chat message deleted' });
      } else if (deleteTarget.type === 'all' && selectedDocId) {
        await deleteChatsByDocument(Number(selectedDocId));
        setQaPairs([]);
        setStatus({ type: 'success', message: 'All chat history cleared' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete chat' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteTarget?.type === 'all' ? 'Clear All History' : 'Delete Chat'}
        message="Are you sure you want to delete this chat message?"
        loading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Chat
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedDoc ? `Answers grounded in ${selectedDoc.fileName}` : 'Ask questions about your documents or general topics.'}
          </p>
        </div>

        {/* Document Selector Header Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-[#1E293B] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Documents / General AI Chat</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fileName}
              </option>
            ))}
          </select>

          {selectedDocId && qaPairs.length > 0 && (
            <button
              onClick={() => setDeleteTarget({ type: 'all', documentId: Number(selectedDocId) })}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Clear chat history"
            >
              <FiTrash2 className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Split Layout: Main Chat (Left) + Context Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAIN CHAT CONTAINER */}
        <div className="lg:col-span-8 bg-white dark:bg-[#141B2D] rounded-3xl border border-slate-200/80 dark:border-[#1E293B] flex flex-col h-[calc(100vh-16rem)] overflow-hidden shadow-xs">
          {/* Chat Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            {qaPairs.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <FiHelpCircle className="text-2xl" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Ask a question to start
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                  Query document insights or ask general AI questions.
                </p>
              </div>
            )}

            {qaPairs.map((pair) => (
              <div key={pair.id || pair.time} className="space-y-4">
                {/* User Message (Right Aligned Bubble) */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-medium leading-relaxed rounded-br-xs shadow-xs">
                    {pair.question}
                  </div>
                </div>

                {/* AI Response Card (Left Aligned) */}
                <div className="flex justify-start">
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl border space-y-3 shadow-xs ${
                      pair.error
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-50 dark:bg-[#0F1422] border-slate-200/60 dark:border-[#1E293B]'
                    }`}
                  >
                    <FormattedMarkdownText content={pair.answer} />

                    {/* Source citation tag */}
                    {pair.source && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#141B2D] border border-slate-200/60 dark:border-[#1E293B] text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <FiPaperclip className="text-xs text-slate-400" />
                        <span>{pair.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 3D Thinking Loader when waiting */}
            {loading && (
              <div className="py-2">
                <ThreeDAiThinkingLoader statusText="Processing AI answer..." />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-[#1E293B]/60 flex items-center gap-2 overflow-x-auto custom-scrollbar bg-slate-50/30 dark:bg-[#0F1422]/30">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E293B] hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-[#1E293B] bg-white dark:bg-[#141B2D]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about your documents or general topics..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#0F1422] border border-slate-200 dark:border-[#1E293B] rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuestion.trim() || loading}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <FiSend className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CONTEXT PANEL */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI DOCUMENT SUMMARY CARD */}
          {selectedDoc && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-slate-50 dark:from-[#171638] dark:via-[#1C1844] dark:to-[#161B3D] border border-indigo-100 dark:border-indigo-900/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  <FiZap className="text-indigo-500 text-xs" />
                  <span>AI DOCUMENT SUMMARY</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Live Insights
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {selectedDoc.fileName}
                </h4>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-[#0F1422]/80 p-3.5 rounded-2xl border border-indigo-50 dark:border-[#1E293B] max-h-72 overflow-y-auto custom-scrollbar shadow-2xs">
                  <FormattedMarkdownText content={getDocSummary(selectedDoc)} />
                </div>
              </div>
            </div>
          )}

          <div className="p-5 rounded-3xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Context
            </h3>

            {selectedDoc ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                    <FiFileText className="text-base" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {selectedDoc.fileName}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {selectedDoc.meta || 'PDF Document'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1E293B] text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Size</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {(selectedDoc.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Uploaded</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 dark:text-slate-500">
                No specific document selected. Operating in general AI mode.
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Relevant sections
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F1422] border border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <FiZap className="text-xs text-amber-500" />
                <span>{selectedDoc ? `${selectedDoc.fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')} · Overview` : 'Ingestion Pipeline & Retrieval'}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F1422] border border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <FiZap className="text-xs text-amber-500" />
                <span>Concept Definitions & Terms</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F1422] border border-slate-100 dark:border-[#1E293B] text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <FiZap className="text-xs text-amber-500" />
                <span>Revision & Key Highlights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
