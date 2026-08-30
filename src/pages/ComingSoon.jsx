import { useLocation, Link } from 'react-router-dom';
import {
  FiRepeat,
  FiTrash2,
  FiArrowLeft,
  FiZap,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSliders,
  FiShield,
  FiRefreshCw,
  FiArchive,
} from 'react-icons/fi';

const featureConfigs = {
  comparisons: {
    icon: FiRepeat,
    badgeText: 'Coming Soon • v2.1',
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    title: 'Document Comparison Engine',
    tagline: 'Multi-document semantic diffing & intelligent clause alignment',
    description:
      'We are putting the finishing touches on our side-by-side AI document comparator. Soon, you will be able to upload multiple contract drafts, policy updates, or research papers and instantly pinpoint changes, contradictions, and critical omissions.',
    progress: 75,
    progressLabel: 'Under Active Development (75% Complete)',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/25 text-amber-600 dark:text-amber-400 shadow-amber-500/10',
    accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
    highlights: [
      {
        icon: FiSliders,
        title: 'Side-by-Side Semantic Diffing',
        desc: 'Spot altered clauses, modified metrics, and removed paragraphs visually with contextual highlighting.',
      },
      {
        icon: FiZap,
        title: 'AI Impact Summary',
        desc: 'Get an executive briefing detailing legal risk changes, monetary shifts, and timeline adjustments across versions.',
      },
      {
        icon: FiFileText,
        title: 'Cross-Format Compatibility',
        desc: 'Seamlessly compare PDF to Word (DOCX), or markdown specs against raw plain text without formatting loss.',
      },
      {
        icon: FiShield,
        title: 'Audit & Compliance Export',
        desc: 'Generate downloadable diff reports ready for legal review and compliance sign-off.',
      },
    ],
  },
  trash: {
    icon: FiTrash2,
    badgeText: 'Coming Soon • v2.1',
    badgeColor: 'from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
    title: 'Trash & Document Recovery',
    tagline: 'Safe lifecycle management with 30-day retention and one-click restore',
    description:
      'The unified trash bin and document recovery system is currently being built. You will soon have granular control over soft-deleted documents, archived chats, notes, and secure permanent purging.',
    progress: 85,
    progressLabel: 'Finalizing Retention Policies (85% Complete)',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/25 text-rose-600 dark:text-rose-400 shadow-rose-500/10',
    accentGradient: 'from-rose-500 via-red-500 to-amber-500',
    highlights: [
      {
        icon: FiClock,
        title: '30-Day Safe Retention Window',
        desc: 'Deleted documents and conversation threads are safely archived for 30 days before scheduled removal.',
      },
      {
        icon: FiRefreshCw,
        title: '1-Click Instant Restore',
        desc: 'Accidentally deleted a file? Restore it and its pre-computed vector embeddings with a single click.',
      },
      {
        icon: FiArchive,
        title: 'Granular Workspace Purge',
        desc: 'Permanently destroy individual documents or batch-clean the entire trash bin when needed.',
      },
      {
        icon: FiShield,
        title: 'GDPR & Vector Scrubbing',
        desc: 'Ensures full compliance by completely removing document chunks and cached embeddings upon permanent purge.',
      },
    ],
  },
};

export default function ComingSoon({ feature }) {
  const location = useLocation();

  // Determine feature type from prop or path
  const currentKey =
    feature ||
    (location.pathname.includes('trash')
      ? 'trash'
      : location.pathname.includes('comparison')
      ? 'comparisons'
      : 'comparisons');

  const config = featureConfigs[currentKey] || featureConfigs.comparisons;
  const IconComponent = config.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col justify-between max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-[#0E1322] dark:via-[#111827] dark:to-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] p-6 sm:p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-amber-500/10 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase shadow-2xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span className={`bg-gradient-to-r ${config.accentGradient} bg-clip-text text-transparent font-black`}>
                {config.badgeText}
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {config.title}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400">
                {config.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {config.description}
            </p>

            {/* Progress Bar */}
            <div className="pt-2 space-y-2 max-w-md">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <FiClock className="text-xs text-indigo-500" />
                  {config.progressLabel}
                </span>
                <span className="font-mono">{config.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${config.accentGradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${config.progress}%` }}
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
              >
                <FiArrowLeft className="text-sm" />
                <span>Back to Dashboard</span>
              </Link>
              <Link
                to="/documents"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#2A374D] text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-[#2A374D] transition-all"
              >
                <FiFileText className="text-sm text-indigo-500" />
                <span>Explore Documents</span>
              </Link>
            </div>
          </div>

          {/* Large Feature Graphic / Hero Card */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-shrink-0">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-[#141B2D]/80 border border-slate-200/80 dark:border-[#1E293B] backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-4 max-w-xs w-full">
              <div className={`w-20 h-20 rounded-3xl border ${config.iconBg} flex items-center justify-center text-3xl shadow-lg transition-transform hover:scale-105 duration-300`}>
                <IconComponent />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500">
                  Feature Preview
                </p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {config.title.split(' ')[0]} Module
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                <FiCheckCircle className="text-xs" />
                <span>Scheduled for Release</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiZap className="text-indigo-600 dark:text-indigo-400 text-sm" />
            <span>Planned Capabilities & Features</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">v2.1 Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.highlights.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#0E1322] border border-slate-200/80 dark:border-[#1E293B] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-300 group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform duration-300">
                  <ItemIcon />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
