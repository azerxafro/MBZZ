import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Suspense } from 'react'
import Header from '@/components/Header'

// ── Server function — runs on the server, uses secret env var ──
const getTrending = createServerFn().handler(async () => {
  const token = process.env.TMDB_AUTH_TOKEN
  if (!token) throw new Error('TMDB_AUTH_TOKEN not set')

  const [trending, topRated, tvPopular, upcoming] = await Promise.all([
    fetch('https://api.themoviedb.org/3/trending/all/week', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),
    fetch('https://api.themoviedb.org/3/movie/top_rated?page=1', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),
    fetch('https://api.themoviedb.org/3/tv/popular?page=1', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),
    fetch('https://api.themoviedb.org/3/movie/upcoming?page=1', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),
  ])

  return {
    trending: trending.results ?? [],
    topRated: topRated.results ?? [],
    tvPopular: tvPopular.results ?? [],
    upcoming: upcoming.results ?? [],
  }
})

export const Route = createFileRoute('/')({
  loader: async () => getTrending(),
  component: HomePage,
})

// ── Types ──
interface Movie {
  id: number
  title?: string
  name?: string
  poster_path?: string
  backdrop_path?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  media_type?: string
  overview?: string
}

// ── Movie Card ──
function MovieCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  const img = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  if (!img) return null

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-52 cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-slate-900 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl hover:shadow-black/80"
    >
      <img
        src={img}
        alt={movie.title || movie.name}
        className="h-[118px] w-full object-cover brightness-90 transition-all duration-300 group-hover:brightness-110"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
        <div>
          <p className="text-white text-xs font-bold line-clamp-1">{movie.title || movie.name}</p>
          {movie.vote_average ? (
            <p className="text-yellow-400 text-xs mt-0.5">⭐ {movie.vote_average.toFixed(1)}</p>
          ) : null}
        </div>
      </div>
      {/* N badge */}
      <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-red-600 text-white text-[8px] font-black flex items-center justify-center">N</div>
    </div>
  )
}

// ── Skeleton row ──
function SkeletonRow() {
  return (
    <div className="flex gap-3 overflow-x-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-52 h-[118px] rounded-lg bg-white/5 animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  )
}

// ── Horizontal Row ──
function Row({ title, movies }: { title: string; movies: Movie[] }) {
  const navigate = useNavigate()
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-white/90 tracking-wide">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {movies.map(m => (
          <div key={m.id} className="snap-start">
            <MovieCard
              movie={m}
              onClick={() =>
                navigate({ to: '/watch$movieId', params: { movieId: String(m.id) } })
              }
            />
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Hero Banner (dynamic) ──
function HeroBanner({ movie }: { movie: Movie }) {
  const navigate = useNavigate()
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  return (
    <div className="relative w-full h-[65vh] min-h-[420px] overflow-hidden">
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt={movie.title || movie.name}
          className="absolute inset-0 w-full h-full object-cover object-top brightness-50"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      <div className="relative z-10 flex flex-col justify-end h-full px-8 pb-10 max-w-xl">
        <p className="text-red-500 font-black text-sm uppercase tracking-widest mb-2">
          {movie.media_type === 'tv' ? 'Series' : 'Film'}
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-xl">
          {movie.title || movie.name}
        </h1>
        {movie.overview && (
          <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2">
            {movie.overview}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate({ to: '/watch$movieId', params: { movieId: String(movie.id) } })
            }
            className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-sm hover:bg-white/80 transition-colors text-sm"
          >
            ▶ Play
          </button>
          <button className="flex items-center gap-2 bg-white/20 backdrop-blur text-white font-bold px-6 py-2.5 rounded-sm hover:bg-white/30 transition-colors text-sm border border-white/20">
            + My List
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──
function HomePage() {
  const { trending, topRated, tvPopular, upcoming } = Route.useLoaderData()
  const hero = trending[Math.floor(Math.random() * Math.min(5, trending.length))]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero */}
      {hero ? <HeroBanner movie={hero} /> : <div className="h-[65vh] bg-slate-950 animate-pulse" />}

      {/* Rows */}
      <div className="px-6 py-6 -mt-8 relative z-10">
        <Suspense fallback={<><SkeletonRow /><SkeletonRow /></>}>
          <Row title="Trending Now" movies={trending} />
          <Row title="Top Rated Movies" movies={topRated} />
          <Row title="Popular TV Shows" movies={tvPopular} />
          <Row title="Upcoming Movies" movies={upcoming} />
        </Suspense>
      </div>
    </div>
  )
}
