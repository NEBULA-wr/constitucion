import React, { useState } from 'react';
import { HISTORICAL_MILESTONES, CONSTITUTION_ARTICLES, HistoricalMilestone, ConstitutionalArticle } from '../../data/constitutionData';
import { sound } from '../../utils/audioSystem';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  MapPin,
  Quote,
  Shield,
  Scale,
  Heart,
  Megaphone,
  GraduationCap,
  Briefcase,
  TreePine,
  LockKeyhole,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface Props {
  onSelectArticle?: (article: ConstitutionalArticle) => void;
}

export const ConstitutionalCarousels: React.FC<Props> = ({ onSelectArticle }) => {
  // Carousel 1: 3D Coverflow State
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [activeMilestone, setActiveMilestone] = useState<HistoricalMilestone | null>(null);

  // Carousel 2: Editorial Rights Carousel State
  const [rightsIndex, setRightsIndex] = useState<number>(0);
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<ConstitutionalArticle | null>(null);

  const fundamentalRights = CONSTITUTION_ARTICLES.filter(
    (a) => a.category === 'derechos' || a.category === 'principios' || a.category === 'reforma2024'
  );

  const handleNextHistory = () => {
    sound.playClick();
    setHistoryIndex((prev) => (prev + 1) % HISTORICAL_MILESTONES.length);
  };

  const handlePrevHistory = () => {
    sound.playClick();
    setHistoryIndex((prev) => (prev - 1 + HISTORICAL_MILESTONES.length) % HISTORICAL_MILESTONES.length);
  };

  const handleNextRights = () => {
    sound.playClick();
    setRightsIndex((prev) => (prev + 1) % fundamentalRights.length);
  };

  const handlePrevRights = () => {
    sound.playClick();
    setRightsIndex((prev) => (prev - 1 + fundamentalRights.length) % fundamentalRights.length);
  };

  const getArticleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-amber-400" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-blue-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5 text-teal-400" />;
      case 'LockKeyhole':
        return <LockKeyhole className="w-5 h-5 text-yellow-400" />;
      default:
        return <Shield className="w-5 h-5 text-[#E5A93C]" />;
    }
  };

  return (
    <div className="space-y-24">
      {/* =========================================================================
          CAROUSEL 1: COVERFLOW 3D PERSPECTIVE — HISTORIA CONSTITUCIONAL
         ========================================================================= */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#E5A93C] uppercase mb-1 font-cinzel">
              <Calendar className="w-4 h-4" />
              <span>Evolución Constitucional Dominicana (1844 — 2024)</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-cinzel tracking-tight">
              Coverflow 3D: Grandes Hitos de la República
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-light">
              Explora tridimensionalmente las transformaciones institucionales más decisivas de nuestra historia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevHistory}
              aria-label="Hito histórico anterior"
              className="p-3 rounded-2xl bg-slate-900 border border-[#E5A93C]/30 text-slate-200 hover:text-white hover:border-[#E5A93C] hover:bg-slate-800 transition shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 text-xs font-bold font-cinzel text-[#FCE29C]">
              {historyIndex + 1} / {HISTORICAL_MILESTONES.length}
            </span>
            <button
              onClick={handleNextHistory}
              aria-label="Hito histórico siguiente"
              className="p-3 rounded-2xl bg-slate-900 border border-[#E5A93C]/30 text-slate-200 hover:text-white hover:border-[#E5A93C] hover:bg-slate-800 transition shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Coverflow Container */}
        <div
          className="relative h-[480px] sm:h-[520px] w-full flex items-center justify-center overflow-hidden py-6"
          style={{ perspective: '1200px' }}
        >
          {HISTORICAL_MILESTONES.map((milestone, idx) => {
            const offset = idx - historyIndex;
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // Compute 3D translation & rotation
            const rotateY = offset * -28;
            const translateX = offset * 260;
            const translateZ = -absOffset * 180;
            const scale = Math.max(0.7, 1 - absOffset * 0.15);
            const zIndex = 50 - absOffset;
            const opacity = absOffset > 2 ? 0 : Math.max(0.2, 1 - absOffset * 0.35);

            return (
              <div
                key={milestone.year}
                onClick={() => {
                  sound.playPageFlip();
                  setHistoryIndex(idx);
                }}
                className={`absolute w-[300px] sm:w-[380px] md:w-[440px] rounded-3xl p-6 sm:p-7 transition-all duration-500 cursor-pointer select-none border backdrop-blur-xl shadow-2xl ${
                  isActive
                    ? 'bg-gradient-to-b from-[#0B1A35] via-[#081226] to-[#040914] border-[#E5A93C] ring-2 ring-[#E5A93C]/30'
                    : 'bg-[#060D1A]/90 border-white/10 hover:border-white/30'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity
                }}
              >
                {/* Year Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5A93C] to-[#CE1126] font-cinzel">
                    {milestone.year}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    <MapPin className="w-3 h-3 text-[#CE1126]" />
                    <span className="truncate max-w-[140px]">{milestone.location}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel mb-2">
                  {milestone.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 font-light leading-relaxed">
                  {milestone.summary}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-5 border-t border-white/10 pt-3">
                  {milestone.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-[#E5A93C] font-bold">✓</span>
                      <span className="line-clamp-2">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Quote or Significance */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200 italic">
                  <span className="font-semibold text-[#FCE29C] not-italic block mb-0.5">
                    Trascendencia:
                  </span>
                  {milestone.significance}
                </div>

                {/* Open details button */}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      setActiveMilestone(milestone);
                    }}
                    className="w-full mt-4 py-2 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>Ver Crónica Completa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          CAROUSEL 2: EDITORIAL PANORAMIC — DERECHOS FUNDAMENTALES
         ========================================================================= */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#CE1126] uppercase mb-1 font-cinzel">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <span>Garantías Ciudadanas Inviolables</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-cinzel tracking-tight">
              Vitrina Editorial: Tus Derechos Fundamentales
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-light">
              Menos jerga legal, más claridad ciudadana: descubre qué te protege la Constitución en tu vida diaria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevRights}
              aria-label="Derecho constitucional anterior"
              className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white hover:border-[#CE1126] transition shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 text-xs font-bold font-cinzel text-[#FCE29C]">
              {rightsIndex + 1} / {fundamentalRights.length}
            </span>
            <button
              onClick={handleNextRights}
              aria-label="Derecho constitucional siguiente"
              className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white hover:border-[#CE1126] transition shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editorial Split Showcase for the active right */}
        {(() => {
          const currentArt = fundamentalRights[rightsIndex];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#E5A93C]/35 bg-[#050C1B] shadow-2xl">
              {/* Left Column: Monumental Typographic Block */}
              <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-[#002F6C] via-[#051124] to-[#0A1A38] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
                {/* Decorative background watermark */}
                <div className="absolute right-4 bottom-4 text-9xl font-extrabold text-white/[0.04] font-cinzel pointer-events-none select-none">
                  {currentArt.number}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-black/40 border border-[#E5A93C]/40">
                      {getArticleIcon(currentArt.icon)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-widest text-[#FCE29C] uppercase font-cinzel">
                        Artículo {currentArt.number}
                      </span>
                      <span className="block text-xs text-slate-300">Constitución Dominicana</span>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel leading-tight mb-4">
                    {currentArt.title}
                  </h3>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-slate-300 leading-relaxed font-editorial italic">
                    {currentArt.officialText}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {currentArt.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-900/40 text-blue-200 border border-blue-500/30"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Practical Application & Citizen Impact */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-[#070F1F] space-y-6">
                <div className="space-y-6">
                  {/* Didactic explanation */}
                  <div>
                    <span className="text-xs font-bold text-[#E5A93C] uppercase tracking-wider block mb-2 font-cinzel">
                      ¿Qué significa esto para ti?
                    </span>
                    <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
                      {currentArt.simpleExplanation}
                    </p>
                  </div>

                  {/* Practical real world example */}
                  <div className="p-5 rounded-2xl bg-[#0B1A35]/60 border border-emerald-500/25">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Caso de la Vida Cotidiana:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {currentArt.practicalExample}
                    </p>
                  </div>
                </div>

                {/* Bottom Quick Selector Pill Bar */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                    {fundamentalRights.map((a, i) => (
                      <button
                        key={a.number}
                        onClick={() => {
                          sound.playClick();
                          setRightsIndex(i);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          i === rightsIndex
                            ? 'bg-[#E5A93C] text-black shadow-lg scale-105'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        Art. {a.number}
                      </button>
                    ))}
                  </div>

                  {onSelectArticle && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectArticle(currentArt);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ver en el Explorador</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Milestone Modal */}
      {activeMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#091428] border border-[#E5A93C]/50 p-6 sm:p-8 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#E5A93C] uppercase font-cinzel">
                  Hito Constitucional {activeMilestone.year}
                </span>
                <h3 className="text-2xl font-bold text-white font-cinzel">
                  {activeMilestone.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveMilestone(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed mb-5">
              {activeMilestone.summary}
            </p>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-[#FCE29C] uppercase block">Puntos Fundamentales:</span>
              {activeMilestone.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-[#CE1126] font-bold">▪</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {activeMilestone.quote && (
              <div className="p-4 rounded-2xl bg-black/40 border border-[#E5A93C]/30 text-xs italic text-[#FCE29C] font-editorial mb-6">
                <Quote className="w-4 h-4 text-[#E5A93C] mb-1" />
                {activeMilestone.quote}
              </div>
            )}

            <button
              onClick={() => setActiveMilestone(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110"
            >
              Cerrar Reseña
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
