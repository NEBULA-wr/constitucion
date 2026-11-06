import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audioSystem';
import {
  Puzzle,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  CheckCircle2,
  Clock,
  Shuffle,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface Tile {
  id: number;
  currentPos: number; // current index in the grid (0 to total-1)
  correctPos: number; // target index (0 to total-1)
}

interface Props {
  selectedImageOverride?: string | null;
}

export const OFFICIAL_5_IMAGES = [
  {
    num: 1,
    id: 'img-1',
    filename: '1.png',
    title: '1.png — Palacio Nacional de la República Dominicana',
    shortTitle: '1.png — Palacio Nacional',
    category: 'Poder Ejecutivo',
    url: '/1.png',
    fallbackUrl: '/media/images/1.png'
  },
  {
    num: 2,
    id: 'img-2',
    filename: '2.png',
    title: '2.png — Congreso Nacional (Senado y Cámara de Diputados)',
    shortTitle: '2.png — Congreso Nacional',
    category: 'Poder Legislativo',
    url: '/2.png',
    fallbackUrl: '/media/images/2.png'
  },
  {
    num: 3,
    id: 'img-3',
    filename: '3.png',
    title: '3.png — Suprema Corte de Justicia y Tribunal Constitucional',
    shortTitle: '3.png — Tribunal Constitucional',
    category: 'Poder Judicial',
    url: '/3.png',
    fallbackUrl: '/media/images/3.png'
  },
  {
    num: 4,
    id: 'img-4',
    filename: '4.png',
    title: '4.png — Constitución de San Cristóbal de 1844',
    shortTitle: '4.png — San Cristóbal 1844',
    category: 'Historia Fundacional',
    url: '/4.png',
    fallbackUrl: '/media/images/4.png'
  },
  {
    num: 5,
    id: 'img-5',
    filename: '5.png',
    title: '5.png — Reforma Constitucional 2024',
    shortTitle: '5.png — Reforma 2024',
    category: 'Cláusula Pétrea',
    url: '/5.png',
    fallbackUrl: '/media/images/5.png'
  }
];

export const ConstitutionalPuzzleGame: React.FC<Props> = ({ selectedImageOverride }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const activeImageObj = OFFICIAL_5_IMAGES[activeImageIndex] || OFFICIAL_5_IMAGES[0];
  const activeImage = activeImageObj.url;

  useEffect(() => {
    if (selectedImageOverride) {
      const idx = OFFICIAL_5_IMAGES.findIndex(
        (img) => img.url === selectedImageOverride || img.fallbackUrl === selectedImageOverride || img.filename === selectedImageOverride
      );
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [selectedImageOverride]);

  // Difficulty Grid: 3x3 (9), 4x4 (16), 5x5 (25)
  const [gridSize, setGridSize] = useState<number>(3);
  const totalPieces = gridSize * gridSize;

  // Board state
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [draggedTileIndex, setDraggedTileIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(false);

  // Initialize or shuffle puzzle
  const initPuzzle = (size = gridSize, autoShuffle = true) => {
    const total = size * size;
    const initialTiles: Tile[] = Array.from({ length: total }, (_, i) => ({
      id: i,
      currentPos: i,
      correctPos: i
    }));

    if (autoShuffle) {
      const shuffledPositions = [...Array(total).keys()];
      for (let i = shuffledPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
      }

      initialTiles.forEach((tile, index) => {
        tile.currentPos = shuffledPositions[index];
      });
    }

    setTiles(initialTiles);
    setSelectedTileIndex(null);
    setMoves(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setIsSolved(false);
  };

  // Run on mount or when active image or size changes
  useEffect(() => {
    initPuzzle(gridSize, true);
  }, [activeImageIndex, gridSize]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isSolved) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isSolved]);

  // Check if solved
  const checkWinCondition = (currentTiles: Tile[]) => {
    const solved = currentTiles.every((t) => t.currentPos === t.correctPos);
    if (solved) {
      setIsSolved(true);
      setIsTimerRunning(false);
      sound.playBadgeUnlock();
    }
  };

  // Swap two tiles by their current positions
  const swapTiles = (posA: number, posB: number) => {
    if (posA === posB) return;
    sound.playClick();

    setTiles((prev) => {
      const tileA = prev.find((t) => t.currentPos === posA);
      const tileB = prev.find((t) => t.currentPos === posB);

      if (!tileA || !tileB) return prev;

      const updated = prev.map((t) => {
        if (t.id === tileA.id) return { ...t, currentPos: posB };
        if (t.id === tileB.id) return { ...t, currentPos: posA };
        return t;
      });

      checkWinCondition(updated);
      return updated;
    });

    setMoves((m) => m + 1);
    setSelectedTileIndex(null);
  };

  // Handle tile click
  const handleTileClick = (pos: number) => {
    if (isSolved) return;

    if (selectedTileIndex === null) {
      sound.playClick();
      setSelectedTileIndex(pos);
    } else {
      swapTiles(selectedTileIndex, pos);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (pos: number) => {
    setDraggedTileIndex(pos);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPos: number) => {
    if (draggedTileIndex !== null) {
      swapTiles(draggedTileIndex, targetPos);
      setDraggedTileIndex(null);
    }
  };

  // Auto-solve button for instant showcase
  const handleAutoSolve = () => {
    sound.playSuccess();
    setTiles((prev) =>
      prev.map((t) => ({
        ...t,
        currentPos: t.correctPos
      }))
    );
    setIsSolved(true);
    setIsTimerRunning(false);
    sound.playBadgeUnlock();
  };

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const correctCount = tiles.filter((t) => t.currentPos === t.correctPos).length;
  const progressPercent = Math.round((correctCount / totalPieces) * 100);

  return (
    <div className="relative w-full text-slate-100">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-[#E5A93C]/40 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] font-cinzel mb-1">
            <Puzzle className="w-4 h-4" />
            <span>Videojuego Oficial Constitucional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-cinzel tracking-tight">
            Rompecabezas de las 5 Imágenes Patrias
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-light">
            Reconstruye las 5 imágenes oficiales de la Constitución de la República Dominicana (1.png a 5.png).
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center bg-black/70 p-1.5 rounded-2xl border border-white/20 shadow-lg">
          <button
            onClick={() => {
              sound.playClick();
              setGridSize(3);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              gridSize === 3
                ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white border border-[#E5A93C] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fácil (3×3)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setGridSize(4);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              gridSize === 4
                ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white border border-[#E5A93C] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Medio (4×4)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setGridSize(5);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              gridSize === 5
                ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white border border-[#E5A93C] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Experto (5×5)
          </button>
        </div>
      </div>

      {/* 5 Official Images Carousel Selector */}
      <div className="mb-6 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 font-cinzel uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#E5A93C]" />
            <span>Selecciona una de las 5 imágenes oficiales (1.png a 5.png):</span>
          </span>
          <span className="text-xs text-[#FCE29C] font-mono font-bold bg-[#002F6C]/80 px-2.5 py-1 rounded-md border border-blue-400/30">
            {activeImageObj.filename} · {activeImageObj.category}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {OFFICIAL_5_IMAGES.map((img, index) => {
            const isSelected = activeImageIndex === index;
            return (
              <button
                key={img.id}
                onClick={() => {
                  sound.playClick();
                  setActiveImageIndex(index);
                }}
                className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 h-24 sm:h-28 text-left ${
                  isSelected
                    ? 'border-[#E5A93C] ring-4 ring-[#E5A93C]/40 scale-105 shadow-2xl z-10'
                    : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#002F6C] text-[10px] font-bold text-white font-mono border border-blue-400/40">
                      {img.filename}
                    </span>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-[#E5A93C] text-black">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-white font-bold line-clamp-1 leading-tight">
                    {img.shortTitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gameplay Stats & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-[#070F1E]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FCE29C]" />
            <span className="text-xs text-slate-400">Tiempo:</span>
            <span className="text-sm font-mono font-bold text-white">
              {formatTime(timerSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Movimientos:</span>
            <span className="text-sm font-mono font-bold text-white">{moves}</span>
          </div>

          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Progreso:</span>
            <span className="text-sm font-mono font-bold text-emerald-300">
              {correctCount} / {totalPieces} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowNumbers(!showNumbers);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showNumbers
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-black/50 border-white/15 text-slate-300 hover:text-white'
            }`}
            title="Mostrar u ocultar números guías en las piezas"
          >
            {showNumbers ? 'Ocultar Números' : 'Números Guía'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowOriginal(!showOriginal);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              showOriginal
                ? 'bg-blue-950/80 border-blue-400 text-blue-200'
                : 'bg-black/50 border-white/15 text-slate-300 hover:text-white'
            }`}
          >
            {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showOriginal ? 'Ver Tablero' : 'Ver Original'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              initPuzzle(gridSize, true);
            }}
            className="px-3 py-1.5 rounded-xl bg-black/50 hover:bg-slate-800 border border-white/15 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            title="Mezclar de nuevo las piezas"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Mezclar</span>
          </button>

          <button
            onClick={handleAutoSolve}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition"
            title="Completar automáticamente"
          >
            Resolver
          </button>
        </div>
      </div>

      {/* Main Board Arena */}
      <div className="relative w-full max-w-3xl mx-auto aspect-square rounded-3xl overflow-hidden border-4 border-[#E5A93C]/50 shadow-2xl bg-black/85">
        {/* Full Image Preview Overlay if requested */}
        {showOriginal && (
          <div className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300">
            <img
              src={activeImage}
              alt="Guía Original"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white backdrop-blur-md">
              Vista previa: {activeImageObj.filename}
            </div>
          </div>
        )}

        {/* Puzzle Grid */}
        <div
          className="w-full h-full grid p-2.5 gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: totalPieces }).map((_, gridPosition) => {
            const tile = tiles.find((t) => t.currentPos === gridPosition);
            if (!tile) return <div key={gridPosition} className="bg-slate-900/50 rounded-xl" />;

            const isSelected = selectedTileIndex === gridPosition;
            const isCorrect = tile.currentPos === tile.correctPos;

            const correctRow = Math.floor(tile.correctPos / gridSize);
            const correctCol = tile.correctPos % gridSize;
            const posX = (correctCol / (gridSize - 1)) * 100;
            const posY = (correctRow / (gridSize - 1)) * 100;

            return (
              <div
                key={tile.id}
                onClick={() => handleTileClick(gridPosition)}
                draggable={!isSolved}
                onDragStart={() => handleDragStart(gridPosition)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(gridPosition)}
                className={`relative rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-200 transform ${
                  isSelected
                    ? 'ring-4 ring-[#E5A93C] scale-105 z-20 shadow-2xl'
                    : isCorrect
                    ? 'hover:brightness-110 shadow-md'
                    : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/40 shadow-sm'
                }`}
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${posX}% ${posY}%`
                }}
              >
                <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-xl" />

                {showNumbers && (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-mono font-bold text-[#FCE29C] border border-[#E5A93C]/40 backdrop-blur-sm pointer-events-none">
                    {tile.correctPos + 1}
                  </div>
                )}

                {isCorrect && (
                  <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Victory Celebration Modal Overlay */}
        {isSolved && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="p-4 rounded-full bg-gradient-to-br from-[#E5A93C] to-[#CE1126] text-white shadow-2xl mb-4 border border-[#FCE29C]">
              <Trophy className="w-12 h-12 text-[#FFF0A0]" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold uppercase tracking-widest border border-emerald-500/40 mb-2 font-cinzel">
              ¡Rompecabezas Completado!
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-cinzel">
              ¡Gran Armador de la Patria!
            </h3>

            <p className="text-sm text-slate-300 mt-2 max-w-md font-light">
              Has armado con éxito «{activeImageObj.title}» demostrando destreza y conocimiento constitucional.
            </p>

            <div className="grid grid-cols-2 gap-4 my-6 bg-black/60 p-4 rounded-2xl border border-white/15 w-full max-w-sm">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-cinzel block">Tiempo Total</span>
                <span className="text-xl font-mono font-bold text-[#FCE29C]">
                  {formatTime(timerSeconds)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-cinzel block">Movimientos</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {moves}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  initPuzzle(gridSize, true);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#002F6C] to-[#0055CC] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-xl transition transform hover:scale-105 border border-blue-400/40"
              >
                Jugar Otra Vez
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveImageIndex((activeImageIndex + 1) % OFFICIAL_5_IMAGES.length);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#CE1126] to-[#990A1A] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-xl transition transform hover:scale-105 border border-red-400/40 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FCE29C]" />
                <span>Armar Siguiente Imagen ({((activeImageIndex + 1) % OFFICIAL_5_IMAGES.length) + 1}.png)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-slate-400">
        💡 Haz clic en una pieza y luego en otra para intercambiarlas (o arrástralas directamente con el ratón).
      </div>
    </div>
  );
};
