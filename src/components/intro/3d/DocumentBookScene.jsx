import React, { useRef, useState, useEffect } from 'react';

/**
 * Procedural 3D Open Cyber Book Scene with Real-Time Mouse Parallax,
 * Holographic Floating Text Layers & Interactive Drag Tilt
 */
export default function DocumentBookScene({ className = 'w-full h-full' }) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setDragOffset({
        x: Math.max(Math.min(deltaX * 0.1, 20), -20),
        y: Math.max(Math.min(deltaY * 0.1, 15), -15),
      });
    } else {
      setMouseOffset({ x, y });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const tiltX = (mouseOffset.y * -14 + dragOffset.y).toFixed(2);
  const tiltY = (mouseOffset.x * 20 + dragOffset.x).toFixed(2);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMouseOffset({ x: 0, y: 0 });
      }}
      onMouseDown={handleMouseDown}
      className={`relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative w-full max-w-[580px] aspect-[16/10] sm:aspect-[16/9] transition-transform duration-200 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Deep Ambient Floor Glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[65%] h-28 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Cyber Book Glass Layer (Pure Vector / CSS) */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-cyan-400/30 bg-[#081028]/80 backdrop-blur-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-cyan-300 tracking-wider font-mono">DOCUMIND_SYNTHESIS.PDF</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-2 py-4">
            <div className="h-3 bg-cyan-500/20 rounded-full w-3/4" />
            <div className="h-3 bg-blue-500/20 rounded-full w-full" />
            <div className="h-3 bg-purple-500/20 rounded-full w-5/6" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Verified Citations</span>
            <span className="text-cyan-400 font-bold">100% Procedural</span>
          </div>
        </div>
      </div>
    </div>
  );
}
