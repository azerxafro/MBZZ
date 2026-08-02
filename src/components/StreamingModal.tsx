import { useEffect, useState, useRef } from 'react';
import { fetchDetails, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { X, Plus, Check, Star, Clock, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';

// ── Free streaming providers via TMDB ID ─────────────────────────────────────
const MOVIE_PROVIDERS = [
  { name: 'VidSrc',     url: (id: number) => `https://vidsrc.to/embed/movie/${id}` },
  { name: '2Embed',     url: (id: number) => `https://www.2embed.cc/embed/${id}` },
  { name: 'Embed.su',   url: (id: number) => `https://embed.su/embed/movie/${id}` },
  { name: 'VidSrc.xyz', url: (id: number) => `https://vidsrc.xyz/embed/movie?tmdb=${id}` },
  { name: 'SuperEmbed', url: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
];
const TV_PROVIDERS = [
  { name: 'VidSrc',     url: (id: number, s: number, e: number) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { name: '2Embed',     url: (id: number, s: number, e: number) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
  { name: 'Embed.su',   url: (id: number, s: number, e: number) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
  { name: 'VidSrc.xyz', url: (id: number) => `https://vidsrc.xyz/embed/tv?tmdb=${id}` },
  { name: 'SuperEmbed', url: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
];

const LOAD_TIMEOUT_MS = 12000; // 12 s before showing "try another provider"

const StreamingModal = () => {
  const { streamingItem, setStreamingItem, addToList, removeFromList, isInList } = useApp();
  const [details, setDetails]         = useState<any>(null);
  const [providerIdx, setProviderIdx] = useState(0);
  const [showProviders, setShowProviders] = useState(false);
  const [iframeLoaded, setIframeLoaded]   = useState(false);
  const [timedOut, setTimedOut]       = useState(false);
  const [season, setSeason]           = useState(1);
  const [episode, setEpisode]         = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mediaType = streamingItem?.type === 'tv' ? 'tv' : 'movie';
  const providers = mediaType === 'tv' ? TV_PROVIDERS : MOVIE_PROVIDERS;
  const current   = providers[providerIdx];
  const embedUrl  = mediaType === 'tv'
    ? (current.url as any)(streamingItem?.id, season, episode)
    : (current.url as any)(streamingItem?.id);

  // Fetch metadata (non-blocking, for info below player)
  useEffect(() => {
    if (!streamingItem) { setDetails(null); setProviderIdx(0); setSeason(1); setEpisode(1); return; }
    fetchDetails(streamingItem.type || 'movie', streamingItem.id).then(d => setDetails(d));
  }, [streamingItem]);

  // Timeout: if iframe doesn't load in N seconds, show suggestion
  useEffect(() => {
    setIframeLoaded(false);
    setTimedOut(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [providerIdx, season, episode, streamingItem?.id]);

  if (!streamingItem) return null;

  const inList = isInList(streamingItem.id);
  const genres  = details?.genres?.map((g: any) => g.name).join(' • ') || '';
  const rating  = streamingItem.vote_average?.toFixed(1);
  const year    = (streamingItem.release_date || streamingItem.first_air_date || '').split('-')[0];
  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details?.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
    : '';
  const cast     = details?.credits?.cast?.slice(0, 5).map((c: any) => c.name).join(', ') || '';
  const numSeasons = details?.number_of_seasons ?? 1;
  const seasons  = Array.from({ length: numSeasons }, (_, i) => i + 1);
  const episodeCount = details?.seasons?.[season - 1]?.episode_count ?? 24;
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  const switchProvider = (idx: number) => {
    setProviderIdx(idx);
    setShowProviders(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setStreamingItem(null)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button className="modal-close" onClick={() => setStreamingItem(null)}>
          <X size={20} />
        </button>

        {/* ── Stream Player (loads immediately) ── */}
        <div className="modal-video-wrap" style={{ position: 'relative', background: '#000' }}>

          {/* Blurred backdrop shown while loading */}
          {!iframeLoaded && streamingItem.backdrop_path && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              backgroundImage: `url(${getImageUrl(streamingItem.backdrop_path, 'original')})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(12px) brightness(0.25)',
            }} />
          )}

          {/* Loading / timeout overlay */}
          {!iframeLoaded && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              {timedOut ? (
                <>
                  <AlertCircle size={36} color="#ff002b" />
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Stream not loading</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    {current.name} may be unavailable. Try another provider.
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {providers.map((p, i) => (
                      <button
                        key={p.name}
                        onClick={() => switchProvider(i)}
                        style={{
                          padding: '8px 16px', borderRadius: 4, fontSize: 13,
                          border: i === providerIdx ? '1px solid #ff002b' : '1px solid rgba(255,255,255,0.2)',
                          background: i === providerIdx ? '#ff002b' : 'rgba(255,255,255,0.05)',
                          color: '#fff', cursor: 'pointer',
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '2px solid #ff002b', borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                    Loading via {current.name}…
                  </p>
                  <button
                    onClick={() => switchProvider((providerIdx + 1) % providers.length)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4,
                      color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={12} /> Try next provider
                  </button>
                </>
              )}
            </div>
          )}

          {/* The actual iframe — always mounted, opacity reveals when loaded */}
          <iframe
            key={`${streamingItem?.id}-${providerIdx}-${season}-${episode}`}
            src={embedUrl}
            className="modal-iframe"
            title={streamingItem.title || streamingItem.name}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="origin"
            style={{
              position: 'relative', zIndex: 3,
              opacity: iframeLoaded ? 1 : 0,
              transition: 'opacity 0.5s',
            }}
            onLoad={() => { setIframeLoaded(true); if (timerRef.current) clearTimeout(timerRef.current); }}
          />
        </div>

        {/* ── Info section ── */}
        <div className="modal-info">
          <div className="modal-actions-row" style={{ flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>

            {/* My List */}
            <button
              className="btn btn-secondary"
              onClick={() => inList ? removeFromList(streamingItem.id) : addToList(streamingItem)}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
              {inList ? 'REMOVE' : 'MY LIST'}
            </button>

            {/* Provider switcher */}
            <div style={{ position: 'relative', marginLeft: 'auto' }}>
              <button
                onClick={() => setShowProviders(p => !p)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
              >
                <ChevronDown size={13} />
                {current.name}
              </button>
              {showProviders && (
                <div style={{
                  position: 'absolute', bottom: '110%', right: 0, width: 160,
                  background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6, overflow: 'hidden', zIndex: 999,
                }}>
                  {providers.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => switchProvider(i)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '10px 14px',
                        fontSize: 13, border: 'none', cursor: 'pointer',
                        background: i === providerIdx ? '#ff002b' : 'transparent',
                        color: i === providerIdx ? '#fff' : 'rgba(255,255,255,0.6)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      {p.name}
                      {i === 0 && <span style={{ fontSize: 10, color: '#4ade80' }}>★</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TV season/episode */}
          {mediaType === 'tv' && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Season</span>
              <select value={season} onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); }}
                style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}>
                {seasons.map(s => <option key={s} value={s}>S{s}</option>)}
              </select>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Episode</span>
              <select value={episode} onChange={e => setEpisode(Number(e.target.value))}
                style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}>
                {episodes.map(ep => <option key={ep} value={ep}>E{ep}</option>)}
              </select>
            </div>
          )}

          {/* Meta */}
          <div className="modal-meta-row">
            {rating && <span className="modal-badge modal-rating"><Star size={12} fill="currentColor" /> {rating}</span>}
            {year && <span className="modal-badge">{year}</span>}
            {runtime && <span className="modal-badge"><Clock size={12} /> {runtime}</span>}
            <span className="modal-badge modal-hdr">HDR</span>
            <span className="modal-badge">4K</span>
          </div>

          {streamingItem.overview && <p className="modal-overview">{streamingItem.overview}</p>}

          <div className="modal-details-grid">
            {genres && <div className="modal-detail-row"><span className="modal-detail-label">GENRES:</span> {genres}</div>}
            {cast   && <div className="modal-detail-row"><span className="modal-detail-label">CAST:</span> {cast}</div>}
          </div>

          {details?.seasons?.length > 0 && (
            <div className="modal-seasons">
              <div className="modal-section-title">SEASONS</div>
              <div className="modal-seasons-list">
                {details.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                  <div key={s.id} className="modal-season-chip">S{s.season_number} • {s.episode_count} eps</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingModal;
