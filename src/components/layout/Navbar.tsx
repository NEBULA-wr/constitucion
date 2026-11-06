import React, { useState } from 'react';
import { useMedia } from '../../context/MediaContext';
import { sound } from '../../utils/audioSystem';
import {
  Film,
  Music,
  Volume2,
  VolumeX,
  Menu,
  X,
  Shield,
  Gamepad2,
  BookOpen,
  Landmark,
  Calendar
} from 'lucide-react';

interface Props {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<Props> = ({ onNavigate }) => {
  const { isSoundPlaying, toggleSound } = useMedia();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero-section', label: 'Portada', icon: Shield },
    { id: 'history-section', label: 'Historia 3D', icon: Calendar },
    { id: 'powers-section', label: 'Poderes del Estado', icon: Landmark },
    { id: 'rights-section', label: 'Derechos', icon: BookOpen },
    { id: 'explorer-section', label: 'Artículos', icon: BookOpen },
    { id: 'gallery-section', label: '5 Imágenes Oficiales', icon: Film },
    { id: 'game-section', label: 'Rompecabezas', icon: Gamepad2, highlight: true }
  ];

  const handleNavClick = (id: string) => {
    sound.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-[#050B14]/90 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Lockup */}
        <button
          onClick={() => handleNavClick('hero-section')}
          className="flex items-center gap-3 text-left group"
        >
          {/* Dominican Escudo Crest Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002F6C] via-[#051124] to-[#CE1126] border border-[#E5A93C]/50 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
            <span className="text-[#FCE29C] font-extrabold font-cinzel text-xs">RD</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wider font-cinzel">
                CONSTITUCIÓN
              </span>
              <span className="font-extrabold text-sm sm:text-base text-[#E5A93C] font-cinzel">
                DOMINICANA
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block tracking-widest uppercase font-light">
              Experiencia Digital Interactiva
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                item.highlight
                  ? 'bg-gradient-to-r from-[#CE1126] to-[#002F6C] text-white shadow-md hover:brightness-110'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Actions: Audio 1.mp3 Toggle */}
        <div className="flex items-center gap-2">
          {/* Audio 1.mp3 Playback Button */}
          <button
            onClick={() => {
              toggleSound();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition shadow-md ${
              isSoundPlaying
                ? 'bg-gradient-to-r from-amber-950 to-[#002F6C] text-[#FCE29C] border-[#E5A93C]/60 ring-2 ring-[#E5A93C]/20'
                : 'bg-slate-900/90 text-slate-300 border-white/15 hover:text-white hover:border-[#E5A93C]/40'
            }`}
            title={isSoundPlaying ? 'Silenciar audio 1.mp3' : 'Reproducir audio 1.mp3 (Himno Constitucional)'}
          >
            {isSoundPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-[#E5A93C] animate-pulse" />
                <span className="text-[11px] font-bold text-white">Audio 1.mp3: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-medium">Música 1.mp3</span>
              </>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-[#050C1B] border-b border-white/10 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left p-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-3"
            >
              <item.icon className="w-4 h-4 text-[#E5A93C]" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                toggleSound();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#002F6C] text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4 text-[#FCE29C]" />
              <span>{isSoundPlaying ? 'Silenciar Audio 1.mp3' : 'Reproducir Audio 1.mp3'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
