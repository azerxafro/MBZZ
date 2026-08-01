const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

export const fetchMovies = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Failed to fetch movies', error);
    return [];
  }
};

export const fetchDetails = async (type: 'movie' | 'tv', id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}?append_to_response=videos,credits`, { headers });
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch details', error);
    return null;
  }
};

export const searchMulti = async (query: string) => {
  if (!query) return [];
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false`,
      { headers }
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to search', error);
    return [];
  }
};

export const fetchGenres = async (type: 'movie' | 'tv') => {
  try {
    const response = await fetch(`${BASE_URL}/genre/${type}/list`, { headers });
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    return [];
  }
};

export const fetchByGenre = async (type: 'movie' | 'tv', genreId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/${type}?with_genres=${genreId}&sort_by=popularity.desc`,
      { headers }
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
};

export const getImageUrl = (path: string, size: string = 'original') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getYouTubeKey = (videos: any) => {
  if (!videos?.results?.length) return null;
  const trailer = videos.results.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || videos.results.find((v: any) => v.site === 'YouTube');
  return trailer?.key || null;
};
