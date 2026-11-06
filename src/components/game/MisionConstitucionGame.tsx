import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  GameMode,
  GameState,
  createInitialGameState,
  calculatePoints,
  determineRank,
  checkNewBadges,
  ALL_BADGES,
  CASOS_CIUDADANOS,
  CONSTITUTIONAL_RIDDLES,
  RIGHT_DEFENSE_ITEMS,
  BATTLE_ROUNDS,
  Badge,
  CaseCitizen,
  ConstitutionalRiddle,
  RightDefenseItem,
  BattleRoundItem
} from '../../game/engine';
import { sound } from '../../utils/audioSystem';
import {
  Shield,
  ShieldCheck,
  Zap,
  Award,
  Crown,
  Heart,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Crosshair,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Props {
  onCloseGame?: () => void;
  autostart?: boolean;
}

export const MisionConstitucionGame: React.FC<Props> = ({ onCloseGame, autostart = false }) => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [viewState, setViewState] = useState<'title' | 'playing' | 'victory' | 'gameover'>(
    autostart ? 'playing' : 'title'
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recentBadges, setRecentBadges] = useState<Badge[]>([]);

  // Feedback banner state
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    explanation: string;
    article: number;
    points: number;
  } | null>(null);

  // Sub-mode indices
  const [casoIndex, setCasoIndex] = useState<number>(0);
  const [riddleIndex, setRiddleIndex] = useState<number>(0);
  const [defenseIndex, setDefenseIndex] = useState<number>(0);
  const [battleIndex, setBattleIndex] = useState<number>(0);

  // Timers
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const timerRef = useRef<number | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());

  // Start round timer for timed modes
  useEffect(() => {
    if (viewState !== 'playing' || isPaused || feedback) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (gameState.currentMode === 'batalla' || gameState.currentMode === 'defiende') {
      const initialTime = gameState.currentMode === 'batalla' ? 12 : 10;
      setTimeLeft(initialTime);
      roundStartTimeRef.current = Date.now();

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [viewState, isPaused, feedback, gameState.currentMode, battleIndex, defenseIndex]);

  const handleTimeOut = () => {
    sound.playError();
    const newLives = gameState.lives - 1;
    setGameState((prev) => ({
      ...prev,
      lives: newLives,
      streak: 0
    }));

    setFeedback({
      show: true,
      isCorrect: false,
      explanation: '¡Tiempo agotado! En el orden constitucional, la celeridad es vital para garantizar la justicia.',
      article: 6,
      points: 0
    });

    if (newLives <= 0) {
      setTimeout(() => {
        setViewState('gameover');
      }, 2500);
    }
  };

  const handleStartGame = (mode: GameMode = 'caso') => {
    sound.playClick();
    const initial = createInitialGameState();
    initial.currentMode = mode;
    setGameState(initial);
    setCasoIndex(0);
    setRiddleIndex(0);
    setDefenseIndex(0);
    setBattleIndex(0);
    setFeedback(null);
    setRecentBadges([]);
    setViewState('playing');
    roundStartTimeRef.current = Date.now();
  };

  // Evaluate Answer Core Function
  const handleAnswer = (isCorrect: boolean, explanation: string, articleNumber: number) => {
    const elapsedSecs = Math.max(1, Math.round((Date.now() - roundStartTimeRef.current) / 1000));

    if (isCorrect) {
      sound.playSuccess();
      const newStreak = gameState.streak + 1;
      const pts = calculatePoints(100, newStreak, elapsedSecs);
      const newScore = gameState.score + pts;

      const updatedState: GameState = {
        ...gameState,
        score: newScore,
        streak: newStreak,
        maxStreak: Math.max(gameState.maxStreak, newStreak),
        totalQuestionsAnswered: gameState.totalQuestionsAnswered + 1,
        totalCorrect: gameState.totalCorrect + 1,
        rankTitle: determineRank(newScore)
      };

      // Add mode progress
      if (gameState.currentMode === 'caso') {
        const cId = CASOS_CIUDADANOS[casoIndex].id;
        if (!updatedState.completedCasos.includes(cId)) {
          updatedState.completedCasos.push(cId);
        }
      } else if (gameState.currentMode === 'escape') {
        const sId = CONSTITUTIONAL_RIDDLES[riddleIndex].id;
        if (!updatedState.unlockedSeals.includes(sId)) {
          updatedState.unlockedSeals.push(sId);
        }
      }

      // Check badge unlocks
      const unlocked = checkNewBadges(updatedState, elapsedSecs);
      if (unlocked.length > 0) {
        sound.playBadgeUnlock();
        setRecentBadges((prev) => [...prev, ...unlocked]);
      }

      setGameState(updatedState);

      setFeedback({
        show: true,
        isCorrect: true,
        explanation,
        article: articleNumber,
        points: pts
      });

      // Confetti celebratory burst on milestone or high streak
      if (newStreak % 3 === 0 || updatedState.score >= 1000) {
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } else {
      sound.playError();
      const newLives = gameState.lives - 1;
      setGameState((prev) => ({
        ...prev,
        streak: 0,
        lives: newLives,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1
      }));

      setFeedback({
        show: true,
        isCorrect: false,
        explanation,
        article: articleNumber,
        points: 0
      });

      if (newLives <= 0) {
        setTimeout(() => {
          setViewState('gameover');
        }, 2500);
      }
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setFeedback(null);
    roundStartTimeRef.current = Date.now();

    if (gameState.currentMode === 'caso') {
      if (casoIndex + 1 < CASOS_CIUDADANOS.length) {
        setCasoIndex(casoIndex + 1);
      } else {
        triggerVictory();
      }
    } else if (gameState.currentMode === 'escape') {
      if (riddleIndex + 1 < CONSTITUTIONAL_RIDDLES.length) {
        setRiddleIndex(riddleIndex + 1);
      } else {
        triggerVictory();
      }
    } else if (gameState.currentMode === 'defiende') {
      if (defenseIndex + 1 < RIGHT_DEFENSE_ITEMS.length) {
        setDefenseIndex(defenseIndex + 1);
      } else {
        triggerVictory();
      }
    } else if (gameState.currentMode === 'batalla') {
      if (battleIndex + 1 < BATTLE_ROUNDS.length) {
        setBattleIndex(battleIndex + 1);
      } else {
        triggerVictory();
      }
    }
  };

  const triggerVictory = () => {
    sound.playBadgeUnlock();
    setViewState('victory');
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  return (
    <div className="relative w-full min-h-[620px] rounded-3xl bg-gradient-to-b from-[#030712] via-[#09152B] to-[#02050D] border border-[#E5A93C]/40 shadow-2xl overflow-hidden flex flex-col justify-between text-slate-100">
      {/* =========================================================================
          HUD: GAME STATUS BAR (Low occlusion, tabular-nums)
         ========================================================================= */}
      {viewState === 'playing' && (
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#E5A93C]/30 text-[#FCE29C] text-xs font-bold font-cinzel">
              <Crown className="w-4 h-4 text-[#E5A93C]" />
              <span className="hidden sm:inline">{gameState.rankTitle}</span>
            </div>

            {/* Streak Multiplier */}
            {gameState.streak > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-extrabold animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>x{gameState.streak} Racha</span>
              </div>
            )}
          </div>

          {/* Center Timer (if applicable) */}
          {(gameState.currentMode === 'batalla' || gameState.currentMode === 'defiende') && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                timeLeft <= 4
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : 'bg-slate-900 text-slate-200 border border-slate-700'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span className="tabular-nums">{timeLeft}s</span>
            </div>
          )}

          {/* Right Status Cluster: Score & Lives */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-cinzel">
                Puntuación
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#FCE29C] font-mono tabular-nums">
                {gameState.score}
              </span>
            </div>

            {/* Lives / Escudos */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Shield
                  key={i}
                  className={`w-5 h-5 transition ${
                    i < gameState.lives
                      ? 'text-[#CE1126] fill-[#CE1126]'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Pausar juego"
            >
              II
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 1: GAME TITLE SCREEN
         ========================================================================= */}
      {viewState === 'title' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center relative z-10">
          {/* Bespoke Heraldic Title Lockup */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-[#E5A93C]/40 text-[#FCE29C] text-xs font-bold uppercase tracking-widest mb-4 font-cinzel shadow-lg">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <span>Videojuego Constitucional Oficial</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-cinzel tracking-tight leading-none">
              MISIÓN CONSTITUCIÓN
            </h1>
            <p className="text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5A93C] to-[#CE1126] mt-2 font-cinzel">
              EL DESAFÍO DE LA REPÚBLICA
            </p>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mt-2 font-light">
              5 modos de juego reales: resuelve controversias ciudadanas, descifra los sellos de la República y defiende los derechos humanos.
            </p>
          </div>

          {/* Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full max-w-4xl mb-8">
            {[
              {
                id: 'caso',
                title: 'Caso Constitucional',
                desc: 'Resuelve situaciones de la vida real con la Carta Magna',
                icon: ShieldCheck,
                color: 'from-[#002F6C] to-[#0A1D3B]'
              },
              {
                id: 'escape',
                title: 'Escape Constitucional',
                desc: 'Descifra los 3 Sellos sagrados en la Cámara de 1844',
                icon: Lock,
                color: 'from-[#0F2B1F] to-[#06170F]'
              },
              {
                id: 'defiende',
                title: 'Defiende tus Derechos',
                desc: 'Clasificación ultra veloz contra el cronómetro',
                icon: Zap,
                color: 'from-[#3A1407] to-[#1F0A03]'
              },
              {
                id: 'batalla',
                title: 'Batalla Constitucional',
                desc: 'Torneo por rondas, combos de velocidad y gloria',
                icon: Crown,
                color: 'from-[#2B0910] to-[#140407]'
              }
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => handleStartGame(m.id as GameMode)}
                  className={`p-4 rounded-2xl bg-gradient-to-b ${m.color} border border-white/10 hover:border-[#E5A93C] text-left transition-all duration-300 hover:scale-105 shadow-xl group`}
                >
                  <Icon className="w-6 h-6 text-[#E5A93C] mb-2 group-hover:rotate-6 transition" />
                  <h3 className="font-bold text-sm text-white font-cinzel">{m.title}</h3>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug font-light">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Start CTA Button */}
          <button
            onClick={() => handleStartGame('caso')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#002F6C] via-[#CE1126] to-[#E5A93C] text-white font-black text-sm uppercase tracking-widest hover:brightness-110 shadow-2xl transition transform hover:scale-105 flex items-center gap-3 border border-white/20"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>JUGAR AHORA — MISIONES CIUDADANAS</span>
          </button>

          {/* Flat control-hint line */}
          <p className="text-[11px] text-slate-400 mt-4 font-mono">
            Clic o Toca para responder · Explicaciones constitucionales en cada turno · Sin registro obligatorio
          </p>
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: PLAYING — MODE: CASO CONSTITUCIONAL
         ========================================================================= */}
      {viewState === 'playing' && gameState.currentMode === 'caso' && (
        <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full z-10">
          {(() => {
            const caso = CASOS_CIUDADANOS[casoIndex];
            return (
              <div className="space-y-6">
                {/* Case Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/30">
                      Caso {casoIndex + 1}/{CASOS_CIUDADANOS.length}
                    </span>
                    <span className="text-xs text-[#E5A93C] font-semibold">{caso.category}</span>
                  </div>
                  <span className="text-xs text-slate-400">{caso.characterRole}</span>
                </div>

                {/* Scenario narrative card */}
                <div className="p-6 rounded-2xl bg-[#081326] border border-[#E5A93C]/30 shadow-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002F6C] to-[#CE1126] flex items-center justify-center font-bold text-white text-sm">
                      {caso.characterName[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-cinzel">
                        {caso.characterName}
                      </h3>
                      <p className="text-xs text-slate-400">{caso.title}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-light">
                    {caso.scenario}
                  </p>

                  <div className="pt-2 text-xs font-bold text-[#FCE29C] font-cinzel">
                    {caso.question}
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {caso.options.map((opt) => (
                    <button
                      key={opt.id}
                      disabled={!!feedback}
                      onClick={() => handleAnswer(opt.isCorrect, opt.explanation, opt.articleNumber)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition border ${
                        feedback
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                          : 'bg-[#0A162B] border-white/10 hover:border-[#E5A93C] hover:bg-[#0E1F3D] text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-xs font-bold text-[#E5A93C] shrink-0 mt-0.5">
                          {opt.id.slice(-1).toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCREEN 2B: PLAYING — MODE: ESCAPE CONSTITUCIONAL (3D Riddle Chamber)
         ========================================================================= */}
      {viewState === 'playing' && gameState.currentMode === 'escape' && (
        <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full z-10">
          {(() => {
            const riddle = CONSTITUTIONAL_RIDDLES[riddleIndex];
            const isUnlocked = gameState.unlockedSeals.includes(riddle.id);

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      Sello {riddleIndex + 1} de {CONSTITUTIONAL_RIDDLES.length}
                    </span>
                    <span className="text-xs text-[#E5A93C] font-semibold">{riddle.sealName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#FCE29C]">
                    {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
                    <span>{isUnlocked ? 'Desbloqueado' : 'Sellado'}</span>
                  </div>
                </div>

                {/* Chamber Narrative */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#06170F] to-[#0A1C2E] border border-emerald-500/30 shadow-xl space-y-3">
                  <p className="text-xs text-slate-300 italic">{riddle.chamberDescription}</p>

                  <div className="p-4 rounded-xl bg-black/50 border border-[#E5A93C]/40 text-sm sm:text-base text-[#FCE29C] font-editorial">
                    {riddle.riddleText}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Pistas: {riddle.hints.join(' · ')}</span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {riddle.options.map((opt) => (
                    <button
                      key={opt.id}
                      disabled={!!feedback}
                      onClick={() => handleAnswer(opt.isCorrect, opt.explanation, opt.articleNumber)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition border ${
                        feedback
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                          : 'bg-[#0A162B] border-white/10 hover:border-emerald-400 text-slate-200'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCREEN 2C: PLAYING — MODE: DEFIENDE TUS DERECHOS (Fast match)
         ========================================================================= */}
      {viewState === 'playing' && gameState.currentMode === 'defiende' && (
        <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full z-10">
          {(() => {
            const item = RIGHT_DEFENSE_ITEMS[defenseIndex];
            const categories = [
              'Vida y Dignidad',
              'Libertad y Seguridad',
              'Salud y Educación',
              'Medio Ambiente',
              'Reforma 2024'
            ];

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#E5A93C] uppercase font-cinzel">
                    Identifica el Derecho Inviolable ({defenseIndex + 1}/{RIGHT_DEFENSE_ITEMS.length})
                  </span>
                  <span className="text-xs text-red-400 font-mono font-bold">{timeLeft}s</span>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C0B05] to-[#0A1529] border border-amber-500/30 text-center space-y-3">
                  <span className="text-xs font-bold uppercase text-amber-300">Situación Vulnerada:</span>
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    «{item.situation}»
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      disabled={!!feedback}
                      onClick={() =>
                        handleAnswer(
                          cat === item.correctRightType,
                          item.explanation,
                          item.articleNumber
                        )
                      }
                      className="p-4 rounded-xl bg-[#0A162B] border border-white/10 hover:border-[#E5A93C] hover:bg-[#122340] text-xs sm:text-sm font-bold text-white transition text-center"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCREEN 2D: PLAYING — MODE: BATALLA CONSTITUCIONAL (Timed jeopardy)
         ========================================================================= */}
      {viewState === 'playing' && gameState.currentMode === 'batalla' && (
        <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full z-10">
          {(() => {
            const round = BATTLE_ROUNDS[battleIndex];

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#CE1126] uppercase font-cinzel">
                    Ronda de Batalla {battleIndex + 1}/{BATTLE_ROUNDS.length}
                  </span>
                  <span className="text-xs text-red-400 font-mono font-bold">{timeLeft}s</span>
                </div>

                <div className="p-6 rounded-2xl bg-[#0A162B] border border-red-500/30 text-center space-y-2">
                  <h3 className="text-base sm:text-xl font-bold text-white font-cinzel leading-snug">
                    {round.prompt}
                  </h3>
                </div>

                <div className="space-y-3">
                  {round.options.map((optText, optIdx) => (
                    <button
                      key={optIdx}
                      disabled={!!feedback}
                      onClick={() =>
                        handleAnswer(
                          optIdx === round.correctIndex,
                          round.explanation,
                          round.articleNumber
                        )
                      }
                      className="w-full p-4 rounded-2xl bg-[#081224] border border-white/10 hover:border-[#E5A93C] text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition text-left"
                    >
                      {optText}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          FEEDBACK BANNER (Constitutional Explanation & Next Step)
         ========================================================================= */}
      {feedback && feedback.show && (
        <div className="p-5 sm:p-6 bg-[#040C1A]/95 border-t border-[#E5A93C]/40 backdrop-blur-md z-30 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              )}
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {feedback.isCorrect ? `¡Correcto! +${feedback.points} Puntos` : 'Infracción Constitucional'}
                </span>
                <span className="block text-[11px] text-[#FCE29C] font-cinzel">
                  Fundamento: Artículo {feedback.article} de la Constitución Dominicana
                </span>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-1.5 shadow-lg shrink-0"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
            {feedback.explanation}
          </p>
        </div>
      )}

      {/* =========================================================================
          SCREEN 3: VICTORY SCREEN
         ========================================================================= */}
      {viewState === 'victory' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E5A93C] via-[#CE1126] to-[#002F6C] flex items-center justify-center shadow-2xl animate-bounce">
            <Award className="w-10 h-10 text-white" />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cinzel">
              ¡VICTORIA REPUBLICANA!
            </h2>
            <p className="text-[#FCE29C] font-cinzel text-lg mt-1 font-bold">
              {gameState.rankTitle}
            </p>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
              Has demostrado un dominio ejemplar de la Carta Magna dominicana, sus principios fundacionales y la reforma del 2024.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-8">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Puntos Totales</span>
              <span className="block text-2xl font-extrabold text-[#FCE29C] font-mono">
                {gameState.score}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Aciertos</span>
              <span className="block text-2xl font-extrabold text-emerald-400 font-mono">
                {gameState.totalCorrect}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Racha Máxima</span>
              <span className="block text-2xl font-extrabold text-red-400 font-mono">
                {gameState.maxStreak}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleStartGame('caso')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Vez</span>
            </button>
            <button
              onClick={() => setViewState('title')}
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10"
            >
              Menú Principal
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 4: GAME OVER SCREEN
         ========================================================================= */}
      {viewState === 'gameover' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center shadow-xl">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
              Misión Inconclusa
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 font-light">
              Se han agotado los escudos constitucionales. Cada error es una oportunidad para aprender tus derechos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStartGame(gameState.currentMode)}
              className="px-6 py-3 rounded-xl bg-[#002F6C] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Misión</span>
            </button>
            <button
              onClick={() => setViewState('title')}
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider"
            >
              Menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
