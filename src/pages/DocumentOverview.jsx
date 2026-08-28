import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getDocumentById,
  reanalyzeDocument,
  renameDocument,
  deleteDocument,
  executeQuickAction,
  getAllDocuments,
  getDocumentFileUrl,
  getDocumentNotes,
  getDocumentBookmarks,
} from '../api/documentApi';

// Subcomponents
import DocumentHeader from '../components/document/DocumentHeader';
import DocumentTabs from '../components/document/DocumentTabs';
import AnalysisStatsGrid from '../components/document/AnalysisStatsGrid';
import AISummaryCard from '../components/document/AISummaryCard';
import KeyTopicsCard from '../components/document/KeyTopicsCard';
import ImportantDatesCard from '../components/document/ImportantDatesCard';
import FinancialHighlightsCard from '../components/document/FinancialHighlightsCard';
import PotentialRisksCard from '../components/document/PotentialRisksCard';
import DocumentPreview from '../components/document/DocumentPreview';
import QuickActionsCard from '../components/document/QuickActionsCard';
import DocumentChatTab from '../components/document/DocumentChatTab';
import DocumentInsightsTab from '../components/document/DocumentInsightsTab';
import DocumentSectionsTab from '../components/document/DocumentSectionsTab';
import DocumentNotesTab from '../components/document/DocumentNotesTab';
import DocumentBookmarksTab from '../components/document/DocumentBookmarksTab';

// Modals
import {
  FullSummaryModal,
  AllTopicsModal,
  AllDatesModal,
  AllFinancialsModal,
  AllRisksModal,
  QuickActionResultModal,
  FullscreenPreviewModal,
  CompareModal,
  TranslateModal,
} from '../components/document/DocumentModals';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';
import { StatSkeleton } from '../components/LoadingSkeleton';

export default function DocumentOverview() {
  const { documentId, tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Document State
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [allDocs, setAllDocs] = useState([]);

  // Active Tab & Page Navigation
  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [currentPage, setCurrentPage] = useState(1);

  // Quick Action State
  const [loadingAction, setLoadingAction] = useState(null);
  const [quickActionResult, setQuickActionResult] = useState(null);

  // Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: null });

  // Sync tab with URL
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    } else if (!tab && activeTab !== 'overview') {
      setActiveTab('overview');
    }
  }, [tab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === 'overview') {
      navigate(`/documents/${documentId}`);
    } else {
      navigate(`/documents/${documentId}/${newTab}`);
    }
  };

  // Fetch document details, notes and bookmarks
  const fetchDocumentDetail = useCallback(async () => {
    if (!documentId) return;
    try {
      setLoading(true);
      setError(null);
      
      const [docRes, notesRes, bmRes] = await Promise.allSettled([
        getDocumentById(documentId),
        getDocumentNotes(documentId),
        getDocumentBookmarks(documentId),
      ]);

      if (docRes.status === 'fulfilled' && docRes.value?.data) {
        const docData = docRes.value.data;
        const notesData = notesRes.status === 'fulfilled' ? notesRes.value.data : [];
        const bmData = bmRes.status === 'fulfilled' ? bmRes.value.data : [];

        setDocument({
          ...docData,
          notes: notesData,
          bookmarks: bmData,
        });
      } else {
        const errorMsg =
          docRes.status === 'rejected'
            ? docRes.reason?.response?.data?.message || docRes.reason?.message
            : 'Document not found';
        setError(errorMsg || 'Document not found');
      }
    } catch (err) {
      console.error('Failed to load document:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchDocumentDetail();
    // Pre-fetch all documents for Compare modal
    getAllDocuments()
      .then((res) => setAllDocs(res.data || []))
      .catch(() => setAllDocs([]));
  }, [fetchDocumentDetail]);

  // Rename Handler
  const handleRename = async (newName) => {
    try {
      const res = await renameDocument(documentId, newName);
      setDocument((prev) => ({
        ...prev,
        fileName: res.data?.fileName || newName,
      }));
      setStatusMsg({ type: 'success', message: 'Document renamed successfully' });
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to rename document' });
    }
  };

  // Re-analyze Handler
  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      const res = await reanalyzeDocument(documentId);
      if (res.data) {
        setDocument((prev) => ({
          ...prev,
          analysis: res.data,
          summary: res.data.summary,
          pageCount: res.data.pageCount || prev.pageCount,
        }));
        setStatusMsg({ type: 'success', message: 'Document re-analyzed successfully' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || err.message || 'Re-analysis failed' });
    } finally {
      setReanalyzing(false);
    }
  };

  // Download Handler
  const handleDownload = () => {
    const downloadUrl = getDocumentFileUrl(documentId);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = document?.fileName || `document_${documentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Handler
  const handleDelete = async () => {
    try {
      await deleteDocument(documentId);
      navigate('/documents', { replace: true });
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to delete document' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Quick Action Handler
  const handleTriggerQuickAction = async (actionId) => {
    if (actionId === 'translate') {
      setShowTranslateModal(true);
      return;
    }

    try {
      setLoadingAction(actionId);
      const res = await executeQuickAction(documentId, actionId, 'English', 'full', currentPage);
      if (res.data) {
        setQuickActionResult(res.data);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || err.message || 'Quick action failed' });
    } finally {
      setLoadingAction(null);
    }
  };

  // Dedicated Translation Handler (Multi-Language)
  const handleExecuteTranslate = async (targetLanguage, scope) => {
    try {
      setLoadingAction('translate');
      const res = await executeQuickAction(
        documentId,
        'translate',
        targetLanguage,
        scope,
        currentPage
      );
      if (res.data) {
        setShowTranslateModal(false);
        setQuickActionResult(res.data);
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        message: err.response?.data?.message || err.message || `Failed to translate into ${targetLanguage}`,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Click-to-page citation jump
  const handleSelectPage = (pageNum) => {
    if (pageNum && typeof pageNum === 'number') {
      setCurrentPage(pageNum);
      // Smooth scroll to preview if on mobile
      const previewEl = document.getElementById('document-preview-panel');
      if (previewEl && window.innerWidth < 1024) {
        previewEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <StatSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          <div className="h-96 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !document) {
    return (
      <div className="glass-card p-10 sm:p-16 rounded-3xl text-center max-w-xl mx-auto space-y-4 shadow-lg my-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/40 dark:border-rose-900/40">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {error || 'Document Not Found'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The document you are attempting to view is unavailable or you do not have permission to access it.
          </p>
        </div>
        <button
          onClick={() => navigate('/documents')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  const analysis = document.analysis || {};
  const pageCount = document.pageCount || analysis.pageCount || 1;
  const stats = analysis.stats || {
    pages: pageCount,
    summaryCount: document.summary ? 1 : 0,
    keyTopicsCount: (analysis.topics || []).length,
    datesCount: (analysis.dates || []).length,
    financialsCount: (analysis.financialFigures || []).length,
    risksCount: (analysis.risks || []).length,
    entitiesCount: (analysis.entities || []).length,
    clausesCount: (analysis.clauses || []).length,
  };

  const tabCounts = {
    chat: undefined,
    insights: (analysis.entities || []).length + (analysis.clauses || []).length,
    sections: (analysis.sections || []).length,
    notes: (document.notes || []).length,
    bookmarks: (document.bookmarks || []).length,
  };

  return (
    <div className="space-y-6">
      <StatusMessage
        type={statusMsg.type}
        message={statusMsg.message}
        onClose={() => setStatusMsg({ type: null, message: null })}
      />

      {/* 1. DOCUMENT HEADER */}
      <DocumentHeader
        document={document}
        onRename={handleRename}
        onReanalyze={handleReanalyze}
        onDownload={handleDownload}
        onDelete={() => setShowDeleteModal(true)}
        onOpenChat={() => handleTabChange('chat')}
        onOpenCompare={() => setShowCompareModal(true)}
        reanalyzing={reanalyzing}
      />

      {/* 2. MAIN NAVIGATION TABS */}
      <DocumentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={tabCounts}
      />

      {/* 3. TWO-COLUMN RESPONSIVE LAYOUT (Main Content + Right Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Analysis Content / Active Tab View (7 or 8 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 min-w-0">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dynamic 8-Statistic Cards Grid */}
              <AnalysisStatsGrid
                stats={stats}
                pageCount={pageCount}
                onCardClick={(cardId) => {
                  if (cardId === 'summary') setActiveModal('summary');
                  else if (cardId === 'topics') setActiveModal('topics');
                  else if (cardId === 'dates') setActiveModal('dates');
                  else if (cardId === 'financials') setActiveModal('financials');
                  else if (cardId === 'risks') setActiveModal('risks');
                  else if (cardId === 'entities' || cardId === 'clauses') handleTabChange('insights');
                }}
              />

              {/* Row 2: AI Summary & Key Topics (2-Column Subgrid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <AISummaryCard
                  summary={document.summary || analysis.summary}
                  onReadFullSummary={() => setActiveModal('summary')}
                />
                <KeyTopicsCard
                  topics={analysis.topics || []}
                  onViewAllTopics={() => setActiveModal('topics')}
                  onSelectTopicPage={handleSelectPage}
                />
              </div>

              {/* Row 3: Important Dates, Financial Highlights & Potential Risks (3-Column Subgrid) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4">
                <ImportantDatesCard
                  dates={analysis.dates || []}
                  onViewAllDates={() => setActiveModal('dates')}
                  onSelectDatePage={handleSelectPage}
                />
                <FinancialHighlightsCard
                  financials={analysis.financialFigures || []}
                  onViewAllFigures={() => setActiveModal('financials')}
                  onSelectFinancialPage={handleSelectPage}
                />
                <PotentialRisksCard
                  risks={analysis.risks || []}
                  onViewAllRisks={() => setActiveModal('risks')}
                  onSelectRiskPage={handleSelectPage}
                />
              </div>
            </div>
          )}

          {/* TAB: ASK DOCUMENT / CHAT */}
          {activeTab === 'chat' && (
            <DocumentChatTab
              documentId={document.id}
              documentTitle={document.fileName}
              topics={analysis.topics || []}
              currentPage={currentPage}
              notes={document.notes || []}
              bookmarks={document.bookmarks || []}
              onSelectCitationPage={handleSelectPage}
              onUpdateNotes={(updated) => setDocument((p) => ({ ...p, notes: updated }))}
              onUpdateBookmarks={(updated) => setDocument((p) => ({ ...p, bookmarks: updated }))}
            />
          )}

          {/* TAB: INSIGHTS */}
          {activeTab === 'insights' && (
            <DocumentInsightsTab
              entities={analysis.entities || []}
              clauses={analysis.clauses || []}
              actionItems={analysis.actionItems || []}
              docType={analysis.documentType}
              language={analysis.language}
              confidence={analysis.confidence}
              onSelectCitationPage={handleSelectPage}
            />
          )}

          {/* TAB: KEY SECTIONS */}
          {activeTab === 'sections' && (
            <DocumentSectionsTab
              documentId={document.id}
              documentTitle={document.fileName}
              docType={analysis.documentType}
              sections={analysis.sections || []}
              topics={analysis.topics || []}
              dates={analysis.dates || []}
              risks={analysis.risks || []}
              summary={document.summary || analysis.summary}
              pageCount={pageCount}
              onSelectSectionPage={handleSelectPage}
              onTabChange={handleTabChange}
              onUpdateNotes={(updated) => setDocument((p) => ({ ...p, notes: updated }))}
            />
          )}

          {/* TAB: NOTES */}
          {activeTab === 'notes' && (
            <DocumentNotesTab
              documentId={document.id}
              notes={document.notes || []}
              onUpdateNotes={(updated) => setDocument((p) => ({ ...p, notes: updated }))}
              onSelectPage={handleSelectPage}
            />
          )}

          {/* TAB: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <DocumentBookmarksTab
              documentId={document.id}
              bookmarks={document.bookmarks || []}
              currentPage={currentPage}
              pageCount={pageCount}
              onUpdateBookmarks={(updated) => setDocument((p) => ({ ...p, bookmarks: updated }))}
              onSelectPage={handleSelectPage}
            />
          )}
        </div>

        {/* RIGHT COLUMN: Document Preview Panel & Quick Actions (5 or 4 cols on desktop) */}
        <div
          id="document-preview-panel"
          className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-20"
        >
          {/* Document Preview Card */}
          <DocumentPreview
            documentId={document.id}
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onOpenFullscreen={() => setShowFullscreenModal(true)}
          />

          {/* Quick Actions Card */}
          <QuickActionsCard
            onTriggerAction={handleTriggerQuickAction}
            loadingAction={loadingAction}
          />
        </div>
      </div>

      {/* 4. MODALS & DRAWERS */}
      <FullSummaryModal
        isOpen={activeModal === 'summary'}
        onClose={() => setActiveModal(null)}
        summary={document.summary || analysis.summary}
        fullSummary={analysis.fullSummary}
        fileName={document.fileName}
        docType={analysis.documentType}
        onSelectPage={handleSelectPage}
      />

      <AllTopicsModal
        isOpen={activeModal === 'topics'}
        onClose={() => setActiveModal(null)}
        topics={analysis.topics || []}
        onSelectTopicPage={handleSelectPage}
      />

      <AllDatesModal
        isOpen={activeModal === 'dates'}
        onClose={() => setActiveModal(null)}
        dates={analysis.dates || []}
        onSelectDatePage={handleSelectPage}
      />

      <AllFinancialsModal
        isOpen={activeModal === 'financials'}
        onClose={() => setActiveModal(null)}
        financials={analysis.financialFigures || []}
        onSelectFinancialPage={handleSelectPage}
      />

      <AllRisksModal
        isOpen={activeModal === 'risks'}
        onClose={() => setActiveModal(null)}
        risks={analysis.risks || []}
        onSelectRiskPage={handleSelectPage}
      />

      <TranslateModal
        isOpen={showTranslateModal}
        onClose={() => setShowTranslateModal(false)}
        onTranslate={handleExecuteTranslate}
        currentPage={currentPage}
        pageCount={pageCount}
        loading={loadingAction === 'translate'}
      />

      <QuickActionResultModal
        isOpen={!!quickActionResult}
        onClose={() => setQuickActionResult(null)}
        result={quickActionResult}
        documentId={document.id}
      />

      <FullscreenPreviewModal
        isOpen={showFullscreenModal}
        onClose={() => setShowFullscreenModal(false)}
        documentId={document.id}
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        currentDoc={document}
        allDocs={allDocs}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${document.fileName}"? This will permanently remove the file and all associated AI analysis and chat history.`}
      />
    </div>
  );
}
