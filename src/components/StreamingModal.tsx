import { useEffect, useState } from 'react';
import { fetchDetails, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { X, Plus, Check, Play, Star, Clock, ChevronDown, RefreshCw } from 'lucide-react';

// ── Free streaming providers via TMDB ID ──────────────────────────────────
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

const StreamingModal = () => {
  const { streamingItem, setStreamingItem, addToList, removeFromList, isInList } = useApp();
  const [details, setDetails] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [providerIdx, setProviderIdx] = useState(0);
  const [showProviders, setShowProviders] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const mediaType = streamingItem?.type === 'tv' ? 'tv' : 'movie';
  const providers = mediaType === 'tv' ? TV_PROVIDERS : MOVIE_PROVIDERS;
  const currentProvider = providers[providerIdx];

  const embedUrl = mediaType === 'tv'
    ? (currentProvider.url as any)(streamingItem?.id, season, episode)
    : (currentProvider.url as any)(streamingItem?.id);

  useEffect(() => {
    if (!streamingItem) { setDetails(null); setPlaying(false); setProviderIdx(0); setSeason(1); setEpisode(1); return; }
    fetchDetails(streamingItem.type || 'movie', streamingItem.id).then(d => setDetails(d));
  }, [streamingItem]);

  // Reset iframe loaded state on provider/season/episode change
  useEffect(() => { setIframeLoaded(false); }, [providerIdx, season, episode]);

  if (!streamingItem) return null;

  const inList = isInList(streamingItem.id);
  const genres = details?.genres?.map((g: any) => g.name).join(' • ') || '';
  const rating = streamingItem.vote_average?.toFixed(1);
  const year = (streamingItem.release_date || streamingItem.first_air_date || '').split('-')[0];
  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details?.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
    : '';
  const cast = details?.credits?.cast?.slice(0, 5).map((c: any) => c.name).join(', ') || '';
  const numSeasons = details?.number_of_seasons ?? 1;
  const seasons = Array.from({ length: numSeasons }, (_, i) => i + 1);
  const episodeCount = details?.seasons?.[season - 1]?.episode_count ?? 24;
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div className="modal-overlay" onClick={() => setStreamingItem(null)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setStreamingItem(null)}>
          <X size={20} />
        </button>

        {/* ── Video / Backdrop area ── */}
        <div className="modal-video-wrap" style={{ position: 'relative' }}>
          {playing ? (
            <>
              {/* Loading spinner */}
              {!iframeLoaded && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: '#050505', zIndex: 10,
                }}>
                  {streamingItem.backdrop_path && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${getImageUrl(streamingItem.backdrop_path, 'original')})`,
                      backgroundSize: 'cover', filter: 'blur(16px) brightness(0.25)',
                    }} />
                  )}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    border: '2px solid #ff002b', borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite', position: 'relative', zIndex: 1,
                  }} />
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, position: 'relative', zIndex: 1 }}>
                    Loading via {currentProvider.name}…
                  </p>
                  <button
                    onClick={() => setProviderIdx(i => (i + 1) % providers.length)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                      background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 4,
                      color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', position: 'relative', zIndex: 1,
                    }}
                  >
                    <RefreshCw size={12} /> Try next provider
                  </button>
                </div>
              )}
              <iframe
                key={`${streamingItem.id}-${providerIdx}-${season}-${episode}`}
                src={embedUrl}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                className="modal-iframe"
                title="stream"
                allowFullScreen
                referrerPolicy="origin"
                style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
                onLoad={() => setIframeLoaded(true)}
              />
            </>
          ) : (
            <>
              <img
                src={getImageUrl(streamingItem.backdrop_path, 'original')}
                className="modal-backdrop-img"
                alt=""
              />
              <div className="modal-backdrop-overlay" />
              <div className="modal-play-center">
                <button className="modal-play-big" onClick={() => setPlaying(true)}>
                  <Play fill="black" size={30} />
                </button>
              </div>
              <div className="modal-title-overlay">
                <h1 className="modal-hero-title">{streamingItem.title || streamingItem.name}</h1>
              </div>
            </>
          )}
        </div>

        {/* ── Info section ── */}
        <div className="modal-info">
          <div className="modal-actions-row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {/* Play / Playing state */}
            <button className="btn btn-primary" onClick={() => setPlaying(true)}>
              <Play fill="black" size={16} /> {playing ? 'NOW PLAYING' : 'PLAY'}
            </button>

            {/* My List */}
            <button
              className="btn btn-secondary"
              onClick={() => inList ? removeFromList(streamingItem.id) : addToList(streamingItem)}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
              {inList ? 'REMOVE' : 'MY LIST'}
            </button>

            {/* Provider switcher — only show when playing */}
            {playing && (
              <div style={{ position: 'relative', marginLeft: 'auto' }}>
                <button
                  onClick={() => setShowProviders(p => !p)}
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Play size={11} fill="currentColor" />
                  {currentProvider.name}
                  <ChevronDown size={13} />
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
                        onClick={() => { setProviderIdx(i); setShowProviders(false); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '10px 14px',
                          fontSize: 13, border: 'none', cursor: 'pointer',
                          background: i === providerIdx ? '#ff002b' : 'transparent',
                          color: i === providerIdx ? '#fff' : 'rgba(255,255,255,0.6)',
                          display: 'flex', justifyContent: 'space-between',
                        }}
                      >
                        {p.name}
                        {i === 0 && <span style={{ fontSize: 10, color: '#4ade80' }}>★ Best</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TV season/episode selector */}
          {playing && mediaType === 'tv' && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Season</span>
              <select
                value={season}
                onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); }}
                style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}
              >
                {seasons.map(s => <option key={s} value={s}>S{s}</option>)}
              </select>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Episode</span>
              <select
                value={episode}
                onChange={e => setEpisode(Number(e.target.value))}
                style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}
              >
                {episodes.map(ep => <option key={ep} value={ep}>E{ep}</option>)}
              </select>
            </div>
          )}

          {/* Meta badges */}
          <div className="modal-meta-row">
            {rating && <span className="modal-badge modal-rating"><Star size={12} fill="currentColor" /> {rating}</span>}
            {year && <span className="modal-badge">{year}</span>}
            {runtime && <span className="modal-badge"><Clock size={12} /> {runtime}</span>}
            <span className="modal-badge modal-hdr">HDR</span>
            <span className="modal-badge">4K</span>
          </div>

          {streamingItem.overview && (
            <p className="modal-overview">{streamingItem.overview}</p>
          )}

          <div className="modal-details-grid">
            {genres && <div className="modal-detail-row"><span className="modal-detail-label">GENRES:</span> {genres}</div>}
            {cast && <div className="modal-detail-row"><span className="modal-detail-label">CAST:</span> {cast}</div>}
          </div>

          {details?.seasons?.length > 0 && (
            <div className="modal-seasons">
              <div className="modal-section-title">SEASONS</div>
              <div className="modal-seasons-list">
                {details.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                  <div key={s.id} className="modal-season-chip">
                    S{s.season_number} • {s.episode_count} eps
                  </div>
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
