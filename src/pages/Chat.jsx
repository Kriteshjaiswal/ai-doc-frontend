import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiSend,
  FiTrash2,
  FiPaperclip,
  FiZap,
  FiFileText,
  FiLayers,
  FiCompass,
  FiCheck,
  FiCopy,
  FiBookOpen,
} from 'react-icons/fi';
import { askQuestion, getChatHistory, deleteChat, deleteChatsByDocument } from '../api/chatApi';
import { getAllDocuments, addDocumentNote } from '../api/documentApi';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';
import { ThreeDAiThinkingLoader } from '../components/ThreeDLoader';
import CustomDropdown from '../components/CustomDropdown';

/**
 * CodeBlock with Copy to Clipboard
 */
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0B0F19] text-slate-200 text-xs shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#141B2D] border-b border-slate-700/50 text-[11px] font-mono text-slate-400">
        <span className="uppercase font-semibold tracking-wider text-indigo-400">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
        >
          {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline formatting: **bold**, `code`, and [Page X] citations
 */
function renderInlineContent(text) {
  if (!text) return null;

  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\[Pages?\s+\d+(?:-\d+)?\])/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-black/50 text-indigo-600 dark:text-indigo-300 font-mono text-[11.5px] border border-slate-300 dark:border-white/10 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^\[Pages?\s+\d+(?:-\d+)?\]$/i.test(part)) {
      return (
        <span
          key={idx}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-300 dark:border-indigo-500/40"
        >
          📄 {part.replace(/[\[\]]/g, '')}
        </span>
      );
    }
    return part;
  });
}

/**
 * Markdown Table Formatter (| col1 | col2 |)
 */
function MarkdownTable({ lines }) {
  if (!lines || lines.length < 2) return null;

  const parseRow = (line) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  const headers = parseRow(lines[0]);
  const isSeparator = (line) => /^\|?[\s:-|-]+\|?$/.test(line.trim());
  const bodyRows = lines.slice(1).filter((l) => !isSeparator(l)).map(parseRow);

  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700/80 shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-200/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700/80">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {renderInlineContent(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-slate-50 dark:bg-slate-900/60">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3.5 py-2.5 text-slate-800 dark:text-slate-200 leading-relaxed">
                  {renderInlineContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * High-Readability Markdown Formatter
 */
function FormattedMarkdownText({ content }) {
  if (!content) return null;

  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIdx = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ type: 'text', content: content.slice(lastIdx, match.index) });
    }
    parts.push({ type: 'code', language: match[1], code: match[2].trim() });
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIdx) });
  }

  return (
    <div className="space-y-3 leading-relaxed text-sm text-slate-900 dark:text-slate-100">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          return <CodeBlock key={pIdx} language={part.language} code={part.code} />;
        }
        return <FormattedTextChunk key={pIdx} text={part.content} />;
      })}
    </div>
  );
}

function FormattedTextChunk({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let tableBuffer = [];

  const flushTable = (key) => {
    if (tableBuffer.length > 0) {
      elements.push(<MarkdownTable key={`tbl-${key}`} lines={[...tableBuffer]} />);
      tableBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableBuffer.push(trimmed);
      return;
    } else {
      flushTable(idx);
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 pt-3 pb-1">
          {renderInlineContent(trimmed.replace('### ', ''))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-200 dark:border-slate-800">
          {renderInlineContent(trimmed.replace('## ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={idx} className="text-lg font-extrabold text-slate-900 dark:text-white pt-2 pb-1">
          {renderInlineContent(trimmed.replace('# ', ''))}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      elements.push(
        <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
          {renderInlineContent(itemText)}
        </li>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      elements.push(
        <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
          {renderInlineContent(itemText)}
        </li>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="pl-3 py-1 my-1 border-l-2 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-r-lg text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic">
          {renderInlineContent(trimmed.replace('> ', ''))}
        </blockquote>
      );
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
          {renderInlineContent(trimmed)}
        </p>
      );
    }
  });

  flushTable('final');
  return <div className="space-y-1.5">{elements}</div>;
}

const defaultGeneralSuggestions = [
  'What is REST API architecture?',
  'Explain Object-Oriented Programming concepts',
  'How does vector semantic search work?',
  'Explain Microservices vs Monolith',
];

function getDynamicSuggestions(selectedDoc, qaPairs = []) {
  if (qaPairs && qaPairs.length > 0) {
    const lastTurn = qaPairs[qaPairs.length - 1];
    const lastQ = (lastTurn.question || '').toLowerCase();

    // 1. OOP / Programming Concepts
    if (lastQ.includes('oop') || lastQ.includes('object-oriented') || lastQ.includes('class') || lastQ.includes('inheritance') || lastQ.includes('polymorphism')) {
      return [
        'Give code examples of Inheritance & Polymorphism in Java',
        'Explain Encapsulation vs Abstraction with a real analogy',
        'What are the SOLID design principles in OOP?',
        'What are common OOP interview questions & answers?',
      ];
    }

    // 2. Database & SQL / Vector DB
    if (lastQ.includes('database') || lastQ.includes('sql') || lastQ.includes('query') || lastQ.includes('table') || lastQ.includes('schema') || lastQ.includes('index') || lastQ.includes('vector db') || lastQ.includes('vector')) {
      return [
        'Explain Vector Embeddings and Vector Search indexing',
        'What is the difference between SQL and Vector Databases?',
        'Explain ACID properties with real-world examples',
        'How do JOINs and Foreign Keys work under the hood?',
      ];
    }

    // 3. APIs, REST, Microservices
    if (lastQ.includes('api') || lastQ.includes('rest') || lastQ.includes('microservice') || lastQ.includes('graphql') || lastQ.includes('grpc')) {
      return [
        'Compare REST vs GraphQL vs gRPC pros and cons',
        'How does JWT and OAuth2 authentication work in APIs?',
        'What are API rate limiting and security best practices?',
        'Explain API Gateway and Circuit Breaker pattern',
      ];
    }

    // 4. Spring Boot / Backend / Java
    if (lastQ.includes('spring') || lastQ.includes('backend') || lastQ.includes('java') || lastQ.includes('jvm')) {
      return [
        'Explain Spring Dependency Injection & IoC container',
        'How does Spring Security filter chain authenticate requests?',
        'What are Spring Boot performance optimization best practices?',
        'Explain Spring Data JPA repository and transaction management',
      ];
    }

    // 5. Document Summary / Overview follow-ups
    if (lastQ.includes('summary') || lastQ.includes('summarize') || lastQ.includes('overview') || lastQ.includes('takeaway')) {
      return [
        'What are the key risks, obligations, or liabilities mentioned?',
        'Extract important dates, milestones, and deadlines',
        'What technical or business requirements are specified?',
        'Summarize the primary recommendations and next steps',
      ];
    }

    // 6. Risks, Compliance, Legal
    if (lastQ.includes('risk') || lastQ.includes('liability') || lastQ.includes('clause') || lastQ.includes('contract') || lastQ.includes('agreement')) {
      return [
        'What risk mitigation strategies are outlined?',
        'What are the termination and penalty conditions?',
        'Who are the responsible parties and governing jurisdictions?',
        'Are there confidentiality or NDA clauses?',
      ];
    }

    // Generic conversational follow-ups
    return [
      'Can you give a practical step-by-step example?',
      'What are the key pros and cons of this approach?',
      'Explain common mistakes to avoid in practice',
      'Simplify this concept with a real-world analogy',
    ];
  }

  // Initial suggestions when no chat history exists
  if (!selectedDoc) {
    return defaultGeneralSuggestions;
  }

  const rawName = selectedDoc.fileName || 'this document';
  const cleanName = rawName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  const lowerName = cleanName.toLowerCase();
  const text = (selectedDoc.extractedText || '').toLowerCase();
  const meta = (selectedDoc.meta || '').toLowerCase();

  const suggestions = [`Summarize ${cleanName} in 2-3 sentences`];

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
  const [activeQuestion, setActiveQuestion] = useState('');
  const [inputQuestion, setInputQuestion] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const paramDocId = searchParams.get('documentId');
    if (paramDocId !== null) {
      setSelectedDocId(paramDocId);
    }
  }, [searchParams]);

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
  const suggestionChips = useMemo(() => getDynamicSuggestions(selectedDoc, qaPairs), [selectedDoc, qaPairs]);

  const handleSend = async (questionToSend) => {
    const text = questionToSend || inputQuestion;
    if (!text.trim() || loading) return;
    setInputQuestion('');
    setActiveQuestion(text.trim());
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
      setActiveQuestion('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'single') {
        await deleteChat(deleteTarget.id);
        setQaPairs((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setStatus({ type: 'success', message: 'Chat message deleted' });
      } else if (deleteTarget.type === 'all') {
        if (selectedDocId) {
          await deleteChatsByDocument(Number(selectedDocId));
        }
        setQaPairs([]);
        setStatus({ type: 'success', message: 'Chat history cleared' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const [savedNotes, setSavedNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  const handleSaveToNote = async (pair) => {
    if (!selectedDocId || !pair || pair.error) return;
    try {
      setSavingNoteId(pair.id);
      const rawTitle = (pair.question || 'Q&A Note').trim().replace(/^[#\*\s]+/, '');
      const title = rawTitle.length > 55 ? `${rawTitle.substring(0, 55)}...` : rawTitle;
      const content = `### ❓ Question\n${pair.question}\n\n### 💡 Answer\n${pair.answer}`;
      const notePayload = {
        title,
        content,
        page: 1,
      };
      await addDocumentNote(Number(selectedDocId), notePayload);
      setSavedNotes((prev) => ({ ...prev, [pair.id]: true }));
      setStatus({ type: 'success', message: 'Saved to Document Notes!' });
    } catch (err) {
      console.error('Failed to save note:', err);
      setStatus({ type: 'error', message: 'Failed to save note' });
    } finally {
      setSavingNoteId(null);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden space-y-0 select-none">
      {status.message && (
        <div className="mb-2 flex-shrink-0">
          <StatusMessage
            type={status.type}
            message={status.message}
            onDismiss={() => setStatus({ type: null, message: null })}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title={deleteTarget?.type === 'all' ? 'Clear All History' : 'Delete Chat'}
        description="Are you sure you want to delete this chat item? This action cannot be undone."
      />

      {/* Strict Fixed-Height Grid Layout (Both Panels Fixed to 78vh / exactly identical height) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 h-[calc(100vh-8rem)] sm:h-[calc(100vh-9rem)] lg:h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] min-h-0 overflow-hidden">
        
        {/* Left Main Chat Box - Never expands, only inner messages scroll */}
        <div className="lg:col-span-2 flex flex-col h-full max-h-full glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-[#0E1424]">
          
          {/* 1. Header (Fixed 56px height) */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#101626] flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
            {/* Left: Direct AI Chat Title & Status */}
            <div className="flex items-center gap-3 min-w-0">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">
                    Ask AI
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-bold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Direct AI Chat
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selectedDoc ? (
                    <>
                      Chatting with <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedDoc.fileName}</span>
                    </>
                  ) : (
                    'Ask anything across programming, documents, or general topics'
                  )}
                </p>
              </div>
            </div>

            {/* Right: Document Selector Dropdown & Clear History */}
            <div className="flex items-center gap-2">
              <CustomDropdown
                value={selectedDocId}
                onChange={setSelectedDocId}
                options={[
                  { value: '', label: 'All Documents / General AI Chat', icon: FiLayers },
                  ...documents.map((doc) => ({
                    value: doc.id,
                    label: doc.fileName,
                    icon: FiFileText,
                  })),
                ]}
                placeholder="Select Document"
                menuWidth="w-72 sm:w-80"
                align="right"
                searchPlaceholder="Filter documents..."
              />

              {qaPairs.length > 0 && (
                <button
                  onClick={() => setDeleteTarget({ type: 'all' })}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Clear chat history"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Messages List Scroll Area (STRICT flex-1 min-h-0 h-0 — ONLY THIS SCROLLS) */}
          <div className="flex-1 min-h-0 h-0 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar select-text overscroll-contain bg-slate-50/40 dark:bg-[#0A0E1A]/60">
            {qaPairs.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
                  <FiZap className="text-xl" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {selectedDoc ? `Ask about "${selectedDoc.fileName}"` : 'Direct AI Assistant'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  {selectedDoc
                    ? 'Ask questions, request summaries, or inspect key insights from this document.'
                    : 'Ask any technical, general, or document question to get instant human-readable answers.'}
                </p>
              </div>
            )}

            {qaPairs.map((pair) => (
              <div key={pair.id} className="space-y-3">
                {/* User message bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-xs bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-600/20 leading-relaxed">
                    {pair.question}
                  </div>
                </div>

                {/* AI response bubble (High-Contrast Dark Glass Theme) */}
                <div className="flex justify-start">
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] p-4 sm:p-5 rounded-3xl rounded-tl-xs border space-y-3 shadow-md ${
                      pair.error
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-100 dark:bg-[#131A2D] border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 shadow-slate-200/50 dark:shadow-2xl'
                    }`}
                  >
                    <FormattedMarkdownText content={pair.answer} />

                    {/* Source citation & Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex-wrap gap-2 text-[11px]">
                      {pair.source ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-[#0D121F] border border-slate-300/80 dark:border-slate-700/70 text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                          <FiPaperclip className="text-xs text-slate-400" />
                          <span>{pair.source}</span>
                        </div>
                      ) : <span />}

                      <div className="flex items-center gap-2">
                        {selectedDocId && (
                          <button
                            onClick={() => handleSaveToNote(pair)}
                            disabled={savedNotes[pair.id] || savingNoteId === pair.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              savedNotes[pair.id]
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40'
                                : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/70 dark:hover:bg-orange-950/40'
                            }`}
                            title="Save this to Document Notes"
                          >
                            {savedNotes[pair.id] ? (
                              <>
                                <FiCheck className="text-emerald-500 text-xs" />
                                <span>Saved to Notes</span>
                              </>
                            ) : (
                              <>
                                <FiBookOpen className="text-xs text-orange-500" />
                                <span>{savingNoteId === pair.id ? 'Saving...' : 'Save to Note'}</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(pair.answer || '');
                            setStatus({ type: 'success', message: 'Copied to clipboard' });
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                          title="Copy Answer"
                        >
                          <FiCopy className="text-xs" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking Loader with Live Question Analysis when waiting */}
            {loading && (
              <div className="py-2">
                <ThreeDAiThinkingLoader
                  currentQuestion={activeQuestion}
                  docName={selectedDoc?.fileName}
                  statusText="AI is analyzing & synthesizing response..."
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Quick Suggestion Chips (Fixed Height, Pinned) */}
          <div className="px-4 py-2 border-t border-slate-200/70 dark:border-slate-800 bg-slate-100/80 dark:bg-[#0A0E18] flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-[#151D30] hover:bg-indigo-50 dark:hover:bg-indigo-600/30 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 text-[11px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 border border-slate-300/70 dark:border-slate-700/80 shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* 4. Write / Input Panel (Fixed Height, Dark Theme Harmonized) */}
          <div className="p-3 sm:p-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#0D121F] flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  selectedDoc
                    ? `Ask anything about ${selectedDoc.fileName}...`
                    : 'Ask AI anything or select a document above...'
                }
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#151D30] border border-slate-300/80 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-2xs"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuestion.trim() || loading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 flex-shrink-0"
              >
                <FiSend className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Context Panel (Fixed Height Matching Left Box, Scrollable Content) */}
        <div className="hidden lg:flex flex-col h-full max-h-full glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-[#0E1424]">
          
          {/* Header (Pinned) */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
              <FiCompass />
            </div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Context & Scope
            </h2>
          </div>

          {/* Scrollable Body (STRICT flex-1 min-h-0 h-0) */}
          <div className="flex-1 min-h-0 h-0 overflow-y-auto py-3 space-y-3 custom-scrollbar">
            {selectedDoc ? (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-[#141C30] border border-indigo-200/70 dark:border-indigo-900/60">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    📄 {selectedDoc.fileName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedDoc.pageCount ? `${selectedDoc.pageCount} pages · ` : ''}
                    {new Date(selectedDoc.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-2">
                  <FormattedMarkdownText content={getDocSummary(selectedDoc)} />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Global AI Chat Mode
                </p>
                <p>
                  Responses draw from broad AI knowledge base across programming, technology, and science.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Tip: Select any document from the dropdown to focus the AI answers on that specific file.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Actions (Pinned) */}
          {selectedDoc && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 flex-shrink-0">
              <Link
                to={`/documents/${selectedDoc.id}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#151D30] hover:bg-slate-200 dark:hover:bg-[#1D2742] text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-colors"
              >
                <FiFileText className="text-xs" />
                <span>View Document Analysis</span>
              </Link>

              <Link
                to={`/flashcards`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
              >
                <FiLayers className="text-xs" />
                <span>Generate Flashcards</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
