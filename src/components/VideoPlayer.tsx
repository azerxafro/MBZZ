import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronDown, Play, RefreshCw } from 'lucide-react';

// ── Streaming providers (all free embeds via TMDB ID) ───────────────────────
const PROVIDERS = {
  movie: [
    { name: 'VidSrc.pro', getUrl: (id: number) => `https://vidsrc.pro/embed/movie/${id}` },
    { name: 'VidSrc.cc',  getUrl: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}` },
    { name: 'VidSrc.me',  getUrl: (id: number) => `https://vidsrc.me/embed/movie?tmdb=${id}` },
    { name: 'Embed.su',   getUrl: (id: number) => `https://embed.su/embed/movie/${id}` },
    { name: 'AutoEmbed',  getUrl: (id: number) => `https://player.autoembed.cc/embed/movie/${id}` },
    { name: 'VidSrc.xyz', getUrl: (id: number) => `https://vidsrc.xyz/embed/movie/${id}` },
    { name: '2Embed',     getUrl: (id: number) => `https://www.2embed.cc/embed/${id}` },
    { name: 'SuperEmbed', getUrl: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  ],
  tv: [
    { name: 'VidSrc.pro', getUrl: (id: number, s: number, e: number) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` },
    { name: 'VidSrc.cc',  getUrl: (id: number, s: number, e: number) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
    { name: 'VidSrc.me',  getUrl: (id: number, s: number, e: number) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
    { name: 'Embed.su',   getUrl: (id: number, s: number, e: number) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
    { name: 'AutoEmbed',  getUrl: (id: number, s: number, e: number) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}` },
    { name: 'VidSrc.xyz', getUrl: (id: number, s: number, e: number) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` },
    { name: '2Embed',     getUrl: (id: number, s: number, e: number) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
    { name: 'SuperEmbed', getUrl: (id: number, s: number, e: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  ],
};

type Props = {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  onBack: () => void;
};

export default function VideoPlayer({ tmdbId, mediaType, onBack }: Props) {
  const [providerIdx, setProviderIdx] = useState(0);
  const [season, setSeason]   = useState(1);
  const [episode, setEpisode] = useState(1);
  const [loaded, setLoaded]   = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [info, setInfo]       = useState<any>(null);

  const providers = PROVIDERS[mediaType];
  const current   = providers[providerIdx];

  // Build embed URL
  const embedUrl = mediaType === 'tv'
    ? (current.getUrl as any)(tmdbId, season, episode)
    : (current.getUrl as any)(tmdbId);

  // Fetch movie/TV metadata client-side for backdrop + title
  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    if (!token) return;
    fetch(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => setInfo(data))
      .catch(() => {});
  }, [tmdbId, mediaType]);

  // Reset loaded flag on any change
  useEffect(() => { setLoaded(false); }, [providerIdx, season, episode]);

  // ESC to go back
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onBack]);

  const title     = info?.title || info?.name || 'Loading…';
  const backdrop  = info?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${info.backdrop_path}` : null;
  const numSeasons= info?.number_of_seasons ?? 1;
  const seasons   = Array.from({ length: numSeasons }, (_, i) => i + 1);
  const episodeCount = info?.seasons?.[season - 1]?.episode_count ?? 24;
  const episodes  = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-white font-semibold truncate text-sm">{title}</span>
          {mediaType === 'tv' && (
            <span className="text-white/40 text-xs flex-shrink-0">S{season}:E{episode}</span>
          )}
        </div>

        {/* Provider picker */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowProviders(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            <Play size={12} fill="white" />
            Server: {current.name}
            <ChevronDown size={14} />
          </button>
          {showProviders && (
            <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded shadow-2xl overflow-hidden z-50">
              {providers.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => { setProviderIdx(i); setShowProviders(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    i === providerIdx
                      ? 'bg-red-600 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.name}
                  {i === 0 && <span className="text-[10px] text-green-400">★ Fast</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Iframe player ─────────────────────────────────── */}
      <div className="relative flex-1 flex items-stretch pt-12" style={{ minHeight: 'calc(100vh - 48px)' }}>

        {/* Blurred backdrop shown while loading */}
        {backdrop && !loaded && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdrop})`, filter: 'blur(20px) brightness(0.3)', pointerEvents: 'none' }}
          />
        )}

        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
            <div className="w-14 h-14 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <p className="text-white/60 text-sm">Connecting to {current.name}…</p>
            <button
              onClick={() => setProviderIdx(i => (i + 1) % providers.length)}
              className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded bg-black/70 border border-white/20 hover:bg-white/20 text-white text-xs transition-colors"
            >
              <RefreshCw size={12} /> Try next server
            </button>
          </div>
        )}

        <iframe
          key={`${tmdbId}-${providerIdx}-${season}-${episode}`}
          src={embedUrl}
          className="w-full h-full"
          style={{
            minHeight: 'calc(100vh - 48px)',
            border: 'none',
          }}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          title={title}
        />
      </div>

      {/* ── TV: Season / Episode picker ─────────────────── */}
      {mediaType === 'tv' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-t from-black to-transparent">
          <span className="text-white/50 text-xs font-medium">Season</span>
          <select
            value={season}
            onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); }}
            className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-white/10 outline-none cursor-pointer"
          >
            {seasons.map(s => <option key={s} value={s}>S{s}</option>)}
          </select>
          <span className="text-white/50 text-xs font-medium">Episode</span>
          <select
            value={episode}
            onChange={e => setEpisode(Number(e.target.value))}
            className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-white/10 outline-none cursor-pointer"
          >
            {episodes.map(ep => <option key={ep} value={ep}>E{ep}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}