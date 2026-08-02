import { createFileRoute, useNavigate } from '@tanstack/react-router';
import VideoPlayer from '../components/VideoPlayer';

export const Route = createFileRoute('/watch$movieId')({
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) === 'tv' ? 'tv' as const : 'movie' as const,
  }),
  component: WatchComponent,
});

function WatchComponent() {
  const { movieId } = Route.useParams();
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const id = parseInt(movieId, 10);

  if (isNaN(id)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60 text-xl">Invalid movie ID</p>
      </div>
    );
  }

  return (
    <VideoPlayer
      tmdbId={id}
      mediaType={type}
      onBack={() => navigate({ to: '/' })}
    />
  );
}