import React, { useState } from 'react';
import { CONSTITUTION_ARTICLES, ConstitutionalArticle } from '../../data/constitutionData';
import { sound } from '../../utils/audioSystem';
import {
  Search,
  BookOpen,
  Filter,
  Sparkles,
  Share2,
  Check,
  Shield,
  Scale,
  Heart,
  Megaphone,
  GraduationCap,
  Briefcase,
  TreePine,
  LockKeyhole,
  Anchor,
  Compass,
  Building
} from 'lucide-react';

interface Props {
  selectedArticle?: ConstitutionalArticle | null;
}

export const ArticleExplorer: React.FC<Props> = ({ selectedArticle }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'didactico' | 'oficial' | 'practico'>('didactico');
  const [copiedNumber, setCopiedNumber] = useState<number | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos los Artículos' },
    { id: 'principios', label: 'Principios & Soberanía' },
    { id: 'derechos', label: 'Derechos Fundamentales' },
    { id: 'deberes', label: 'Deberes Ciudadanos' },
    { id: 'reforma2024', label: 'Reforma 2024 (Pétrea)' }
  ];

  const filteredArticles = CONSTITUTION_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesNumber = article.number.toString() === q || `articulo ${article.number}`.includes(q);
    const matchesTitle = article.title.toLowerCase().includes(q);
    const matchesOfficial = article.officialText.toLowerCase().includes(q);
    const matchesSimple = article.simpleExplanation.toLowerCase().includes(q);
    const matchesKeywords = article.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && (matchesNumber || matchesTitle || matchesOfficial || matchesSimple || matchesKeywords);
  });

  const handleCopyCitation = (article: ConstitutionalArticle) => {
    sound.playClick();
    const citation = `Constitución Dominicana — Artículo ${article.number} (${article.title}):\n"${article.officialText}"`;
    navigator.clipboard.writeText(citation);
    setCopiedNumber(article.number);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'reforma2024':
        return 'bg-amber-950/80 text-[#FCE29C] border-amber-500/40';
      case 'principios':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'deberes':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'derechos':
      default:
        return 'bg-red-950/80 text-red-300 border-red-500/40';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Reforma 2024 Special Pillar Highlights */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#002F6C] via-[#051124] to-[#CE1126] border border-[#E5A93C]/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FCE29C] mb-2 font-cinzel">
            <Anchor className="w-4 h-4 text-[#E5A93C]" />
            <span>Actualización Constitucional</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-cinzel">
            Reforma Constitucional 2024: Los 4 Pilares de Blindaje
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl font-light">
            Proclamada el 27 de octubre de 2024 en la Asamblea Nacional para consolidar la alternancia democrática y la estabilidad institucional dominicana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider block font-cinzel">
                Pilar 1 · Art. 268 & 278
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5">Cláusula Pétrea</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Ningún gobernante electo podrá beneficiarse de una reforma a la reelección durante su mandato.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider block font-cinzel">
                Pilar 2 · Art. 171
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5">Procuraduría Independiente</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                El Procurador General es propuesto al CNM para blindar al Ministerio Público de presiones partidarias.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider block font-cinzel">
                Pilar 3 · Art. 209
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5">Unificación Electoral 2032</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                A partir de 2032, las elecciones presidenciales, congresuales y municipales se celebran juntas el tercer domingo de mayo.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider block font-cinzel">
                Pilar 4 · Art. 81
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5">Reducción de Diputados</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Se reduce de 190 a 170 el número total de diputados para mayor austeridad y agilidad legislativa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & View Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#070F1E] border border-white/10 shadow-xl">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por artículo (ej. 6, 38, 63) o palabra clave (ej. vida, salud, reelección)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Borrar
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {[
            { id: 'didactico', label: 'Didáctico' },
            { id: 'oficial', label: 'Texto Oficial' },
            { id: 'practico', label: 'Caso Práctico' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                sound.playClick();
                setViewMode(mode.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === mode.id
                  ? 'bg-gradient-to-r from-[#002F6C] to-[#CE1126] text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-[#E5A93C] shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playClick();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat.id
                ? 'bg-[#E5A93C] text-black border-[#E5A93C] shadow-md font-bold'
                : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Mostrando {filteredArticles.length} artículos constitucionales</span>
        {searchQuery && (
          <span className="text-[#FCE29C]">Filtro: «{searchQuery}»</span>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((art) => (
          <div
            key={art.number}
            className="p-6 rounded-3xl bg-[#070F1E] border border-white/10 hover:border-[#E5A93C]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#002F6C] to-[#0A162B] border border-[#E5A93C]/40 flex items-center justify-center font-extrabold text-lg text-[#FCE29C] font-cinzel shadow-md">
                    {art.number}
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(
                        art.category
                      )}`}
                    >
                      {art.category === 'reforma2024' ? 'Reforma 2024' : art.category}
                    </span>
                    <h4 className="text-lg font-bold text-white font-cinzel mt-0.5">
                      {art.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCitation(art)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-[#E5A93C] hover:bg-slate-700 transition"
                  title="Copiar cita oficial"
                >
                  {copiedNumber === art.number ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Dynamic View Mode Content */}
              {viewMode === 'didactico' && (
                <div className="space-y-3 mt-4">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    {art.simpleExplanation}
                  </p>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400">
                    <span className="font-semibold text-[#E5A93C] mr-1">En resumen:</span>
                    {art.practicalExample}
                  </div>
                </div>
              )}

              {viewMode === 'oficial' && (
                <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-[#E5A93C]/20 text-xs sm:text-sm text-slate-300 font-editorial italic leading-relaxed">
                  «{art.officialText}»
                </div>
              )}

              {viewMode === 'practico' && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-1">
                    ¿Cómo te protege en la calle o en el trabajo?
                  </span>
                  {art.practicalExample}
                </div>
              )}
            </div>

            {/* Keyword tags footer */}
            <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {art.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Art. {art.number} CRD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
