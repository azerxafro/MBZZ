import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/components/Hero'
import TrendingNow from '@/components/TrendingNow'
import { createServerFn } from '@tanstack/react-start'

const getMovies = createServerFn().handler(async ()=>{
  try{
    const res = await fetch('http://localhost:8080/api/trending');
  const data = await res.json();
  return data.results;
  }
  catch(err){
    throw new Error('Error fetching Movies');
    console.log(err); 
  }

})
export const Route = createFileRoute('/')({ 
  loader : async()=>{
    const movies = await getMovies();
    return { movies };
  },
  component: App
})

function App() {
  const movies = Route.useLoaderData().movies;
return (<main>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Hero />
        <div className='container mx-auto mt-6 max-w-6xl px-6'>
          <TrendingNow  movies={movies} />
        </div>
      </div>
    </main>)
}
