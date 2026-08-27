import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck, FiSearch, FiFileText, FiLayers, FiX } from 'react-icons/fi';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  icon: DefaultIcon,
  className = '',
  menuWidth = 'w-72',
  align = 'left',
  searchable = true,
  searchPlaceholder = 'Search documents...',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Selected Option Object
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Filtered options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none bg-white/90 dark:bg-[#111728]/90 border ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/5'
            : 'border-slate-200/90 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs'
        } text-slate-700 dark:text-slate-200 ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption?.icon ? (
            <selectedOption.icon className="text-sm text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          ) : selectedOption?.value === '' ? (
            <FiLayers className="text-sm text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          ) : selectedOption ? (
            <FiFileText className="text-sm text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          ) : DefaultIcon ? (
            <DefaultIcon className="text-sm text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          ) : null}

          <span className="truncate max-w-[150px] sm:max-w-[210px] font-medium text-slate-800 dark:text-slate-100">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <FiChevronDown
          className={`text-slate-400 text-xs transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-indigo-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 ${menuWidth} max-w-[90vw] z-50 rounded-2xl bg-white/95 dark:bg-[#111728]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#1E293B] shadow-2xl shadow-slate-900/10 dark:shadow-black/50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top`}
        >
          {/* Search Bar inside dropdown (if options > 4 or explicitly searchable) */}
          {(searchable || options.length > 4) && (
            <div className="p-1.5 pb-2 border-b border-slate-100 dark:border-[#1E293B]/80 mb-1">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-2.5 text-slate-400 text-xs pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-100/80 dark:bg-[#0c111e]/80 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-0.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                No matching documents
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                const ItemIcon = opt.icon || (opt.value === '' ? FiLayers : FiFileText);

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/40 dark:border-indigo-800/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-[#182238] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-[#1E293B] text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <ItemIcon className="text-xs" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-xs ${
                            isSelected
                              ? 'font-bold text-indigo-900 dark:text-indigo-200'
                              : 'font-medium text-slate-800 dark:text-slate-200'
                          }`}
                          title={opt.label}
                        >
                          {opt.label}
                        </p>
                        {opt.subText && (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {opt.subText}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <FiCheck className="text-indigo-600 dark:text-indigo-400 text-sm flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
