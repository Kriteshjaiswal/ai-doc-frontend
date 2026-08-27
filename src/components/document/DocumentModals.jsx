import { useState, useEffect, useRef } from 'react';
import {
  FiX,
  FiFileText,
  FiTag,
  FiCalendar,
  FiDollarSign,
  FiAlertTriangle,
  FiSearch,
  FiCopy,
  FiCheck,
  FiMaximize2,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiLayers,
  FiGlobe,
} from 'react-icons/fi';
import { getDocumentPageUrl, getDocumentFileUrl, fetchDocumentPageBlob } from '../../api/documentApi';
import MarkdownRenderer, { formatJsonToMarkdown } from '../MarkdownRenderer';

// 1. FULL SUMMARY MODAL
export function FullSummaryModal({ isOpen, onClose, summary, fullSummary, fileName, docType, onSelectPage }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const content = fullSummary || summary || 'No detailed summary available.';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectPage = (pageNum) => {
    onSelectPage?.(pageNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/40 dark:border-emerald-900/40">
              <FiFileText className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Full AI Document Summary
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs sm:max-w-md">
                {fileName} • {docType || 'Document'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <MarkdownRenderer content={content} onSelectPage={handleSelectPage} />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
          >
            {copied ? <FiCheck className="text-emerald-500 text-sm" /> : <FiCopy className="text-sm" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. ALL TOPICS MODAL
export function AllTopicsModal({ isOpen, onClose, topics = [], onSelectTopicPage }) {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const filtered = topics.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/40 dark:border-indigo-900/40">
              <FiTag className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                All Identified Key Topics
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {topics.length} topic{topics.length !== 1 ? 's' : ''} detected by AI
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]">
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/40">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No matching topics found.</p>
          ) : (
            filtered.map((topic, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (topic.pages && topic.pages.length > 0) {
                    onSelectTopicPage?.(topic.pages[0]);
                    onClose();
                  }
                }}
                className="p-3.5 rounded-xl border border-slate-200/70 dark:border-[#1E293B] hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {topic.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#1E293B] px-2 py-0.5 rounded-md">
                    {topic.count || 1} mentions
                  </span>
                </div>
                {topic.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-4">
                    {topic.description}
                  </p>
                )}
                {topic.pages && topic.pages.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 pl-4 flex-wrap">
                    <span className="text-[10.5px] text-slate-400">Jump to:</span>
                    {topic.pages.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 transition-colors"
                      >
                        Page {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. ALL DATES MODAL
export function AllDatesModal({ isOpen, onClose, dates = [], onSelectDatePage }) {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const filtered = dates.filter(
    (d) =>
      d.event.toLowerCase().includes(search.toLowerCase()) ||
      d.date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/40 dark:border-amber-900/40">
              <FiCalendar className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Extracted Important Dates & Timelines
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {dates.length} timeline milestones identified
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/40">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event or date..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No matching dates found.</p>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.page) {
                    onSelectDatePage?.(item.page);
                    onClose();
                  }
                }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 dark:border-[#1E293B] hover:border-amber-300 dark:hover:border-amber-800 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all cursor-pointer group"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.event}
                  </p>
                  {item.page && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      Source: Page {item.page}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/40 px-2.5 py-1 rounded-lg tabular-nums flex-shrink-0">
                  {item.date}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. ALL FINANCIALS MODAL
export function AllFinancialsModal({ isOpen, onClose, financials = [], onSelectFinancialPage }) {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const filtered = financials.filter(
    (f) =>
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.value.toLowerCase().includes(search.toLowerCase()) ||
      (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/40 dark:border-orange-900/40">
              <FiDollarSign className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                All Financial Figures & Metrics
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {financials.length} financial metric{financials.length !== 1 ? 's' : ''} detected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/40">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search financials..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No matching financial figures found.</p>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.page) {
                    onSelectFinancialPage?.(item.page);
                    onClose();
                  }
                }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 dark:border-[#1E293B] hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all cursor-pointer group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {item.label}
                    </span>
                    {item.category && (
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                  {item.page && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      Source: Page {item.page} {item.trend ? `• ${item.trend}` : ''}
                    </p>
                  )}
                </div>
                <span className="text-sm font-mono font-extrabold text-slate-900 dark:text-white tabular-nums flex-shrink-0">
                  {item.value}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. ALL RISKS MODAL
export function AllRisksModal({ isOpen, onClose, risks = [], onSelectRiskPage }) {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const filtered = risks.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
      (r.severity && r.severity.toLowerCase().includes(search.toLowerCase()))
  );

  const getSeverityBadge = (severity = 'Medium') => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40';
      case 'high':
        return 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-200/60 dark:border-orange-900/40';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40';
      default:
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-900/40';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/40 dark:border-rose-900/40">
              <FiAlertTriangle className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                All Potential Risks & Warnings
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {risks.length} risk factor{risks.length !== 1 ? 's' : ''} detected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/40">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search risks..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No matching risks found.</p>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.page) {
                    onSelectRiskPage?.(item.page);
                    onClose();
                  }
                }}
                className="p-3.5 rounded-xl border border-slate-200/70 dark:border-[#1E293B] hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border tracking-wider ${getSeverityBadge(item.severity)}`}>
                    {item.severity || 'Medium'}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.mitigation && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    💡 Mitigation: {item.mitigation}
                  </p>
                )}
                {item.page && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    Source: Page {item.page}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. QUICK ACTION RESULT MODAL
export function QuickActionResultModal({ isOpen, onClose, result, documentId }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !result) return null;

  const handleCopy = () => {
    const formatted = formatJsonToMarkdown(result.resultText || '');
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/40 dark:border-indigo-900/40">
              <FiLayers className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {result.title || 'AI Quick Action Result'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Action: {result.action}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <MarkdownRenderer content={result.resultText} />
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
          >
            {copied ? <FiCheck className="text-emerald-500 text-sm" /> : <FiCopy className="text-sm" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. FULLSCREEN PREVIEW MODAL
export function FullscreenPreviewModal({
  isOpen,
  onClose,
  documentId,
  pageCount = 1,
  currentPage = 1,
  onPageChange,
}) {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const blobRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !documentId) return;

    let isMounted = true;
    setLoading(true);

    fetchDocumentPageBlob(documentId, currentPage)
      .then((blobUrl) => {
        if (isMounted) {
          if (blobRef.current) URL.revokeObjectURL(blobRef.current);
          blobRef.current = blobUrl;
          setImageSrc(blobUrl);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageSrc(getDocumentPageUrl(documentId, currentPage));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, [isOpen, documentId, currentPage]);

  if (!isOpen || !documentId) return null;

  const totalPages = Math.max(1, pageCount);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-2 px-4 bg-slate-900/80 rounded-2xl text-white mb-3">
        <span className="text-xs font-bold font-mono">
          Fullscreen Page Viewer — Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
          >
            <FiChevronLeft className="text-sm" />
          </button>
          <span className="text-xs font-mono font-bold px-2">{currentPage} / {totalPages}</span>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
          >
            <FiChevronRight className="text-sm" />
          </button>
          <div className="w-px h-4 bg-white/20 mx-2" />
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500 transition-colors cursor-pointer">
            <FiX className="text-base" />
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2">
        {loading ? (
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          imageSrc && (
            <img
              src={imageSrc}
              alt={`Page ${currentPage}`}
              className="max-h-full max-w-full rounded-xl shadow-2xl object-contain"
            />
          )
        )}
      </div>
    </div>
  );
}

// 8. COMPARE MODAL
export function CompareModal({ isOpen, onClose, currentDoc, allDocs = [] }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  if (!isOpen) return null;

  const candidateDocs = allDocs.filter((d) => d.id !== currentDoc?.id);

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E293B] pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Compare Document
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <FiX className="text-base" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Compare <strong>{currentDoc?.fileName}</strong> with another document in your library:
        </p>

        <select
          value={selectedDocId}
          onChange={(e) => setSelectedDocId(e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="">Select a document to compare...</option>
          {candidateDocs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.fileName} ({d.pageCount || 1} pages)
            </option>
          ))}
        </select>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedDocId) {
                alert(`Starting comparative analysis between "${currentDoc?.fileName}" and document #${selectedDocId}`);
                onClose();
              }
            }}
            disabled={!selectedDocId}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all shadow-xs"
          >
            Start Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. TRANSLATE MODAL (Multi-Language Selection)
export function TranslateModal({
  isOpen,
  onClose,
  onTranslate,
  currentPage = 1,
  pageCount = 1,
  loading = false,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [scope, setScope] = useState('full');
  const [search, setSearch] = useState('');

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese (Simplified)', native: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
    { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳' },
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  ];

  if (!isOpen) return null;

  const filteredLanguages = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!selectedLanguage) return;
    onTranslate(selectedLanguage, scope);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FiGlobe className="text-lg" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Translate Document
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Choose a target language to translate insights with AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Search language */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search language (e.g. Hindi, French, Spanish, Marathi...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Language Selection Grid */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono">
              Target Language ({filteredLanguages.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-0.5">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <button
                    key={lang.code + lang.name}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.name)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold'
                        : 'bg-white dark:bg-[#141B2D] border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#182238]'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{lang.flag}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate">{lang.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {lang.native}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
            <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono">
              Translation Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('full')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scope === 'full'
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 font-semibold'
                    : 'bg-white dark:bg-[#141B2D] border-slate-200/80 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>📄 Overview & Key Findings</span>
                  {scope === 'full' && <FiCheck className="text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Translates executive summary, key topics, and takeaways.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope('page')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scope === 'page'
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 font-semibold'
                    : 'bg-white dark:bg-[#141B2D] border-slate-200/80 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>📑 Current Page ({currentPage}/{pageCount})</span>
                  {scope === 'page' && <FiCheck className="text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Translates content specific to current previewed page.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0c111e]/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !selectedLanguage}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Translating to {selectedLanguage}...</span>
              </>
            ) : (
              <>
                <FiGlobe className="text-sm" />
                <span>Translate into {selectedLanguage}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

