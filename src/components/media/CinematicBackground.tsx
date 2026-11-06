import React, { useEffect, useRef, useState } from 'react';
import { useMedia } from '../../context/MediaContext';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  sectionKey: 'hero' | 'history' | 'powers' | 'rights' | 'game';
  className?: string;
  children?: React.ReactNode;
  aspectPreset?: 'hero' | 'panoramic' | 'cinemascope' | 'full';
  showVideoToggle?: boolean;
}

export const CinematicBackground: React.FC<Props> = ({
  sectionKey,
  className = '',
  children,
  aspectPreset = 'full',
  showVideoToggle = false
}) => {
  const { getMediaForSection } = useMedia();
  const { item, config } = getMediaForSection(sectionKey);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [pureVideoMode, setPureVideoMode] = useState(false);

  // Reset video error when item changes
  useEffect(() => {
    setHasVideoError(false);
  }, [item?.path]);

  // Ensure video playback
  useEffect(() => {
    if (videoRef.current) {
      if (config.playbackRate) {
        videoRef.current.playbackRate = config.playbackRate;
      }
      videoRef.current.play().catch(() => {
        // Autoplay policy note: muted videos play automatically
      });
    }
  }, [item?.path, config.playbackRate]);

  // Procedural canvas fallback if video is not available or errors out
  useEffect(() => {
    const isPlayingVideo = item && item.type === 'video' && item.path && !hasVideoError;
    if (isPlayingVideo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // Particles for cinematic atmosphere
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#E5A93C' : '#3B82F6'
    }));

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep cinematic Dominican gradient
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t * 0.5) * 80,
        height * 0.4,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );

      if (sectionKey === 'hero') {
        grad.addColorStop(0, '#001E47');
        grad.addColorStop(0.45, '#050D1A');
        grad.addColorStop(0.85, '#2A060A');
        grad.addColorStop(1, '#02050A');
      } else if (sectionKey === 'powers') {
        grad.addColorStop(0, '#002855');
        grad.addColorStop(0.5, '#071224');
        grad.addColorStop(1, '#02060D');
      } else if (sectionKey === 'game') {
        grad.addColorStop(0, '#1E0B2B');
        grad.addColorStop(0.4, '#0A0E24');
        grad.addColorStop(1, '#03050B');
      } else {
        grad.addColorStop(0, '#121A28');
        grad.addColorStop(0.6, '#080E18');
        grad.addColorStop(1, '#020408');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Stylized fluid wave (simulating undulating flag folds)
      ctx.save();
      ctx.globalAlpha = 0.12;
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        for (let x = 0; x <= width; x += 30) {
          const waveY =
            height * 0.55 +
            Math.sin(x * 0.003 + t + w) * 55 +
            Math.cos(x * 0.005 - t * 0.8) * 35;
          ctx.lineTo(x, waveY);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = w % 2 === 0 ? '#CE1126' : '#002F6C';
        ctx.fill();
      }
      ctx.restore();

      // Atmospheric floating gold/amber ember motes
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.globalAlpha = p.opacity * (0.6 + Math.sin(t * 2 + p.x) * 0.4);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [item?.path, sectionKey, hasVideoError]);

  // Visual effects classes
  const getEffectOverlayClass = () => {
    switch (config.effect) {
      case 'sepia-parchment':
        return 'mix-blend-multiply bg-amber-950/20';
      case 'monumental-blue':
        return 'mix-blend-color-dodge bg-blue-900/20';
      case 'golden-glow':
        return 'mix-blend-screen bg-amber-500/10';
      case 'game-atmosphere':
        return 'mix-blend-overlay bg-purple-900/20';
      case 'vignette-cinematic':
      default:
        return 'cinematic-vignette';
    }
  };

  // Overlay opacity tuned to let the video shine through clearly
  const targetOpacity = pureVideoMode ? 0.05 : (config.overlayOpacity ?? 0.35);

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {item && item.type === 'video' && item.path && !hasVideoError ? (
          <video
            ref={videoRef}
            src={item.path}
            autoPlay
            loop={item.loop !== false}
            muted
            playsInline
            onError={() => {
              console.warn('Video failed to load, switching to procedural fallback:', item.path);
              setHasVideoError(true);
            }}
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
        ) : item && item.type === 'image' && item.path ? (
          <img
            src={item.path}
            alt={item.title}
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
        ) : (
          <canvas ref={canvasRef} className="w-full h-full block" />
        )}

        {/* Dynamic Color Overlay - lighter so the video is clearly seen */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundColor: config.overlayColor || '#050B14',
            opacity: targetOpacity
          }}
        />

        {/* Cinematic Mask / Vignette / Grain Effect */}
        {!pureVideoMode && (
          <div className={`absolute inset-0 ${getEffectOverlayClass()} transition-opacity duration-500`} />
        )}

        {/* Top/Bottom Cinematic Fade gradients */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050B14] to-transparent opacity-80" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#050B14] to-transparent opacity-80" />
      </div>

      {/* Pure Video Toggle in top right */}
      {showVideoToggle && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setPureVideoMode(!pureVideoMode)}
            className="px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-medium text-white hover:bg-black/80 backdrop-blur-md flex items-center gap-1.5 transition"
            title={pureVideoMode ? "Restaurar vista con texto legible" : "Ver video cinematográfico completo en primer plano"}
          >
            {pureVideoMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-teal-400" />}
            <span className="hidden sm:inline">
              {pureVideoMode ? "Restaurar Vista" : "Maximizar Video"}
            </span>
          </button>
        </div>
      )}

      {/* Foreground Content with frosted glass treatment when pureVideoMode is off */}
      <div className={`relative z-10 w-full h-full transition-opacity duration-500 ${pureVideoMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
};
