const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch movies", error);
    return [];
  }
};

export const getImageUrl = (path: string, size: string = 'original') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
