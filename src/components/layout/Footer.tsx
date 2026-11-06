import React from 'react';
import { Film, Music, Puzzle } from 'lucide-react';

interface Props {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#02050B] border-t border-white/10 text-slate-300 pt-16 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-[#002F6C]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002F6C] to-[#CE1126] border border-[#E5A93C]/50 flex items-center justify-center font-cinzel font-bold text-white text-xs shadow-lg">
                RD
              </div>
              <div>
                <span className="font-extrabold text-sm text-white font-cinzel block tracking-wider">
                  CONSTITUCIÓN DOMINICANA
                </span>
                <span className="text-[11px] text-[#E5A93C] font-semibold">
                  «Dios · Patria · Libertad»
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Plataforma digital interactiva sobre la Constitución de la República Dominicana. Integrada con videos cinematográficos en la carpeta <code className="text-[#FCE29C] bg-white/5 px-1 py-0.5 rounded">public/</code> (1.mp4 para portada; 2.mp4 y 3.mp4 en fondos de sección), las 5 imágenes patrias (1.png a 5.png), el audio oficial (1.mp3) y el rompecabezas.
            </p>
          </div>

          {/* Col 2: Secciones Rápidas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
              Navegación Interactiva
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('hero-section')}
                  className="hover:text-[#E5A93C] transition text-left"
                >
                  Portada y Libro 3D (Video 1.mp4)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history-section')}
                  className="hover:text-[#E5A93C] transition text-left"
                >
                  Coverflow 3D: Historia (1844 — 2024)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('powers-section')}
                  className="hover:text-[#E5A93C] transition text-left"
                >
                  Poderes del Estado & Maqueta 3D (Video 2.mp4)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rights-section')}
                  className="hover:text-[#E5A93C] transition text-left"
                >
                  Vitrina Editorial de Derechos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explorer-section')}
                  className="hover:text-[#E5A93C] transition text-left"
                >
                  Buscador de Artículos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery-section')}
                  className="hover:text-[#E5A93C] text-emerald-400 font-semibold transition text-left"
                >
                  5 Imágenes de la República (1.png a 5.png)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('game-section')}
                  className="hover:text-[#E5A93C] text-[#FCE29C] font-semibold transition text-left"
                >
                  Rompecabezas Constitucional (Video 3.mp4)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Organización de Archivos en public/ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-cinzel">
              Recursos Locales en /public
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
                <Film className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                <div>
                  <span className="text-white font-bold block">1.mp4</span>
                  <span className="text-[11px] text-slate-400 font-sans">Portada Hero (exclusivo)</span>
                </div>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
                <Film className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                <div>
                  <span className="text-white font-bold block">2.mp4 y 3.mp4</span>
                  <span className="text-[11px] text-slate-400 font-sans">Fondos repetibles (Poderes, Historia, Juego)</span>
                </div>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
                <Puzzle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-bold block">1.png a 5.png</span>
                  <span className="text-[11px] text-slate-400 font-sans">Fotografías oficiales y Rompecabezas</span>
                </div>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
                <Music className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-bold block">1.mp3</span>
                  <span className="text-[11px] text-slate-400 font-sans">Audio e Himno Oficial</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Constitución de la República Dominicana. Experiencia Digital Libre y Autónoma.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#FCE29C] font-cinzel">Soberanía Popular · División de Poderes · Cláusula Pétrea</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
