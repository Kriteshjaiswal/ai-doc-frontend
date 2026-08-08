import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import { uploadDocument } from '../api/documentApi';
import StatusMessage from '../components/StatusMessage';

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: null, message: null });
  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const navTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setStatus({ type: null, message: null });
    } else {
      setStatus({ type: 'error', message: 'Only PDF files are accepted' });
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus({ type: null, message: null });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);

    try {
      setUploading(true);
      setProgress(0);

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadDocument(file);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);

      setStatus({ type: 'success', message: 'Document uploaded successfully!' });
      setFile(null);

      navTimeoutRef.current = setTimeout(() => {
        navigate('/documents');
      }, 1200);
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setStatus({ type: 'error', message: err.message });
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Upload Document</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload PDF documents to generate AI vector embeddings for Q&A querying.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer perspective-800 card-3d ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-lg scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform ${dragActive ? 'scale-110 bg-indigo-100 dark:bg-indigo-900/60' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <FiUploadCloud className={`text-3xl ${dragActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
        </div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
          {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Accepts PDF files only (up to 50MB)
        </p>
      </div>

      {/* Selected File */}
      {file && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/50 rounded-xl flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
                <FiFile className="text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={removeFile}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <FiX className="text-base" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                <span>
                  {progress === 100 ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <FiCheckCircle /> Complete
                    </span>
                  ) : (
                    'Processing PDF & storing embeddings...'
                  )}
                </span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Action Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {uploading ? 'Uploading Document...' : 'Upload Document'}
      </button>
    </div>
  );
}
