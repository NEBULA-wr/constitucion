/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MediaProvider } from './context/MediaContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CinematicHero } from './components/hero/CinematicHero';
import { ConstitutionalCarousels } from './components/carousels/ConstitutionalCarousels';
import { Powers3D } from './components/three/Powers3D';
import { ArticleExplorer } from './components/explorer/ArticleExplorer';
import { ConstitutionalGallery } from './components/gallery/ConstitutionalGallery';
import { ConstitutionalPuzzleGame } from './components/puzzle/ConstitutionalPuzzleGame';
import { MisionConstitucionGame } from './components/game/MisionConstitucionGame';
import { CinematicBackground } from './components/media/CinematicBackground';
import { ConstitutionalArticle } from './data/constitutionData';
import { sound } from './utils/audioSystem';
import { Puzzle, Sparkles, Scale } from 'lucide-react';

function AppContent() {
  const [selectedArticle, setSelectedArticle] = useState<ConstitutionalArticle | null>(null);
  const [selectedPuzzleImage, setSelectedPuzzleImage] = useState<string | null>(null);
  const [activeGameMode, setActiveGameMode] = useState<'puzzle' | 'trivia'>('puzzle');

  // Check query params for autostart
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectArticleFromCarousel = (article: ConstitutionalArticle) => {
    setSelectedArticle(article);
    scrollToSection('explorer-section');
  };

  const handlePlayImageInPuzzle = (imageUrl: string) => {
    setSelectedPuzzleImage(imageUrl);
    setActiveGameMode('puzzle');
    scrollToSection('game-section');
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 flex flex-col font-sans selection:bg-[#CE1126] selection:text-white">
      {/* Top Global Navigation Bar */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Content Sections */}
      <main className="flex-1 w-full overflow-hidden">
        {/* SECTION 1: PORTADA CINEMATOGRÁFICA (Hero con video 1.mp4) */}
        <section id="hero-section">
          <CinematicHero
            onExploreClick={() => scrollToSection('history-section')}
            onPlayClick={() => scrollToSection('game-section')}
          />
        </section>

        {/* SECTION 2: HISTORIA & DERECHOS (Carousels Dinámicos & 3D Coverflow con video 2.mp4 de fondo) */}
        <section id="history-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <CinematicBackground sectionKey="history" showVideoToggle className="rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            <div id="rights-section">
              <ConstitutionalCarousels onSelectArticle={handleSelectArticleFromCarousel} />
            </div>
          </CinematicBackground>
        </section>

        {/* SECTION 3: PODERES DEL ESTADO (3D Forum con Fondo de Video 2.mp4 de Maqueta 3D) */}
        <section id="powers-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Powers3D />
        </section>

        {/* SECTION 4: EXPLORADOR CONSTITUCIONAL Y REFORMA 2024 (Fondo con video 3.mp4) */}
        <section id="explorer-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <CinematicBackground sectionKey="rights" showVideoToggle className="rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] font-cinzel mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Consulta Ciudadana Oficial</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cinzel">
                Explorador de Artículos Constitucionales
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light">
                Compara el texto jurídico oficial con explicaciones didácticas y ejemplos de aplicación en la vida diaria.
              </p>
            </div>

            <ArticleExplorer selectedArticle={selectedArticle} />
          </CinematicBackground>
        </section>

        {/* SECTION 5: MURAL & 5 IMÁGENES OFICIALES (1.png a 5.png) */}
        <section id="gallery-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <CinematicBackground sectionKey="hero" showVideoToggle className="rounded-3xl p-6 sm:p-10 border border-[#E5A93C]/30 shadow-2xl">
            <ConstitutionalGallery onPlayInPuzzle={handlePlayImageInPuzzle} />
          </CinematicBackground>
        </section>

        {/* SECTION 6: JUEGO DEL FINAL — ROMPECABEZAS (1.png a 5.png con video 3.mp4 de fondo) */}
        <section id="game-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <CinematicBackground sectionKey="game" showVideoToggle className="rounded-3xl p-4 sm:p-8 border border-[#E5A93C]/40 shadow-2xl">
            {/* Game Mode Selector Switcher */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2 bg-black/70 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGameMode('puzzle');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeGameMode === 'puzzle'
                      ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white border border-[#E5A93C] shadow-lg scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Puzzle className="w-4 h-4 text-[#FCE29C]" />
                  <span>🧩 Rompecabezas (1.png a 5.png)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGameMode('trivia');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeGameMode === 'trivia'
                      ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white border border-[#E5A93C] shadow-lg scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>⚖️ Misión Constitución (Casos & Trivia)</span>
                </button>
              </div>
            </div>

            {/* Active Game Component */}
            {activeGameMode === 'puzzle' ? (
              <ConstitutionalPuzzleGame selectedImageOverride={selectedPuzzleImage} />
            ) : (
              <MisionConstitucionGame autostart={isAutostart} />
            )}
          </CinematicBackground>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Floating Action Quick Access Dock (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        <button
          onClick={() => {
            sound.playClick();
            scrollToSection('game-section');
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#CE1126] to-[#002F6C] text-white border border-white/20 shadow-2xl hover:scale-110 transition flex items-center gap-2"
          title="Ir al Rompecabezas Constitucional"
        >
          <Puzzle className="w-5 h-5 text-[#FCE29C]" />
          <span className="hidden md:inline text-xs font-bold text-white font-cinzel">
            Rompecabezas
          </span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MediaProvider>
      <AppContent />
    </MediaProvider>
  );
}
