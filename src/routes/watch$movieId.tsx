import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import VideoPlayer from '../components/VideoPlayer';

const WatchParamsSchema = z.object({
  movieId: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
    message: 'Movie ID must be a valid number',
  }),
});

// Fetch movie/TV metadata from TMDB so we can show title, backdrop, etc.
const getMediaInfo = createServerFn()
  .validator((data: { id: number; type: string }) => data)
  .handler(async ({ data }) => {
    const token = process.env.TMDB_AUTH_TOKEN;
    if (!token) throw new Error('TMDB_AUTH_TOKEN not set');

    const res = await fetch(
      `https://api.themoviedb.org/3/${data.type}/${data.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    return await res.json();
  });

export const Route = createFileRoute('/watch$movieId')({
  params: {
    parse: (params) => {
      const result = WatchParamsSchema.safeParse(params);
      if (!result.success) throw new Error('Invalid movie ID');
      return result.data;
    },
    stringify: (params) => params,
  },
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) || 'movie',
  }),
  loader: async ({ params, search }) => {
    const id = parseInt(params.movieId, 10);
    const type = (search as any).type || 'movie';
    try {
      const info = await getMediaInfo({ data: { id, type } });
      return { id, type, info };
    } catch {
      return { id, type, info: null };
    }
  },
  component: WatchComponent,
  preload: 'intent',
});

function WatchComponent() {
  const { id, type, info } = Route.useLoaderData();
  const navigate = useNavigate();
  return (
    <VideoPlayer
      tmdbId={id}
      mediaType={type as 'movie' | 'tv'}
      info={info}
      onBack={() => navigate({ to: '/' })}
    />
  );
}