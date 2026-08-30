import React from 'react';

export default function IntroFooter() {
  return (
    <footer className="relative py-10 px-4 sm:px-6 lg:px-8 bg-[#030712] border-t border-white/[0.04] text-center flex flex-col items-center justify-center space-y-1.5 select-none">
      <p className="text-[10.5px] font-black tracking-[0.25em] text-slate-400 uppercase">
        DOCUMIND • AI INTELLIGENCE
      </p>
      <p className="text-[11px] text-slate-500 font-normal">
        AI powered answers grounded in your documents.
      </p>
    </footer>
  );
}
