import React, {useEffect, useState} from "react";

export type Movie = {
    id: number;
    title?: string | null;
    name?: string | null;
    original_title?: string | null;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
};

type Props = {
    // Optional: if provided the component will fetch trending movies itself
    apiKey?: string;
    // If apiKey is not provided, you can pass fetched movies via this prop
    movies?: Movie[];
    limit?: number;
};

const PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'><rect width='100%' height='100%' fill='%23222'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-family='Helvetica,Arial,sans-serif' font-size='24'>No Image</text></svg>";

const TrendingNow: React.FC<Props> = ({apiKey, movies: initialMovies = [], limit = 12}) => {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!apiKey) return; // nothing to fetch
        let mounted = true;
        setLoading(true);
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch trending movies");
                return res.json();
            })
            .then((data) => {
                if (!mounted) return;
                setMovies(Array.isArray(data.results) ? data.results : []);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err.message || "Error fetching movies");
            })
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, [apiKey]);

    const chooseTitle = (m: Movie) => m.title || m.name || m.original_title || "Untitled";

    return (
        <section className="my-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Trending Now</h2>
                {loading ? <span className="text-sm text-gray-500">Loading...</span> : null}
            </div>

            {error ? <div className="text-red-500 mb-4">{error}</div> : null}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {movies.slice(0, limit).map((movie) => {
                    const img = movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                        : PLACEHOLDER;
                    return (
                        <div key={movie.id} className="relative border rounded-lg overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-150">
                            <img src={img} alt={chooseTitle(movie)} className="w-full h-[360px] object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-lg font-semibold line-clamp-2">{chooseTitle(movie)}</h3>
                                {movie.vote_average ? (
                                    <div className="text-sm text-yellow-300 mt-1">⭐ {movie.vote_average.toFixed(1)}</div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TrendingNow;
