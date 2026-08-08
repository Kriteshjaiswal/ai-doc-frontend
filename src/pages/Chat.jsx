import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSend, FiUser, FiCpu, FiFileText, FiTrash2 } from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { askQuestion, getChatHistory, deleteChat, deleteChatsByDocument } from '../api/chatApi';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';
import { ThreeDAiThinkingLoader } from '../components/ThreeDLoader';

function ChatInput({ onSend, loading }) {
  const [question, setQuestion] = useState('');

  const handleSend = () => {
    if (!question.trim() || loading) return;
    onSend(question.trim());
    setQuestion('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-100 dark:border-slate-800/80 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this document..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!question.trim() || loading}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <FiSend className="text-sm" />
        </button>
      </div>
    </div>
  );
}

export default function Chat() {
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(searchParams.get('documentId') || '');
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);
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
            time: item.askedAt,
          }));
          setQaPairs(history);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error(err);
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
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleSend = async (currentQuestion) => {
    if (!currentQuestion || !selectedDocId || loading) return;
    setLoading(true);

    try {
      const res = await askQuestion(Number(selectedDocId), currentQuestion);
      const newPair = {
        id: res.data?.id,
        question: res.data?.question || currentQuestion,
        answer: res.data?.answer || 'No response received.',
        time: res.data?.askedAt || new Date().toISOString(),
      };
      setQaPairs((prev) => [...prev, newPair]);
    } catch (err) {
      setQaPairs((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: currentQuestion,
          answer: `Error: ${err.message}`,
          time: new Date().toISOString(),
          error: true,
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
        setStatus({ type: 'success', message: 'Chat message deleted successfully' });
      } else if (deleteTarget.type === 'all') {
        await deleteChatsByDocument(deleteTarget.documentId);
        setQaPairs([]);
        setStatus({ type: 'success', message: 'All chats for this document cleared' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete chat' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const selectedDocName = documents.find((d) => String(d.id) === String(selectedDocId))?.fileName;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
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
        message={
          deleteTarget?.type === 'all'
            ? `Are you sure you want to clear all chat history for "${selectedDocName || 'this document'}"? This action cannot be undone.`
            : `Are you sure you want to delete this chat message?`
        }
        loading={deleting}
      />

      {/* Top Selector Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-md transition-all">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Chat</h1>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="flex-1 max-w-sm px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">Select a document to query...</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fileName}
              </option>
            ))}
          </select>
        </div>

        {selectedDocId && qaPairs.length > 0 && (
          <button
            onClick={() => setDeleteTarget({ type: 'all', documentId: Number(selectedDocId) })}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/50"
            title="Clear all chat history for this document"
          >
            <FiTrash2 className="text-sm" />
            Clear History
          </button>
        )}
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden shadow-md">
        {!selectedDocId ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-sm space-y-3">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/50 shadow-md">
                <FiFileText className="text-3xl text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Select a document to begin
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Choose an uploaded PDF document from the dropdown header above to start asking questions.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {qaPairs.length === 0 && !loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                      <FiCpu className="text-2xl text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs font-bold">Ask any question about this document</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px]">e.g., "Summarize the key points" or "What are the main findings?"</p>
                  </div>
                </div>
              )}

              {qaPairs.map((pair) => (
                <div key={pair.id || pair.time} className="group relative space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  {/* User Question */}
                  <div className="flex gap-3 justify-end items-start">
                    {pair.id && (
                      <button
                        onClick={() => setDeleteTarget({ type: 'single', id: pair.id })}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all self-center"
                        title="Delete this Q&A pair"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    )}
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10 rounded-br-xs">
                      <p className="whitespace-pre-wrap">{pair.question}</p>
                    </div>
                    <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md shadow-indigo-500/20 mt-0.5">
                      <FiUser className="text-sm" />
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3 justify-start items-start">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950/80 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mt-0.5 shadow-sm">
                      <FiCpu className="text-sm" />
                    </div>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-normal shadow-sm ${
                        pair.error
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-bl-xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{pair.answer}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* 3D AI Thinking Loading HUD */}
              {loading && (
                <div className="py-2">
                  <ThreeDAiThinkingLoader statusText="Analyzing document vectors & synthesizing AI answer..." />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <ChatInput onSend={handleSend} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}
