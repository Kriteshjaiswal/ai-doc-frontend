import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiFileText,
  FiCompass,
  FiAlertOctagon,
  FiFolder,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiCode,
} from 'react-icons/fi';
import KnowledgeCoreScene from './3d/KnowledgeCoreScene';

export default function HighValueInsightsSection() {
  const [activeNode, setActiveNode] = useState(null);

  const insightNodes = [
    {
      id: 0,
      title: 'Summary',
      subtitle: 'AI generated overview',
      icon: FiFileText,
      color: 'blue',
      position: 'top-2 left-1/2 -translate-x-1/2',
      badge: 'Generated',
      detail: 'Comprehensive executive summary distilling key findings and core context in 3 structured bullets.',
    },
    {
      id: 1,
      title: 'Key Topics',
      subtitle: '7 identified',
      icon: FiCompass,
      color: 'cyan',
      position: 'top-14 left-4 sm:left-10',
      badge: '7 Topics',
      detail: 'Machine learning, architectural patterns, state machines, lifecycle safety.',
    },
    {
      id: 2,
      title: 'Potential Risks',
      subtitle: '1 identified',
      icon: FiAlertOctagon,
      color: 'rose',
      position: 'top-14 right-4 sm:right-10',
      badge: '1 Alert',
      detail: 'Memory leak hazard identified in unbounded singleton cache.',
    },
    {
      id: 3,
      title: 'Key Sections',
      subtitle: '16 identified',
      icon: FiFolder,
      color: 'indigo',
      position: 'top-1/2 -translate-y-1/2 left-2 sm:left-4',
      badge: '16 Sections',
      detail: 'Introduction, Structural Patterns, Behavioral Patterns, Concurrency.',
    },
    {
      id: 4,
      title: 'People & Orgs',
      subtitle: '5 identified',
      icon: FiUsers,
      color: 'blue',
      position: 'top-1/2 -translate-y-1/2 right-2 sm:right-4',
      badge: '5 Entities',
      detail: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, Addison-Wesley.',
    },
    {
      id: 5,
      title: 'Important Dates',
      subtitle: '12 identified',
      icon: FiCalendar,
      color: 'purple',
      position: 'bottom-14 left-4 sm:left-10',
      badge: '12 Dates',
      detail: 'Initial release: 1994, 2nd Revision: 2002, Compliance audit: 2026.',
    },
    {
      id: 6,
      title: 'Financial Figures',
      subtitle: '8 identified',
      icon: FiDollarSign,
      color: 'indigo',
      position: 'bottom-2 left-1/2 -translate-x-1/2',
      badge: '8 Metrics',
      detail: '$4.2M estimated refactor savings, 35% latency reduction.',
    },
    {
      id: 7,
      title: 'Important Clauses',
      subtitle: '13 identified',
      icon: FiCode,
      color: 'teal',
      position: 'bottom-14 right-4 sm:right-10',
      badge: '13 Clauses',
      detail: 'Section 4.1 Limitation of Liability, Section 9.3 Intellectual Property.',
    },
  ];

  return (
    <section
      id="insights"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#030712] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, description & Action */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/35 text-cyan-300 text-[11px] font-bold tracking-widest uppercase backdrop-blur-xl shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <span>WHAT DOCUMIND CAN FIND</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14]">
              Turn Hundreds of Pages <br />
              Into{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
                High-Value Insights.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              DocuMind automatically analyzes your documents and surfaces the
              information that matters most.
            </p>

            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#09122e] hover:bg-[#121f4c] border border-blue-500/35 hover:border-cyan-400/70 backdrop-blur-2xl shadow-lg transition-all hover:scale-105 group"
            >
              <span>Explore All Insights</span>
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Live Hover Detail Box */}
            {activeNode !== null && (
              <div className="w-full p-4 rounded-3xl bg-[#081232]/95 border border-cyan-500/40 backdrop-blur-2xl animate-in fade-in slide-in-from-left-2 duration-200 shadow-2xl">
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {insightNodes[activeNode].title}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {insightNodes[activeNode].detail}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: 3D Knowledge Core with Orbiting Nodes */}
          <div className="lg:col-span-8 relative h-[520px] sm:h-[580px] lg:h-[620px] flex items-center justify-center">
            <div className="w-full h-full relative">
              <KnowledgeCoreScene
                activeNodeIndex={activeNode}
                onNodeHover={setActiveNode}
                className="w-full h-full"
              />

              {/* Central Floating Brand Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center select-none z-20">
                <p className="text-sm sm:text-base font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.95)]">
                  Knowledge
                </p>
                <p className="text-xs sm:text-sm font-black tracking-wider text-cyan-300 uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.95)]">
                  Core
                </p>
              </div>

              {/* Floating UI Glass Node Cards around the 3D Core */}
              {insightNodes.map((node) => {
                const Icon = node.icon;
                const isActive = activeNode === node.id;
                const isRose = node.color === 'rose';

                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    className={`absolute ${node.position} z-30 cursor-pointer select-none transition-all duration-300`}
                  >
                    <div
                      className={`flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${
                        isActive
                          ? isRose
                            ? 'bg-[#280e1c]/95 border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.5)] scale-110'
                            : 'bg-[#0c1a48]/95 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.5)] scale-110'
                          : isRose
                          ? 'bg-[#180a18]/85 border-rose-500/35 hover:border-rose-400 hover:scale-105'
                          : 'bg-[#08102a]/85 border-blue-500/30 hover:border-cyan-400/70 hover:scale-105'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-sm ${
                          isRose
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        <Icon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                          {node.title}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                          {node.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
