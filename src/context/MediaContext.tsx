import React, { createContext, useContext, useEffect, useState } from 'react';
import { sound } from '../utils/audioSystem';

export interface MediaItem {
  id: string;
  type: 'video' | 'image' | 'audio';
  title: string;
  category: string;
  filename: string;
  path: string;
  assignedTo?: string | null;
  duration?: string;
  loop?: boolean;
  muted?: boolean;
  dateAdded: string;
}

export interface SectionAssignment {
  mediaId: string;
  overlayOpacity: number;
  overlayColor: string;
  playbackRate: number;
  effect: 'vignette-cinematic' | 'sepia-parchment' | 'monumental-blue' | 'golden-glow' | 'game-atmosphere' | 'none';
}

export interface MediaManifest {
  version: string;
  appName: string;
  lastUpdated: string;
  media: MediaItem[];
  sectionAssignments: Record<string, SectionAssignment>;
  soundSettings: {
    ambientMusicVolume: number;
    sfxVolume: number;
    isMuted: boolean;
    selectedTrackId: string;
  };
}

interface MediaContextType {
  manifest: MediaManifest;
  isLoading: boolean;
  isSoundPlaying: boolean;
  activeAudioTitle: string;
  currentAudioTrackId: string | null;
  playAudioTrack: (url: string, title?: string, id?: string) => void;
  pauseAudioTrack: () => void;
  toggleSound: () => void;
  setSoundVolume: (sfx: number, ambient: number) => void;
  getMediaForSection: (sectionKey: string) => { item: MediaItem | null; config: SectionAssignment };
}

// 3 Videos in public/ (1.mp4 exclusively for hero, 2.mp4 and 3.mp4 repeated on other sections)
// 5 Images in public/ (1.png to 5.png)
// 1 Audio in public/ (1.mp3)
const DEFAULT_MANIFEST: MediaManifest = {
  version: '1.0.0',
  appName: 'Constitución Dominicana — Experiencia Digital',
  lastUpdated: new Date().toISOString(),
  media: [
    {
      id: 'vid-1',
      type: 'video',
      title: 'Video 1 — Portada Cinematográfica (1.mp4)',
      category: 'hero',
      filename: '1.mp4',
      path: '/1.mp4',
      assignedTo: 'hero',
      loop: true,
      muted: true,
      dateAdded: '2026-11-05'
    },
    {
      id: 'vid-2',
      type: 'video',
      title: 'Video 2 — Poderes del Estado y Maqueta 3D (2.mp4)',
      category: 'powers',
      filename: '2.mp4',
      path: '/2.mp4',
      assignedTo: 'powers',
      loop: true,
      muted: true,
      dateAdded: '2026-11-05'
    },
    {
      id: 'vid-3',
      type: 'video',
      title: 'Video 3 — Tribunal Constitucional y Arena de Juego (3.mp4)',
      category: 'game',
      filename: '3.mp4',
      path: '/3.mp4',
      assignedTo: 'game',
      loop: true,
      muted: true,
      dateAdded: '2026-11-05'
    },
    {
      id: 'img-1',
      type: 'image',
      title: '1.png — Palacio Nacional de la República Dominicana',
      category: 'powers',
      filename: '1.png',
      path: '/1.png',
      assignedTo: 'powers-executive',
      dateAdded: '2026-11-05'
    },
    {
      id: 'img-2',
      type: 'image',
      title: '2.png — Congreso Nacional (Senado y Cámara de Diputados)',
      category: 'powers',
      filename: '2.png',
      path: '/2.png',
      assignedTo: 'powers-legislative',
      dateAdded: '2026-11-05'
    },
    {
      id: 'img-3',
      type: 'image',
      title: '3.png — Suprema Corte y Tribunal Constitucional',
      category: 'powers',
      filename: '3.png',
      path: '/3.png',
      assignedTo: 'powers-judicial',
      dateAdded: '2026-11-05'
    },
    {
      id: 'img-4',
      type: 'image',
      title: '4.png — Constitución de San Cristóbal de 1844',
      category: 'history',
      filename: '4.png',
      path: '/4.png',
      assignedTo: 'timeline-1844',
      dateAdded: '2026-11-05'
    },
    {
      id: 'img-5',
      type: 'image',
      title: '5.png — Reforma Constitucional 2024',
      category: 'history',
      filename: '5.png',
      path: '/5.png',
      assignedTo: 'timeline-2024',
      dateAdded: '2026-11-05'
    },
    {
      id: 'audio-1',
      type: 'audio',
      title: 'Audio 1 — Himno y Tema Constitucional Dominicano (1.mp3)',
      category: 'anthem',
      filename: '1.mp3',
      path: '/1.mp3',
      assignedTo: 'ambient-music',
      duration: '60s',
      dateAdded: '2026-11-05'
    }
  ],
  sectionAssignments: {
    // 1.mp4 exclusively for hero/portada
    hero: {
      mediaId: 'vid-1',
      overlayOpacity: 0.38,
      overlayColor: '#050B14',
      playbackRate: 1.0,
      effect: 'vignette-cinematic'
    },
    // 2.mp4 repeated on history & powers
    history: {
      mediaId: 'vid-2',
      overlayOpacity: 0.42,
      overlayColor: '#050B14',
      playbackRate: 1.0,
      effect: 'vignette-cinematic'
    },
    powers: {
      mediaId: 'vid-2',
      overlayOpacity: 0.38,
      overlayColor: '#002F6C',
      playbackRate: 1.0,
      effect: 'monumental-blue'
    },
    // 3.mp4 repeated on rights & game
    rights: {
      mediaId: 'vid-3',
      overlayOpacity: 0.4,
      overlayColor: '#050B14',
      playbackRate: 1.0,
      effect: 'golden-glow'
    },
    game: {
      mediaId: 'vid-3',
      overlayOpacity: 0.35,
      overlayColor: '#050B14',
      playbackRate: 1.0,
      effect: 'game-atmosphere'
    }
  },
  soundSettings: {
    ambientMusicVolume: 0.4,
    sfxVolume: 0.6,
    isMuted: false,
    selectedTrackId: 'audio-1'
  }
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifest, setManifest] = useState<MediaManifest>(DEFAULT_MANIFEST);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [activeAudioTitle, setActiveAudioTitle] = useState<string>('Audio 1 — Tema Constitucional (1.mp3)');
  const [currentAudioTrackId, setCurrentAudioTrackId] = useState<string | null>('audio-1');

  // Load manifest from server if available, otherwise use DEFAULT_MANIFEST
  useEffect(() => {
    async function loadServerManifest() {
      try {
        const res = await fetch('/api/media/manifest');
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('json')) {
          const data = await res.json();
          if (data && Array.isArray(data.media)) {
            setManifest(data);
          }
        }
      } catch (e) {
        // Fallback to DEFAULT_MANIFEST
      }
    }
    loadServerManifest();
  }, []);

  // Automatic audio playback: plays 1.mp3 immediately or on the first user interaction
  useEffect(() => {
    let started = false;
    const events = ['click', 'pointerdown', 'touchstart', 'scroll', 'keydown', 'wheel'];

    function cleanupListeners() {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleGesture, { capture: true } as any);
        document.removeEventListener(evt, handleGesture, { capture: true } as any);
      });
    }

    async function handleGesture() {
      await startAutomaticMusic();
    }

    async function startAutomaticMusic() {
      if (started) return;
      const audioPath = '/1.mp3';
      const audioTitle = 'Audio 1 — Himno y Tema Constitucional (1.mp3)';
      const ok = await sound.playTrack(audioPath, audioTitle);
      if (ok) {
        started = true;
        setIsSoundPlaying(true);
        setActiveAudioTitle(audioTitle);
        setCurrentAudioTrackId('audio-1');
        cleanupListeners();
      } else {
        setIsSoundPlaying(false);
      }
    }

    // 1. Attempt immediate playback on launch
    startAutomaticMusic();

    // 2. Register one-time gestures in case browser holds autoplay until interaction
    events.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { capture: true } as any);
      document.addEventListener(evt, handleGesture, { capture: true } as any);
    });

    return () => {
      cleanupListeners();
    };
  }, []);

  const playAudioTrack = async (url: string, title?: string, id?: string) => {
    const ok = await sound.playTrack(url, title);
    if (ok) {
      setIsSoundPlaying(true);
      if (title) setActiveAudioTitle(title);
      if (id) setCurrentAudioTrackId(id);
    }
  };

  const pauseAudioTrack = () => {
    sound.pauseTrack();
    setIsSoundPlaying(false);
  };

  const toggleSound = async () => {
    sound.playClick();
    if (isSoundPlaying) {
      sound.pauseTrack();
      setIsSoundPlaying(false);
    } else {
      const audioItem = manifest.media.find(m => m.type === 'audio') || {
        path: '/1.mp3',
        title: 'Audio 1 — Himno Constitucional (1.mp3)',
        id: 'audio-1'
      };

      const ok = await sound.playTrack(audioItem.path, audioItem.title);
      if (ok) {
        setIsSoundPlaying(true);
        setActiveAudioTitle(audioItem.title);
        setCurrentAudioTrackId(audioItem.id);
      }
    }
  };

  const setSoundVolume = (sfx: number, ambient: number) => {
    sound.setVolumes(sfx, ambient);
    setManifest(prev => ({
      ...prev,
      soundSettings: {
        ...prev.soundSettings,
        sfxVolume: sfx,
        ambientMusicVolume: ambient
      }
    }));
  };

  const getMediaForSection = (sectionKey: string): { item: MediaItem | null; config: SectionAssignment } => {
    const config = manifest.sectionAssignments[sectionKey] || {
      mediaId: sectionKey === 'hero' ? 'vid-1' : sectionKey === 'powers' || sectionKey === 'history' ? 'vid-2' : 'vid-3',
      overlayOpacity: 0.4,
      overlayColor: '#050B14',
      playbackRate: 1.0,
      effect: 'vignette-cinematic'
    };

    let item = manifest.media.find(m => m.id === config.mediaId) || null;

    // Hard fallback mapping directly to public files
    if (!item) {
      if (sectionKey === 'hero') {
        item = {
          id: 'vid-1',
          type: 'video',
          title: 'Video 1 — Portada',
          category: 'hero',
          filename: '1.mp4',
          path: '/1.mp4',
          dateAdded: '2026-11-05'
        };
      } else if (sectionKey === 'powers' || sectionKey === 'history') {
        item = {
          id: 'vid-2',
          type: 'video',
          title: 'Video 2 — Fondos Repetidos',
          category: 'powers',
          filename: '2.mp4',
          path: '/2.mp4',
          dateAdded: '2026-11-05'
        };
      } else {
        item = {
          id: 'vid-3',
          type: 'video',
          title: 'Video 3 — Fondos Repetidos',
          category: 'game',
          filename: '3.mp4',
          path: '/3.mp4',
          dateAdded: '2026-11-05'
        };
      }
    }

    return { item, config };
  };

  return (
    <MediaContext.Provider
      value={{
        manifest,
        isLoading,
        isSoundPlaying,
        activeAudioTitle,
        currentAudioTrackId,
        playAudioTrack,
        pauseAudioTrack,
        toggleSound,
        setSoundVolume,
        getMediaForSection
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
