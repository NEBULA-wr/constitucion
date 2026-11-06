import React from 'react';
import { ConstitutionalBook3D } from '../three/ConstitutionalBook3D';
import { CinematicBackground } from '../media/CinematicBackground';
import { sound } from '../../utils/audioSystem';
import { CONSTITUTION_STATS } from '../../data/constitutionData';
import { BookOpen, Play, ChevronDown, Shield } from 'lucide-react';

interface Props {
  onExploreClick: () => void;
  onPlayClick: () => void;
}

export const CinematicHero: React.FC<Props> = ({
  onExploreClick,
  onPlayClick
}) => {
  return (
    <CinematicBackground sectionKey="hero" showVideoToggle className="min-h-screen flex flex-col justify-between pt-24 pb-12">
      {/* Central Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 z-10 my-auto">
        {/* Left Column: Monumental Cinematic Typography */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          {/* Top Dominican Emblem Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002F6C]/85 border border-[#E5A93C]/40 text-[#FCE29C] text-xs font-bold uppercase tracking-widest font-cinzel shadow-2xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#CE1126]" />
            <span>República Dominicana · Carta Magna 1844 — 2024</span>
          </div>

          {/* Monumental Headline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-cinzel tracking-tight leading-none drop-shadow-2xl">
              CONSTITUCIÓN
            </h1>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5A93C] to-[#CE1126] font-cinzel tracking-tight leading-none drop-shadow-2xl">
              DOMINICANA
            </h1>
          </div>

          {/* Exact Subtitle Requested by User */}
          <p className="text-base sm:text-xl md:text-2xl font-light text-slate-200 font-editorial italic max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow">
            «Conoce tus derechos. Descubre tu historia. Vive tu Constitución».
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
            Una experiencia digital de nueva generación con interactividad 3D, entornos audiovisuales inmersivos y el rompecabezas constitucional de la República.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onExploreClick();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#002F6C] to-[#0055CC] text-white font-extrabold text-xs uppercase tracking-widest hover:brightness-110 shadow-2xl transition transform hover:scale-105 border border-blue-400/40 flex items-center justify-center gap-2.5"
            >
              <BookOpen className="w-4 h-4 text-[#FCE29C]" />
              <span>EXPLORAR</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onPlayClick();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#CE1126] to-[#990A1A] text-white font-extrabold text-xs uppercase tracking-widest hover:brightness-110 shadow-2xl transition transform hover:scale-105 border border-red-400/40 flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>JUGAR AHORA</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-cinzel block">Fundada</span>
              <span className="text-base sm:text-lg font-bold text-[#FCE29C] font-mono">1844</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-cinzel block">Artículos</span>
              <span className="text-base sm:text-lg font-bold text-white font-mono">{CONSTITUTION_STATS.totalArticles}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-cinzel block">Última Reforma</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">{CONSTITUTION_STATS.latestReformYear}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Constitutional Book */}
        <div className="flex-1 w-full max-w-xl flex items-center justify-center relative">
          <ConstitutionalBook3D onExploreClick={onExploreClick} />
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="flex flex-col items-center justify-center gap-2 text-slate-400 z-10 pt-4">
        <button
          onClick={onExploreClick}
          className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest hover:text-[#E5A93C] transition font-cinzel"
        >
          <span>Desliza para explorar</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#E5A93C]" />
        </button>
      </div>
    </CinematicBackground>
  );
};
