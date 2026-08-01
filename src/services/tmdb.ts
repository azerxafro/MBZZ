const CACHE = new Map<string, { data: any; ts: number }>();
const TTL = 5 * 60 * 1000; // 5 minutes

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

const cached = async (key: string, fetcher: () => Promise<any>) => {
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;
  const data = await fetcher();
  CACHE.set(key, { data, ts: Date.now() });
  return data;
};

export const fetchMovies = async (endpoint: string) => {
  return cached(endpoint, async () => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
      const data = await res.json();
      return data.results ?? [];
    } catch {
      return [];
    }
  });
};

export const fetchDetails = async (type: 'movie' | 'tv', id: number) => {
  const key = `details-${type}-${id}`;
  return cached(key, async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/${type}/${id}?append_to_response=videos,credits`,
        { headers }
      );
      return await res.json();
    } catch {
      return null;
    }
  });
};

export const searchMulti = async (query: string) => {
  if (!query) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false`,
      { headers }
    );
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
};

export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getYouTubeKey = (videos: any) => {
  if (!videos?.results?.length) return null;
  return (
    videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.results.find((v: any) => v.site === 'YouTube')
  )?.key ?? null;
};

/** Prefetch multiple endpoints in parallel — call on app boot */
export const prefetch = (endpoints: string[]) => {
  endpoints.forEach(ep => fetchMovies(ep));
};
