import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiBookOpen,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiClock,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiFolder,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiHelpCircle,
  FiLayers,
} from 'react-icons/fi';
import {
  getAllDocuments,
  getDocumentNotes,
  addDocumentNote,
  deleteDocumentNote,
} from '../api/documentApi';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ListSkeleton } from '../components/LoadingSkeleton';

export default function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');

  // Accordion Expanded State: Set of open note IDs
  const [expandedNoteIds, setExpandedNoteIds] = useState(new Set());

  // Add / Edit Note Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notePage, setNotePage] = useState('1');
  const [savingNote, setSavingNote] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('write');

  // Load all documents
  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setLoadingDocs(true);
      const res = await getAllDocuments();
      const docs = res.data || [];
      setDocuments(docs);

      // Check if URL has ?docId=...
      const queryDocId = searchParams.get('docId');
      if (queryDocId && docs.some((d) => String(d.id) === queryDocId)) {
        setSelectedDocId(Number(queryDocId));
      }
    } catch (err) {
      console.error('Failed to fetch documents for notes:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Load notes whenever selected document changes
  useEffect(() => {
    if (!selectedDocId) {
      setNotes([]);
      setExpandedNoteIds(new Set());
      return;
    }

    const doc = documents.find((d) => d.id === selectedDocId);
    if (doc && doc.notes && doc.notes.length > 0) {
      setNotes(doc.notes);
      // Auto-expand the first question for convenience
      if (doc.notes[0]?.id) {
        setExpandedNoteIds(new Set([doc.notes[0].id]));
      }
    } else {
      fetchNotesForDoc(selectedDocId);
    }
  }, [selectedDocId]);

  const fetchNotesForDoc = async (docId) => {
    try {
      setLoadingNotes(true);
      const res = await getDocumentNotes(docId);
      const fetchedNotes = res.data || [];
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && fetchedNotes[0]?.id) {
        setExpandedNoteIds(new Set([fetchedNotes[0].id]));
      }
    } catch (err) {
      console.error(`Failed to load notes for doc ${docId}:`, err);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleSelectDoc = (docId) => {
    setSelectedDocId(docId);
    setSearchParams({ docId });
    setQuestionSearch('');
  };

  const handleBackToAllDocs = () => {
    setSelectedDocId(null);
    setSearchParams({});
    setQuestionSearch('');
  };

  // Toggle individual question accordion
  const toggleAccordion = (noteId) => {
    setExpandedNoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedNoteIds(new Set(notes.map((n) => n.id)));
  };

  const handleCollapseAll = () => {
    setExpandedNoteIds(new Set());
  };

  const handleOpenAddModal = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setNotePage('1');
    setActiveTab('write');
    setShowModal(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title || '');
    setNoteContent(note.content || '');
    setNotePage(note.page ? String(note.page) : '1');
    setActiveTab('write');
    setShowModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim() || !selectedDocId) return;

    try {
      setSavingNote(true);
      const notePayload = {
        id: editingNoteId || undefined,
        title: noteTitle.trim(),
        content: noteContent.trim(),
        page: parseInt(notePage, 10) || 1,
      };

      const res = await addDocumentNote(selectedDocId, notePayload);
      const updatedNotes = res.data || [];
      setNotes(updatedNotes);

      // Auto expand saved note
      if (updatedNotes.length > 0) {
        setExpandedNoteIds((prev) => new Set([...prev, updatedNotes[0].id]));
      }

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === selectedDocId
            ? { ...d, notes: updatedNotes, notesCount: updatedNotes.length }
            : d
        )
      );

      setShowModal(false);
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!selectedDocId) return;
    try {
      const res = await deleteDocumentNote(selectedDocId, noteId);
      const updatedNotes = res.data || [];
      setNotes(updatedNotes);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === selectedDocId
            ? { ...d, notes: updatedNotes, notesCount: updatedNotes.length }
            : d
        )
      );
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleCopyNote = (note) => {
    const text = `# ${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract question title and body
  const parseNoteData = (note) => {
    let question = note.title || 'General Note';
    let body = note.content || '';

    if (note.content && note.content.includes('### ❓ Question')) {
      const qMatch = note.content.match(/### ❓ Question\s*\n([\s\S]*?)(?=\n\n### 💡 Answer|$)/);
      const aMatch = note.content.match(/### 💡 Answer\s*\n([\s\S]*)$/);
      if (qMatch && qMatch[1]) {
        question = qMatch[1].trim();
      }
      if (aMatch && aMatch[1]) {
        body = aMatch[1].trim();
      }
    }

    return { question, body };
  };

  // Filtered lists
  const filteredDocs = documents.filter((d) =>
    (d.fileName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  const filteredNotes = notes.filter((n) => {
    const q = questionSearch.toLowerCase();
    const { question, body } = parseNoteData(n);
    return (
      question.toLowerCase().includes(q) ||
      body.toLowerCase().includes(q) ||
      (n.page && `page ${n.page}`.includes(q))
    );
  });

  const totalAllNotesCount = documents.reduce(
    (acc, d) => acc + (d.notesCount || (d.notes ? d.notes.length : 0)),
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ────────────────────────────────────────────────────────────
          VIEW 1: ONLY SHOW PDF NAMES (Initial Grid View)
          ──────────────────────────────────────────────────────────── */}
      {!selectedDocId && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/50 dark:border-orange-900/40 shadow-xs">
                <FiBookOpen className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Document Notes
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40">
                    {documents.length} PDFs • {totalAllNotesCount} Notes
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Click on any PDF document below to explore its saved questions and generated notes
                </p>
              </div>
            </div>

            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all duration-200 active:scale-98"
            >
              <FiPlus className="text-base" />
              <span>Upload PDF</span>
            </Link>
          </div>

          {/* Search PDF Documents */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-[#1E293B]">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search PDF document by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          {/* PDF Documents Grid */}
          {loadingDocs ? (
            <ListSkeleton count={4} />
          ) : documents.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-slate-200/80 dark:border-[#1E293B] text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl">
                <FiFolder />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No PDF Documents Found
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a PDF document first to start creating and saving notes.
                </p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                <FiPlus />
                <span>Upload PDF Document</span>
              </Link>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="glass-card p-10 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] text-center text-xs text-slate-400">
              No PDF documents match "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => {
                const docNoteCount =
                  doc.notesCount !== undefined
                    ? doc.notesCount
                    : doc.notes
                    ? doc.notes.length
                    : 0;

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.id)}
                    className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] hover:border-indigo-400/80 dark:hover:border-indigo-500/60 hover:shadow-md cursor-pointer select-none transition-all duration-200 group flex flex-col justify-between space-y-4 bg-white/70 dark:bg-[#0E131F]/80"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-200/40 dark:border-indigo-900/40 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                        <FiFileText className="text-xl" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                          title={doc.fileName}
                        >
                          {doc.fileName}
                        </h3>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] font-mono text-slate-400">
                            {doc.pageCount || 1} {doc.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span
                            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                              docNoteCount > 0
                                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200/40 dark:border-orange-900/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            {docNoteCount} {docNoteCount === 1 ? 'Question Note' : 'Question Notes'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1E293B]/70 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <span>View Questions & Notes</span>
                      <FiChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          VIEW 2 & 3: INSIDE SELECTED PDF -> SHOW QUESTIONS & DROPDOWNS
          ──────────────────────────────────────────────────────────── */}
      {selectedDocId && selectedDoc && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleBackToAllDocs}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#141B2D] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <FiArrowLeft className="text-sm" />
              <span>Back to All PDFs</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                to={`/documents/${selectedDoc.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#141B2D] hover:bg-slate-200 dark:hover:bg-[#1E293B] rounded-xl transition-colors"
                title="Open in Document Viewer"
              >
                <span>Document Viewer</span>
                <FiExternalLink className="text-[11px]" />
              </Link>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <FiPlus className="text-sm" />
                <span>Add Note</span>
              </button>
            </div>
          </div>

          {/* Active PDF Banner Card */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-2xs space-y-3 bg-white/80 dark:bg-[#0E131F]/90">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <FiFileText className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    PDF Document Notes
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    • {selectedDoc.pageCount || 1} Pages
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200/40 dark:border-orange-900/40">
                    {notes.length} {notes.length === 1 ? 'Question Note' : 'Question Notes'}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                  {selectedDoc.fileName}
                </h2>
              </div>
            </div>

            {/* Questions Filter & Expand/Collapse Controls */}
            {notes.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-[#1E293B]/70">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder={`Search within ${notes.length} questions...`}
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button
                    onClick={handleExpandAll}
                    className="px-2.5 py-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    onClick={handleCollapseAll}
                    className="px-2.5 py-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────────
              QUESTIONS ACCORDION LIST (Click to show generated notes)
              ──────────────────────────────────────────────────────────── */}
          {loadingNotes ? (
            <ListSkeleton count={3} />
          ) : filteredNotes.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] text-center space-y-3 bg-white/70 dark:bg-[#0E131F]/80">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto text-xl">
                <FiHelpCircle />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {questionSearch ? 'No matching questions found' : 'No questions or notes saved for this PDF yet'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {questionSearch
                    ? `No questions match "${questionSearch}". Try adjusting your search query.`
                    : 'Ask questions in the Ask Document tab and click "Save to Note" to store comprehensive answers here.'}
                </p>
              </div>

              {!questionSearch && (
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer mt-2"
                >
                  <FiPlus />
                  <span>Create Note</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredNotes.map((note, idx) => {
                const isExpanded = expandedNoteIds.has(note.id);
                const { question, body } = parseNoteData(note);

                return (
                  <div
                    key={note.id}
                    className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                      isExpanded
                        ? 'border-indigo-500/80 dark:border-indigo-500/60 ring-2 ring-indigo-500/10 bg-white dark:bg-[#0E131F]'
                        : 'border-slate-200/80 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 bg-white/80 dark:bg-[#0E131F]/80 hover:shadow-xs'
                    }`}
                  >
                    {/* 1. Question Accordion Header (Click to toggle notes dropdown) */}
                    <div
                      onClick={() => toggleAccordion(note.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/50 dark:bg-[#0c111e]/50 hover:bg-slate-100/60 dark:hover:bg-[#141B2D]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-7 h-7 rounded-xl bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-orange-200/40 dark:border-orange-900/40">
                          Q{idx + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {question}
                            </h3>
                            {note.page && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 flex-shrink-0">
                                Page {note.page}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Chevron Indicator */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                          {isExpanded ? (
                            <FiChevronUp className="text-base text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <FiChevronDown className="text-base" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. Generated Notes Dropdown Content (Revealed on Click) */}
                    {isExpanded && (
                      <div className="px-5 py-4 border-t border-slate-100 dark:border-[#1E293B] bg-white dark:bg-[#111728] space-y-3.5 animate-in fade-in duration-150">
                        {/* Note Actions Bar */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400">
                          <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                            <FiClock className="text-[10px]" />
                            Generated Note & Answer
                          </span>

                          <div className="flex items-center gap-1.5">
                            {note.page && (
                              <Link
                                to={`/documents/${selectedDoc.id}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10.5px] border border-indigo-200/60 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors"
                                title={`Open PDF on Page ${note.page}`}
                              >
                                <FiFileText className="text-[10px]" />
                                <span>Jump to Page {note.page}</span>
                              </Link>
                            )}

                            <button
                              onClick={() => handleCopyNote(note)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] rounded-lg transition-colors cursor-pointer"
                              title="Copy Note Text"
                            >
                              {copiedId === note.id ? (
                                <FiCheck className="text-xs text-emerald-500" />
                              ) : (
                                <FiCopy className="text-xs" />
                              )}
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(note)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] rounded-lg transition-colors cursor-pointer"
                              title="Edit Note"
                            >
                              <FiEdit2 className="text-xs" />
                            </button>

                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Delete Note"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </div>

                        {/* Rich Markdown Generated Note Content */}
                        <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed overflow-x-auto">
                          <MarkdownRenderer content={body} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          CREATE / EDIT NOTE MODAL
          ──────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="glass-card w-full max-w-xl p-6 rounded-3xl border border-slate-200 dark:border-[#1E293B] shadow-2xl bg-white dark:bg-[#0E131F] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FiBookOpen className="text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {editingNoteId ? 'Edit Document Note' : 'Create New Document Note'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Linked to <strong className="text-slate-700 dark:text-slate-200">{selectedDoc?.fileName}</strong>
                  </p>
                </div>
              </div>

              {/* Tab Switcher: Write vs Preview */}
              <div className="flex items-center bg-slate-100 dark:bg-[#141B2D] p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'write'
                      ? 'bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                    Question / Note Title
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Describe Structural patterns with examples"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                    Linked Page
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedDoc?.pageCount || 1000}
                    value={notePage}
                    onChange={(e) => setNotePage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                  Generated Note Content (Markdown supported)
                </label>
                {activeTab === 'write' ? (
                  <textarea
                    rows="6"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your note findings, answers, code snippets, or takeaways..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none font-sans leading-relaxed"
                    required
                  />
                ) : (
                  <div className="p-3.5 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl min-h-[150px] max-h-[220px] overflow-y-auto text-xs">
                    {noteContent ? (
                      <MarkdownRenderer content={noteContent} />
                    ) : (
                      <p className="text-slate-400 italic">Nothing to preview yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNote}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {savingNote ? 'Saving...' : editingNoteId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
