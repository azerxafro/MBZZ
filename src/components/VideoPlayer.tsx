import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronDown, Play, RefreshCw } from 'lucide-react';

// ── Streaming providers (all free embeds using TMDB ID) ──────────────────────
const PROVIDERS = {
  movie: [
    { name: 'VidSrc', url: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
    { name: 'VidSrc.xyz', url: (id: number) => `https://vidsrc.xyz/embed/movie?tmdb=${id}` },
    { name: 'Embed.su', url: (id: number) => `https://embed.su/embed/movie/${id}` },
    { name: '2Embed', url: (id: number) => `https://www.2embed.cc/embed/${id}` },
    { name: 'SuperEmbed', url: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  ],
  tv: [
    { name: 'VidSrc', url: (id: number, s = 1, e = 1) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
    { name: 'VidSrc.xyz', url: (id: number) => `https://vidsrc.xyz/embed/tv?tmdb=${id}` },
    { name: 'Embed.su', url: (id: number, s = 1, e = 1) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
    { name: '2Embed', url: (id: number, s = 1, e = 1) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
    { name: 'SuperEmbed', url: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  ],
};

type Props = {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  info: any;
  onBack: () => void;
};

export default function VideoPlayer({ tmdbId, mediaType, info, onBack }: Props) {
  const [providerIdx, setProviderIdx] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [showProviders, setShowProviders] = useState(false);

  const providers = PROVIDERS[mediaType];
  const current = providers[providerIdx];
  const embedUrl =
    mediaType === 'tv'
      ? (current.url as any)(tmdbId, season, episode)
      : (current.url as any)(tmdbId);

  const title = info?.title || info?.name || 'Unknown Title';
  const backdrop = info?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${info.backdrop_path}`
    : null;
  const seasons: number[] = info?.number_of_seasons
    ? Array.from({ length: info.number_of_seasons }, (_, i) => i + 1)
    : [1];
  const episodes: number[] = Array.from({ length: info?.seasons?.[season - 1]?.episode_count || 20 }, (_, i) => i + 1);

  // Reset loaded state when provider/ep/season changes
  useEffect(() => { setLoaded(false); }, [providerIdx, season, episode]);

  // Escape to go back
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onBack]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* ── Top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-white font-semibold truncate max-w-xs">{title}</span>
          {mediaType === 'tv' && (
            <span className="text-white/50 text-sm">S{season}:E{episode}</span>
          )}
        </div>

        {/* Provider picker */}
        <div className="relative">
          <button
            onClick={() => setShowProviders(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            <Play size={12} fill="white" />
            {current.name}
            <ChevronDown size={14} />
          </button>
          {showProviders && (
            <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded shadow-2xl overflow-hidden z-50">
              {providers.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => { setProviderIdx(i); setShowProviders(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    i === providerIdx
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.name}
                  {i === 0 && <span className="ml-2 text-xs text-green-400">★ Best</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Player ── */}
      <div className="flex-1 flex items-center justify-center pt-14 relative">
        {/* Blurred backdrop behind player */}
        {backdrop && !loaded && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        )}

        {/* Loading shimmer */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <div className="w-16 h-16 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <p className="text-white/50 text-sm">Loading stream — {current.name}</p>
            <button
              onClick={() => setProviderIdx((i) => (i + 1) % providers.length)}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-colors mt-2"
            >
              <RefreshCw size={12} /> Try next provider
            </button>
          </div>
        )}

        <iframe
          key={`${providerIdx}-${season}-${episode}`}
          src={embedUrl}
          className={`w-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ height: 'calc(100vh - 56px)' }}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="origin"
          onLoad={() => setLoaded(true)}
          title={title}
        />
      </div>

      {/* ── TV Season / Episode picker ── */}
      {mediaType === 'tv' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-t from-black/95 to-transparent">
          <span className="text-white/50 text-sm font-medium">Season</span>
          <select
            value={season}
            onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); }}
            className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-white/10 outline-none cursor-pointer"
          >
            {seasons.map(s => <option key={s} value={s}>S{s}</option>)}
          </select>
          <span className="text-white/50 text-sm font-medium">Episode</span>
          <select
            value={episode}
            onChange={e => setEpisode(Number(e.target.value))}
            className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-white/10 outline-none cursor-pointer"
          >
            {episodes.map(e => <option key={e} value={e}>E{e}</option>)}
          </select>
          <span className="text-white/40 text-xs ml-2">
            {info?.name} — Season {season}, Episode {episode}
          </span>
        </div>
      )}
    </div>
  );
}