import { useState, useEffect, useRef } from 'react';
import {
  FiZoomIn,
  FiZoomOut,
  FiDownload,
  FiMaximize2,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiFileText,
} from 'react-icons/fi';
import { getDocumentPageUrl, getDocumentFileUrl, fetchDocumentPageBlob } from '../../api/documentApi';

export default function DocumentPreview({
  documentId,
  pageCount = 1,
  currentPage = 1,
  onPageChange,
  onOpenFullscreen,
}) {
  const [zoom, setZoom] = useState(100);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [inputPage, setInputPage] = useState(currentPage);
  const totalPages = Math.max(1, pageCount);
  const containerRef = useRef(null);
  const currentBlobUrlRef = useRef(null);

  useEffect(() => {
    setInputPage(currentPage);
    loadPageImage();

    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, [currentPage, documentId]);

  const loadPageImage = async () => {
    if (!documentId) return;

    setImageLoading(true);
    setImageError(false);

    try {
      // 1. Try authenticated blob fetch
      const objectUrl = await fetchDocumentPageBlob(documentId, currentPage);
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
      }
      currentBlobUrlRef.current = objectUrl;
      setImageSrc(objectUrl);
      setImageLoading(false);
    } catch (err) {
      console.warn('Blob fetch failed, attempting token URL fallback:', err);
      // 2. Fallback to direct tokenized URL
      const directUrl = getDocumentPageUrl(documentId, currentPage);
      setImageSrc(directUrl);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(inputPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
    } else {
      setInputPage(currentPage);
    }
  };

  const handleDownload = () => {
    if (!documentId) return;
    const downloadUrl = getDocumentFileUrl(documentId);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `document_${documentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card rounded-2xl shadow-xs overflow-hidden flex flex-col h-full min-h-[500px] border border-slate-200/90 dark:border-[#1E293B]">
      {/* Top Preview Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/70 dark:bg-[#0c111e]/70 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Document Preview
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#1E293B] transition-colors disabled:opacity-40 cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <FiZoomOut className="text-xs" />
          </button>

          <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 px-1.5 min-w-[40px] text-center">
            {zoom}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#1E293B] transition-colors disabled:opacity-40 cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <FiZoomIn className="text-xs" />
          </button>

          <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/70 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            title="Download PDF"
            aria-label="Download PDF"
          >
            <FiDownload className="text-xs" />
          </button>

          <button
            onClick={onOpenFullscreen}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/70 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            title="Fullscreen Preview"
            aria-label="Fullscreen Preview"
          >
            <FiMaximize2 className="text-xs" />
          </button>
        </div>
      </div>

      {/* Main PDF Page Display Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100/60 dark:bg-[#080B11] relative min-h-[380px]"
      >
        {/* Loading Spinner */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-2xs z-10 space-y-2">
            <div className="w-7 h-7 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">
              Rendering Page {currentPage}...
            </span>
          </div>
        )}

        {/* Page Render / Error Fallback */}
        {imageError ? (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FiFileText className="text-xl" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Unable to render preview for page {currentPage}
            </p>
            <button
              onClick={loadPageImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
            >
              <FiRefreshCw className="text-xs" />
              <span>Retry Render</span>
            </button>
          </div>
        ) : (
          imageSrc && (
            <div
              className="transition-transform duration-200 ease-out origin-center flex items-center justify-center max-w-full"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <img
                key={`${documentId}-${currentPage}-${imageSrc}`}
                src={imageSrc}
                alt={`Page ${currentPage}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                className="max-h-[500px] w-auto rounded-lg shadow-md border border-slate-200/80 dark:border-white/10 object-contain select-none"
              />
            </div>
          )
        )}
      </div>

      {/* Bottom Page Navigation Controls */}
      <div className="px-4 py-2.5 border-t border-slate-100 dark:border-[#1E293B] bg-white dark:bg-[#0B0F17] flex items-center justify-center gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <FiChevronLeft className="text-sm" />
        </button>

        {/* Page indicator input form */}
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 text-xs font-semibold">
          <input
            type="text"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onBlur={handlePageInputSubmit}
            className="w-9 py-0.5 text-center font-mono font-bold bg-slate-100 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-slate-400 dark:text-slate-500 font-mono">/ {totalPages}</span>
        </form>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Next Page"
          aria-label="Next Page"
        >
          <FiChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
}
