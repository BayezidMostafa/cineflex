// app/movies/[id]/page.tsx
import React from "react";
import Image from "next/image";
import { MovieDetails, Movie } from "@/lib/interfaces";
import { CastMember } from "@/components/Sliders/CastsSlider";
import RecommendedMoviesSlider from "@/components/Sliders/RecommendedMovieSlider";
import MovieDetailsActions from "@/components/DetailsPage/MovieDetailsActions";
import CastsSlider from "@/components/Sliders/CastsSlider";
import TrailerModal from "@/components/DetailsPage/MovieTrailerModal";

interface MovieDetailsPageProps {
  params: { id: string };
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;

// cache the HTML for 60 seconds
export const revalidate = 60;

// build your top 10 popular movies at deploy time
export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const { results } = await res.json();
  return results.slice(0, 10).map((m: Movie) => ({
    id: m.id.toString(),
  }));
}

async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

async function fetchMovieCredits(id: string): Promise<CastMember[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch movie credits");
  const data = await res.json();
  return data.cast;
}

async function fetchMovieRecommendations(id: string): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  const data = await res.json();
  return data.results;
}

async function fetchMovieVideos(
  id: string
): Promise<{ key: string; site: string; type: string }[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch videos");
  const data = await res.json();
  return data.results;
}

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const { id } = params;

  // run all 4 requests in parallel
  const [movie, cast, recommendations, videos] = await Promise.all([
    fetchMovieDetails(id),
    fetchMovieCredits(id),
    fetchMovieRecommendations(id),
    fetchMovieVideos(id),
  ]);

  // pick the first YouTube trailer
  const trailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 block lg:hidden">{movie.title}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster block — fixed 2:3 ratio, crisp, wider */}
        <div className="w-full lg:max-w-[600px] relative">
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} // high-res
              alt={movie.title}
              fill
              priority={true}
              sizes="(max-width: 1024px) 100vw, 600px" // wider target on large screens
              className="object-cover"
            />
          </div>

          {/* Actions keep original absolute position */}
          <div className="absolute top-4 right-5 flex flex-col items-end gap-2">
            <MovieDetailsActions movie={movie} />
          </div>
        </div>

        <div className="w-full">
          <p className="text-2xl sm:text-3xl font-bold mb-3 hidden lg:block">
            {movie?.original_title}
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold">Overview</h2>
          <p className="mt-2">{movie.overview}</p>

          <h3 className="text-xl font-semibold mt-3">Genres</h3>
          <p>{movie.genres.map((g) => g.name).join(", ")}</p>

          <h4 className="text-xl font-semibold mt-3">Language</h4>
          <p>
            {movie?.original_language
              ? new Intl.DisplayNames(["en"], { type: "language" }).of(
                  movie.original_language
                )
              : "Unknown"}
          </p>

          <p className="mt-4">
            <span className="font-semibold">Release Date:</span>{" "}
            {movie.release_date
              ? new Date(movie.release_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "No date found"}
          </p>

          <p className="mt-2">
            <span className="font-semibold">Rating:</span>{" "}
            <span
              className={`font-semibold ${
                movie.vote_average > 7
                  ? "text-green-500"
                  : movie.vote_average >= 5
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {movie.vote_average.toFixed(1)}
            </span>
          </p>

          <TrailerModal trailerKey={trailer?.key} />

          <h5 className="text-xl font-semibold mt-4 mb-1">Cast</h5>
          <CastsSlider cast={cast} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Movies</h2>
        <RecommendedMoviesSlider recommendations={recommendations} />
      </div>
    </div>
  );
}
