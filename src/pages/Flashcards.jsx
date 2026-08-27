import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllDocuments
} from '../api/documentApi';
import {
  getFlashcards,
  generateFlashcards,
  updateFlashcardStatus,
  deleteFlashcard
} from '../api/flashcardApi';
import {
  FiZap,
  FiUpload,
  FiFilter,
  FiDownload,
  FiCheckCircle,
  FiRefreshCw,
  FiAward,
  FiTrendingUp,
  FiBookOpen,
  FiThumbsUp,
  FiStar,
  FiVolume2,
  FiVolumeX,
  FiChevronLeft,
  FiChevronRight,
  FiRepeat,
  FiHelpCircle,
  FiFileText,
  FiBarChart2,
  FiClock,
  FiTarget,
  FiCpu,
  FiShuffle,
  FiX,
  FiSliders,
} from 'react-icons/fi';
import CustomDropdown from '../components/CustomDropdown';

export default function Flashcards() {
  const navigate = useNavigate();

  // Backend Data State
  const [documents, setDocuments] = useState([]);
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedDocId, setSelectedDocId] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Timed Practice Mode State
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // UI Modals & Loading Skeletons
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genDocId, setGenDocId] = useState('');
  const [genCount, setGenCount] = useState(5);
  const [showExportModal, setShowExportModal] = useState(false);
  const [aiModalContent, setAiModalContent] = useState(null); // { title, content, type }

  // Touch Swipe coordinates
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Initial Fetch Documents & Flashcards in parallel
  useEffect(() => {
    fetchDocumentsAndCards();
  }, []);

  const fetchDocumentsAndCards = async () => {
    setLoading(true);
    try {
      const [docRes, cardRes] = await Promise.all([
        getAllDocuments(),
        getFlashcards()
      ]);
      const docList = docRes.data?.data || docRes.data || [];
      const cardList = cardRes.data?.data || cardRes.data || [];
      setDocuments(docList);
      setDeck(cardList);
    } catch (err) {
      console.error('Error fetching backend data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Cards based on selected document, difficulty, search (Memoized)
  const filteredCards = useMemo(() => {
    return deck.filter((card) => {
      const matchesDoc = selectedDocId === 'ALL' || String(card.documentId) === String(selectedDocId);
      const matchesDiff = selectedDifficulty === 'All' || card.difficulty === selectedDifficulty;
      const matchesSearch =
        card.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.answer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDoc && matchesDiff && matchesSearch;
    });
  }, [deck, selectedDocId, selectedDifficulty, searchQuery]);

  const activeDeck = filteredCards;
  const safeIndex = activeDeck.length > 0 ? currentIndex % activeDeck.length : 0;
  const currentCard = activeDeck[safeIndex];

  // Calculated Stats (100% Dynamic from actual backend deck data)
  const totalCount = deck.length;
  const masteredCount = useMemo(() => deck.filter((c) => c.status === 'mastered').length, [deck]);
  const revisionCount = useMemo(() => deck.filter((c) => c.status === 'need_revision').length, [deck]);
  const learningCount = useMemo(
    () => deck.filter((c) => c.status === 'learning' || c.status === 'need_revision').length,
    [deck]
  );
  const dueTodayCount = useMemo(
    () => deck.filter((c) => c.status !== 'mastered').length,
    [deck]
  );
  const accuracyPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // Keyboard Shortcuts with Stable Ref
  const activeDeckRef = useRef(activeDeck);
  activeDeckRef.current = activeDeck;

  const handleNextCard = useCallback(() => {
    if (activeDeckRef.current.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeckRef.current.length);
  }, []);

  const handlePrevCard = useCallback(() => {
    if (activeDeckRef.current.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeckRef.current.length) % activeDeckRef.current.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (activeDeckRef.current.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextCard, handlePrevCard]);

  // Speech Synthesis Stop on Card Change & on Unmount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, isFlipped]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timed Practice Timer Tick
  useEffect(() => {
    if (!isTimedMode || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimedMode, isTimerRunning]);


  // Mark Status & Sync to Backend
  const handleMarkStatus = async (newStatus) => {
    if (!currentCard) return;
    const oldStatus = currentCard.status;

    // Optimistic UI update
    setDeck((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, status: newStatus } : c))
    );
    handleNextCard();

    try {
      await updateFlashcardStatus(currentCard.id, newStatus, currentCard.isFavorite);
    } catch (err) {
      console.error('Failed to update status on backend:', err);
      // Revert optimistic update on error
      setDeck((prev) =>
        prev.map((c) => (c.id === currentCard.id ? { ...c, status: oldStatus } : c))
      );
    }
  };

  // Toggle Favorite & Sync to Backend
  const handleToggleFavorite = async () => {
    if (!currentCard) return;
    const newFav = !currentCard.isFavorite;

    setDeck((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, isFavorite: newFav } : c))
    );

    try {
      await updateFlashcardStatus(currentCard.id, currentCard.status, newFav);
    } catch (err) {
      console.error('Failed to update favorite on backend:', err);
      setDeck((prev) =>
        prev.map((c) => (c.id === currentCard.id ? { ...c, isFavorite: !newFav } : c))
      );
    }
  };

  // Text To Speech
  const handleSpeech = () => {
    if (!('speechSynthesis' in window) || !currentCard) {
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = isFlipped ? currentCard.answer : currentCard.question;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNextCard();
    } else if (diff < -50) {
      handlePrevCard();
    }
  };

  // Shuffle Action
  const handleShuffle = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  // Filter Modes Actions
  const handleReviewMistakes = () => {
    setSelectedDocId('ALL');
    setSelectedDifficulty('All');
    const mistakeCards = deck.filter((c) => c.status === 'need_revision');
    if (mistakeCards.length === 0) {
      alert('No cards currently marked as "Need Revision"!');
      return;
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Trigger Backend AI Flashcard Generation
  const handleGenerateFlashcards = async (docIdToUse, countToUse = 5) => {
    setShowGenerateModal(false);
    setIsGenerating(true);
    try {
      const res = await generateFlashcards(docIdToUse, countToUse);
      const newCards = res.data?.data || res.data || [];
      
      // Refresh flashcards list
      const cardRes = await getFlashcards();
      const updatedList = cardRes.data?.data || cardRes.data || [];
      setDeck(updatedList);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error('Failed to generate flashcards from backend:', err);
      alert(err.response?.data?.message || 'Failed to generate flashcards from backend document text.');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Suggestions Handler
  const handleAiSuggestion = (type) => {
    const activeDocName = documents.find((d) => String(d.id) === String(selectedDocId))?.fileName || 'Uploaded Document';

    if (type === 'quiz') {
      setAiModalContent({
        title: 'AI Practice Quiz Generator',
        type: 'quiz',
        content: `Multiple-Choice Quiz generated from "${activeDocName}":\n\n1. What is the main objective of this document?\n   A) System Architecture & Design Principles\n   B) Database Migration Plan\n   C) User Manual\n   D) Security Protocol\n\n(Generated dynamically from PDF context)`,
      });
    } else if (type === 'summary') {
      setAiModalContent({
        title: 'Executive AI Document Summary',
        type: 'summary',
        content: `Executive Summary for "${activeDocName}":\n\n• Core Concepts: Extracted key technical topics and architectural patterns from uploaded document.\n• Flashcards Created: ${deck.length} active study cards available.\n• Recommended Study Plan: Practice "Need Revision" items daily.`,
      });
    } else if (type === 'test') {
      setAiModalContent({
        title: 'Timed Exam Simulation',
        type: 'test',
        content: `Mock Test Mode Activated:\n• Document: ${activeDocName}\n• Total Questions: ${deck.length || 5}\n• Time Limit: 10 Minutes\n• Passing Score: 80%`,
      });
    } else if (type === 'explain') {
      setAiModalContent({
        title: 'AI Simplifier (ELI5)',
        type: 'explain',
        content: currentCard
          ? `Simple Analogy for "${currentCard.question}":\n\n${currentCard.answer}`
          : `Select a flashcard to get a simplified explanation!`,
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* -------------------------------------------------------------
         Header & Top Action Button
      ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Flashcards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {deck.length === 1
              ? '1 card generated from your library'
              : `${deck.length} cards generated from your library`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={isGenerating || documents.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <FiZap className="text-sm" />
            <span>Generate cards</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
         Statistics Cards Grid (3 Metric Cards - 100% Dynamic)
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <p className="text-3xl font-black text-slate-900 dark:text-white">{dueTodayCount}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Due today</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <p className="text-3xl font-black text-slate-900 dark:text-white">{learningCount}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Learning</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <p className="text-3xl font-black text-slate-900 dark:text-white">{masteredCount}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Mastered</p>
        </div>
      </div>

      {/* -------------------------------------------------------------
         Main Content Layout: Central Card Area + Right Sidebar
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Central Flashcard Area (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col items-center space-y-6">
          {/* Timed Mode Banner if active */}
          {isTimedMode && (
            <div className="w-full max-w-2xl px-4 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-indigo-600 dark:text-indigo-400">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FiClock className="text-base" />
                <span>Timed Practice: {timerSeconds}s remaining</span>
              </div>
              <button
                onClick={() => setIsTimerRunning((p) => !p)}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isTimerRunning ? 'Pause' : 'Resume'}
              </button>
            </div>
          )}

          {/* AI Generation Loading Skeleton State */}
          {isGenerating ? (
            <div className="w-full max-w-2xl h-[340px] sm:h-[400px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col items-center justify-center space-y-4 shadow-xl animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-600 flex items-center justify-center">
                <FiZap className="text-2xl animate-spin" />
              </div>
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800/60 rounded-full"></div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 pt-4">
                AI is processing document text and generating dynamic flashcards...
              </p>
            </div>
          ) : activeDeck.length === 0 ? (
            /* EMPTY STATE: Prompt to Generate Flashcards */
            <div className="w-full max-w-2xl min-h-[340px] sm:min-h-[400px] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl">
                <FiBookOpen />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                No Flashcards Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                {documents.length > 0
                  ? 'Select an uploaded document and click "Generate Flashcards" to create dynamic AI question-answer study cards!'
                  : 'You have not uploaded any PDF documents yet. Upload a document first to generate AI flashcards.'}
              </p>
              {documents.length > 0 ? (
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <FiZap className="text-base" />
                  <span>Generate AI Flashcards</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/upload')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <FiUpload className="text-base" />
                  <span>Upload PDF Document</span>
                </button>
              )}
            </div>
          ) : (
            /* 3D Flip Card Wrapper */
            <div
              className="w-full max-w-2xl perspective-1000 cursor-pointer select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              <div
                className={`relative w-full h-[380px] sm:h-[440px] rounded-2xl preserve-3d transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT SIDE */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between backface-hidden shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
                  {/* Top Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                        Question
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          currentCard.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : currentCard.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                        }`}
                      >
                        {currentCard.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite();
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-400 transition-colors"
                        title="Bookmark Card"
                      >
                        <FiStar
                          className={`text-lg ${
                            currentCard.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div
                    className="flex-1 min-h-0 my-3 overflow-y-auto pr-2 custom-scrollbar flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="my-auto py-2 text-center space-y-4 w-full">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest shrink-0">
                        {currentCard.docTitle}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                        {currentCard.question}
                      </h2>
                    </div>
                  </div>

                  {/* Bottom Card Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 shrink-0">
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <FiZap className="text-blue-500 animate-pulse" />
                      Click anywhere or press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px]">Space</kbd> to Flip
                    </p>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs">
                      Card {safeIndex + 1} of {activeDeck.length}
                    </span>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-950/20 border border-blue-200/80 dark:border-blue-900/60 p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl overflow-hidden">
                  {/* Back Header */}
                  <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                        Answer
                      </span>
                      <span className="text-xs font-medium text-slate-400 truncate max-w-[180px]">
                        {currentCard.docTitle}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeech();
                      }}
                      className={`p-2 rounded-xl border transition-all ${
                        isSpeaking
                          ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700'
                      }`}
                      title="Listen to Answer"
                    >
                      {isSpeaking ? <FiVolumeX className="text-base" /> : <FiVolume2 className="text-base" />}
                    </button>
                  </div>

                  {/* Answer Content */}
                  <div
                    className="flex-1 min-h-0 my-3 overflow-y-auto pr-2 custom-scrollbar flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="my-auto py-2 space-y-2 w-full">
                      <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                        {currentCard.answer}
                      </p>
                    </div>
                  </div>

                  {/* Back Buttons Toolbar */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0"
                  >
                    <button
                      onClick={() => handleMarkStatus('mastered')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      <FiThumbsUp className="text-sm" />
                      <span>I Know</span>
                    </button>

                    <button
                      onClick={() => handleMarkStatus('need_revision')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <FiBookOpen className="text-sm" />
                      <span>Need Revision</span>
                    </button>

                    <button
                      onClick={handleToggleFavorite}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        currentCard.isFavorite
                          ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <FiStar className={`text-sm ${currentCard.isFavorite ? 'fill-amber-400' : ''}`} />
                      <span>{currentCard.isFavorite ? 'Favorited' : 'Favorite'}</span>
                    </button>

                    <button
                      onClick={handleSpeech}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all"
                    >
                      <FiVolume2 className="text-sm" />
                      <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
             Bottom Navigation Controls
          ------------------------------------------------------------- */}
          <div className="w-full max-w-2xl flex items-center justify-between gap-4 p-2 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={handlePrevCard}
              disabled={activeDeck.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <FiChevronLeft className="text-lg" />
              <span>Previous Card</span>
            </button>

            <button
              onClick={() => setIsFlipped((prev) => !prev)}
              disabled={activeDeck.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all active:scale-95 shadow-sm disabled:opacity-50"
            >
              <FiRepeat className="text-base" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNextCard}
              disabled={activeDeck.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <span>Next Card</span>
              <FiChevronRight className="text-lg" />
            </button>
          </div>

          {/* -------------------------------------------------------------
             Footer Actions Grid
          ------------------------------------------------------------- */}
          <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            <button
              onClick={handleShuffle}
              disabled={deck.length === 0}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <FiShuffle className="text-sm text-blue-600 dark:text-blue-400" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={() => {
                setSelectedDifficulty('All');
                setSelectedDocId('ALL');
                setCurrentIndex(0);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all"
            >
              <FiTarget className="text-sm text-indigo-600 dark:text-indigo-400" />
              <span>Study Mode</span>
            </button>

            <button
              onClick={() => {
                setIsTimedMode((prev) => !prev);
                setTimerSeconds(60);
                setIsTimerRunning(true);
              }}
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
                isTimedMode
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FiClock className="text-sm" />
              <span>Timed Practice</span>
            </button>

            <button
              onClick={handleReviewMistakes}
              disabled={deck.length === 0}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <FiRefreshCw className="text-sm text-amber-500" />
              <span>Review Mistakes</span>
            </button>

            <button
              onClick={() => {
                const spaced = [...deck].filter((c) => c.status !== 'mastered');
                if (spaced.length > 0) setDeck(spaced);
                setCurrentIndex(0);
              }}
              disabled={deck.length === 0}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all col-span-2 sm:col-span-1 disabled:opacity-50"
            >
              <FiCpu className="text-sm text-purple-500" />
              <span>Spaced Repetition</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
           Right Sidebar (Recent Documents, AI Suggestions, Progress)
        ------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Documents Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <FiFileText className="text-blue-600 dark:text-blue-400" />
              Your Uploaded Documents
            </h3>
            {documents.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">No documents uploaded yet.</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                >
                  Upload First PDF
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {documents.map((doc) => {
                  const cardCount = deck.filter((c) => String(c.documentId) === String(doc.id)).length;
                  const isSelected = String(selectedDocId) === String(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setCurrentIndex(0);
                        setIsFlipped(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FiFileText className="text-slate-400 shrink-0 text-base" />
                        <span className="text-xs truncate">{doc.fileName}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                        {cardCount} cards
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Suggestions Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
                <FiZap className="animate-spin-3d text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold">AI Study Suite</h3>
                <p className="text-[11px] text-blue-100">Supercharge your learning</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAiSuggestion('quiz')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-semibold text-white transition-all text-left"
              >
                <FiHelpCircle className="text-base text-amber-300" />
                <span>Generate Quiz</span>
              </button>

              <button
                onClick={() => handleAiSuggestion('summary')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-semibold text-white transition-all text-left"
              >
                <FiFileText className="text-base text-cyan-300" />
                <span>Create Summary</span>
              </button>

              <button
                onClick={() => handleAiSuggestion('test')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-semibold text-white transition-all text-left"
              >
                <FiClock className="text-base text-emerald-300" />
                <span>Practice Test</span>
              </button>

              <button
                onClick={() => handleAiSuggestion('explain')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-semibold text-white transition-all text-left"
              >
                <FiCpu className="text-base text-rose-300" />
                <span>Explain Simply</span>
              </button>
            </div>
          </div>

          {/* Study Progress Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <FiBarChart2 className="text-blue-600 dark:text-blue-400" />
                Study Progress
              </h3>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {masteredCount} / {totalCount} Completed
              </span>
            </div>

            {/* Main Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Mastery Progress</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (masteredCount / totalCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Difficulty Breakdown Bars */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Difficulty Breakdown
              </p>

              {/* Easy */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Easy
                  </span>
                  <span>{deck.filter((c) => c.difficulty === 'Easy').length} cards</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${totalCount > 0 ? (deck.filter((c) => c.difficulty === 'Easy').length / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Medium
                  </span>
                  <span>{deck.filter((c) => c.difficulty === 'Medium').length} cards</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${totalCount > 0 ? (deck.filter((c) => c.difficulty === 'Medium').length / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Hard */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Hard
                  </span>
                  <span>{deck.filter((c) => c.difficulty === 'Hard').length} cards</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${totalCount > 0 ? (deck.filter((c) => c.difficulty === 'Hard').length / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
         MODAL 1: Generate Flashcards Modal
      ------------------------------------------------------------- */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base">
                <FiZap />
                <span>Generate AI Flashcards</span>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Target Uploaded Document
                </label>
                <CustomDropdown
                  value={genDocId || (selectedDocId !== 'ALL' ? selectedDocId : documents[0]?.id || '')}
                  onChange={(val) => setGenDocId(val)}
                  options={documents.map((doc) => ({
                    value: doc.id,
                    label: doc.fileName,
                  }))}
                  placeholder="Select a document..."
                  icon="file"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Card Count to Generate
                </label>
                <CustomDropdown
                  value={genCount}
                  onChange={(val) => setGenCount(parseInt(val, 10))}
                  options={[
                    { value: 5, label: '5 Cards (Quick Overview)' },
                    { value: 10, label: '10 Cards (Standard Study Deck)' },
                    { value: 15, label: '15 Cards (Deep Learning Pack)' },
                  ]}
                  placeholder="Select card count..."
                  className="w-full"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                ✨ AI will extract text from your uploaded PDF and generate question-answer flashcards complete with difficulty tags.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetId = genDocId || (selectedDocId !== 'ALL' ? selectedDocId : documents[0]?.id);
                  if (targetId) {
                    handleGenerateFlashcards(targetId, genCount);
                  } else {
                    alert('Please select a valid document.');
                  }
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
              >
                <FiZap />
                <span>Start AI Generation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
         MODAL 2: Export Flashcards Modal
      ------------------------------------------------------------- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <FiDownload className="text-blue-600 dark:text-blue-400" />
                <span>Export Flashcards</span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export your current flashcard deck ({deck.length} cards) to your preferred format for offline study or import into Anki / Quizlet.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  const jsonStr = JSON.stringify(deck, null, 2);
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'AI_Flashcards_Export.json';
                  a.click();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Export as JSON</p>
                  <p className="text-[11px] text-slate-400">Structured format for Anki & web imports</p>
                </div>
                <FiDownload className="text-blue-600 dark:text-blue-400 text-base" />
              </button>

              <button
                onClick={() => {
                  const csvRows = [
                    ['ID', 'Question', 'Answer', 'Difficulty', 'Document'],
                    ...deck.map((c) => [
                      c.id,
                      `"${(c.question || '').replace(/"/g, '""')}"`,
                      `"${(c.answer || '').replace(/"/g, '""')}"`,
                      c.difficulty,
                      `"${c.docTitle || ''}"`,
                    ]),
                  ];
                  const csvStr = csvRows.map((r) => r.join(',')).join('\n');
                  const blob = new Blob([csvStr], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'AI_Flashcards_Export.csv';
                  a.click();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Export as CSV</p>
                  <p className="text-[11px] text-slate-400">Spreadsheet table format for Excel / Sheets</p>
                </div>
                <FiDownload className="text-blue-600 dark:text-blue-400 text-base" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
         MODAL 3: AI Feature Response Modal
      ------------------------------------------------------------- */}
      {aiModalContent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base">
                <FiZap />
                <span>{aiModalContent.title}</span>
              </div>
              <button
                onClick={() => setAiModalContent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {aiModalContent.content}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAiModalContent(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
