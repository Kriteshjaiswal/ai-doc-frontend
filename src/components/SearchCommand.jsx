import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFileText, FiMessageSquare, FiUpload, FiLayers, FiSun, FiMoon, FiX } from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { useTheme } from '../context/ThemeContext';

export default function SearchCommand({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchDocs();
    }
  }, [isOpen]);

  const fetchDocs = async () => {
    try {
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  // Filtered documents
  const filteredDocs = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(query.toLowerCase())
  );

  // Static action items
  const actions = [
    {
      id: 'action-upload',
      title: 'Upload new document',
      icon: FiUpload,
      category: 'Actions',
      run: () => {
        navigate('/upload');
        onClose();
      },
    },
    {
      id: 'action-chat',
      title: 'Open AI Chat',
      icon: FiMessageSquare,
      category: 'Actions',
      run: () => {
        navigate('/chat');
        onClose();
      },
    },
    {
      id: 'action-flashcards',
      title: 'Generate Flashcards',
      icon: FiLayers,
      category: 'Actions',
      run: () => {
        navigate('/flashcards');
        onClose();
      },
    },
    {
      id: 'action-theme',
      title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: isDark ? FiSun : FiMoon,
      category: 'Actions',
      run: () => {
        toggleTheme();
        onClose();
      },
    },
  ].filter((act) => act.title.toLowerCase().includes(query.toLowerCase()));

  // Combine items for keyboard navigation
  const allItems = [
    ...filteredDocs.map((doc) => ({
      id: `doc-${doc.id}`,
      title: doc.fileName,
      icon: FiFileText,
      category: 'Documents',
      run: () => {
        navigate(`/documents`);
        onClose();
      },
    })),
    ...actions,
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].run();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in-overlay"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-10 animate-zoom-in-modal flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-[#1E293B]">
          <FiSearch className="text-slate-400 text-base mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search documents, conversations and actions..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-2"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 custom-scrollbar max-h-[380px]">
          {/* Documents Group */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Documents
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredDocs.map((doc, idx) => {
                  const globalIdx = idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        navigate(`/documents`);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B]/60'
                      }`}
                    >
                      <FiFileText className={`text-base flex-shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className="truncate flex-1">{doc.fileName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Group */}
          {actions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Actions
              </div>
              <div className="space-y-0.5 mt-1">
                {actions.map((act, idx) => {
                  const globalIdx = filteredDocs.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      onClick={act.run}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B]/60'
                      }`}
                    >
                      <Icon className={`text-base flex-shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className="truncate flex-1">{act.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {allItems.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No matching documents or actions found.
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0F1422]/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Use <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 text-[10px]">↓</kbd> to navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 text-[10px]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
