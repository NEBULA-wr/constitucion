import React, { useState } from 'react';
import { sound } from '../../utils/audioSystem';
import { OFFICIAL_5_IMAGES } from '../puzzle/ConstitutionalPuzzleGame';
import {
  Image as ImageIcon,
  Puzzle,
  Maximize2,
  Download,
  Sparkles,
  X,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface Props {
  onPlayInPuzzle?: (imageUrl: string) => void;
}

export const ConstitutionalGallery: React.FC<Props> = ({ onPlayInPuzzle }) => {
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<typeof OFFICIAL_5_IMAGES[0] | null>(null);

  const handlePlayPuzzle = (imgUrl: string) => {
    sound.playClick();
    if (onPlayInPuzzle) {
      onPlayInPuzzle(imgUrl);
    } else {
      const el = document.getElementById('game-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#E5A93C]/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] font-cinzel mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Mural Oficial de la República</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-cinzel tracking-tight">
            Las 5 Imágenes de la Constitución
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light">
            Colección oficial de los monumentos, sedes republicanas y documentos históricos que definen la soberanía dominicana. Cada imagen está disponible para armarse en el Rompecabezas oficial.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#002F6C]/60 px-4 py-2.5 rounded-2xl border border-blue-400/40">
          <Sparkles className="w-4 h-4 text-[#FCE29C]" />
          <span className="text-xs font-bold text-white font-mono">5 Imágenes Enumeradas (1.png a 5.png)</span>
        </div>
      </div>

      {/* Photo Grid of 5 Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFICIAL_5_IMAGES.map((image) => (
          <div
            key={image.id}
            className="group relative rounded-3xl overflow-hidden bg-[#0A1424] border border-white/15 hover:border-[#E5A93C]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Preview Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-black/80">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Number Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#E5A93C]/50 text-xs font-mono font-extrabold text-[#FCE29C] shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#CE1126]" />
                <span>{image.filename}</span>
              </div>

              {/* Category pill */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#002F6C]/85 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white">
                {image.category}
              </div>

              {/* Lightbox zoom button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedLightboxImage(image);
                }}
                className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-2xl transform group-hover:scale-110"
                title="Ver fotografía en alta definición"
              >
                <Maximize2 className="w-5 h-5 text-[#FCE29C]" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-cinzel line-clamp-2 leading-snug">
                  {image.title}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => handlePlayPuzzle(image.url)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#0055CC] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 border border-blue-400/40 transition shadow-lg transform hover:scale-[1.02]"
                >
                  <Puzzle className="w-4 h-4 text-[#FCE29C]" />
                  <span>Armar en Rompecabezas</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedLightboxImage(image);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition"
                  title="Ver detalle"
                >
                  <Eye className="w-4 h-4 text-[#E5A93C]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedLightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col rounded-3xl bg-[#0A1424] border border-[#E5A93C] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#002F6C] text-xs font-mono font-bold text-white">
                  {selectedLightboxImage.filename}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-cinzel">
                  {selectedLightboxImage.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedLightboxImage(null)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60">
              <img
                src={selectedLightboxImage.url}
                alt={selectedLightboxImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Ruta: {selectedLightboxImage.url} · {selectedLightboxImage.category}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.createElement('a');
                    el.href = selectedLightboxImage.url;
                    el.download = selectedLightboxImage.filename;
                    el.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-2 border border-white/10"
                >
                  <Download className="w-4 h-4 text-[#FCE29C]" />
                  <span>Descargar</span>
                </button>

                <button
                  onClick={() => {
                    const url = selectedLightboxImage.url;
                    setSelectedLightboxImage(null);
                    handlePlayPuzzle(url);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#CE1126] hover:brightness-110 text-xs font-bold text-white flex items-center gap-2 border border-[#E5A93C] shadow-lg"
                >
                  <Puzzle className="w-4 h-4 text-[#FCE29C]" />
                  <span>Armar en Rompecabezas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
