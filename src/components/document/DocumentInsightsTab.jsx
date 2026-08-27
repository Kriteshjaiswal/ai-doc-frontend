import {
  FiUsers,
  FiShield,
  FiCheckSquare,
  FiInfo,
  FiGlobe,
  FiAward,
} from 'react-icons/fi';

export default function DocumentInsightsTab({
  entities = [],
  clauses = [],
  actionItems = [],
  docType,
  language,
  confidence,
  onSelectCitationPage,
}) {
  return (
    <div className="space-y-6">
      {/* Classification & Metadata Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/40 dark:border-indigo-900/40">
            <FiAward className="text-base" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Document Category
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {docType || 'Business Document'}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/40 dark:border-sky-900/40">
            <FiGlobe className="text-base" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Language
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {language || 'English'}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/40 dark:border-emerald-900/40">
            <FiInfo className="text-base" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Extraction Confidence
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {confidence || 'High (Document Grounded)'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Entities & Clauses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extracted Entities */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/40 dark:border-sky-900/40">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Entities & Organizations
              </h3>
              <p className="text-[11px] text-slate-400">
                {entities.length} detected entities and individuals
              </p>
            </div>
          </div>

          {entities.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400">
              No named organizations or individuals detected.
            </p>
          ) : (
            <div className="space-y-2">
              {entities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#141B2D]/70 border border-slate-200/60 dark:border-[#1E293B]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {item.context || item.type}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/40 dark:border-sky-900/40 flex-shrink-0">
                    {item.type || 'Entity'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Important Clauses */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/40 dark:border-violet-900/40">
              <FiShield className="text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Important Clauses & Rules
              </h3>
              <p className="text-[11px] text-slate-400">
                {clauses.length} key contractual clauses identified
              </p>
            </div>
          </div>

          {clauses.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400">
              No formal clauses or legal covenants detected.
            </p>
          ) : (
            <div className="space-y-2">
              {clauses.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.page && onSelectCitationPage?.(item.page)}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#141B2D]/70 border border-slate-200/60 dark:border-[#1E293B] hover:border-violet-300 dark:hover:border-violet-800 transition-colors cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                      {item.importance || 'High'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.summary}
                  </p>
                  {item.page && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Page {item.page}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Items Section */}
      {actionItems.length > 0 && (
        <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/40 dark:border-amber-900/40">
              <FiCheckSquare className="text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Identified Action Items & Deliverables
              </h3>
              <p className="text-[11px] text-slate-400">
                {actionItems.length} operational deliverables extracted
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actionItems.map((ai, idx) => (
              <div
                key={idx}
                onClick={() => ai.page && onSelectCitationPage?.(ai.page)}
                className="p-3.5 rounded-xl border border-slate-200/70 dark:border-[#1E293B] hover:border-amber-300 dark:hover:border-amber-800 transition-all cursor-pointer group space-y-1.5"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {ai.task}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <span>Owner: {ai.assignee || 'Assigned'}</span>
                  <span>Page {ai.page || 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
