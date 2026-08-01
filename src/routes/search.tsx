import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import MovieCard from '../components/ui/MovieCard'
import Header from '../components/Header'
import { Movie } from '../types'
import { z } from 'zod';
const QuerySchema = z.object({
    query: z.string().min(1)
});

const searchMoviesAPI = createServerFn()
.inputValidator(QuerySchema )
.handler(async ({data}) => {
console.log('searchMoviesAPI called with data:', data);

if(!data || !data.query || data.query.trim() === '') {
    console.log('Empty query, returning empty results');
    return [];
}
if(!process.env.TMDB_AUTH_TOKEN) {
    throw new Error('TMDB_AUTH_TOKEN is not defined in environment variables');
}
    const { query } = data;
    if (!query || query.trim() === '') {
        return [];
    }

    const searchQuery = query?.trim().toLowerCase();

    // console.log('Searching for movies with query:', searchQuery);

    const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(searchQuery)}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );
    if (!res.ok) {
        console.error('TMDB API error:', res.status, res.statusText);
        return [];
    }
    const searchResults = await res.json();
    return searchResults.results || [];
})

export const Route = createFileRoute('/search')({
    validateSearch: (search: Record<string, unknown>): { movie?: string } => {
        return {
            movie: typeof search.movie === 'string' ? search.movie : ''
        };
    },
    loaderDeps: ({ search: { movie } }) => ({ movie }),
    loader: async ({ deps: { movie } }) => {
        if (!movie) {
            return { results: [], searchQuery: '' };
        }
        const results = await searchMoviesAPI({ data: { query: movie } });
        return { results, searchQuery: movie };
    },
    component: SearchComponent,
})

function SearchComponent() {
    const { results, searchQuery } = Route.useLoaderData();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
            <Header />

            <div className='container relative mx-auto mt-20 px-4 md:px-6'>
                {searchQuery && (
                    <div className="mb-12">
                        <h2 className='text-white text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
                            Search Results for "{searchQuery}"
                        </h2>
                        <p className="text-white/70 text-sm mt-3 font-medium">
                            {results.length} {results.length === 1 ? 'result' : 'results'} found
                        </p>
                    </div>
                )}

                <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {searchQuery ? `${results.length} results for ${searchQuery}` : `${results.length} results`}
                </div>

                {results.length > 0 ? (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-12'>
                        {results.map((movie: Movie) => (
                            <div
                                key={movie.id}
                                className='group relative cursor-pointer'
                                onClick={() => navigate({ to: '/watch$movieId', params: { movieId: String(movie.id) } })}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate({ to: '/watch$movieId', params: { movieId: String(movie.id) } });
                                    }
                                }}
                            >
                                <div className='relative overflow-hidden rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110 bg-slate-800'>
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                            className='w-full h-72 object-cover rounded-xl'
                                        />
                                    ) : (
                                        <div className='w-full h-72 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-xl flex items-center justify-center'>
                                            <div className='text-center'>
                                                <div className='text-4xl mb-2'>🎬</div>
                                                <span className='text-white/40 text-xs'>No Poster</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end'>
                                        <div className='w-full p-4'>
                                            <p className='text-white/80 text-xs'>
                                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                            </p>
                                            {movie.vote_average && (
                                                <p className='text-yellow-400 text-sm font-semibold'>⭐ {movie.vote_average.toFixed(1)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h3 className='text-white text-sm font-bold mt-4 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200'>
                                    {movie.title}
                                </h3>
                                <p className='text-white/50 text-xs mt-2 line-clamp-1'>
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : searchQuery ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className='text-7xl mb-6'>🔍</div>
                        <p className="text-white text-2xl font-bold">No movies found</p>
                        <p className="text-white/60 text-base mt-3">Try searching with different keywords</p>
                    </div>
                ) : null}
            </div>
        </div>
    )
}