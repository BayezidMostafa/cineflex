import React from "react";
import Image from "next/image";
import { CastMember, MovieDetails, Movie } from "@/lib/interfaces";
import RecommendedMoviesSlider from "@/components/Sliders/RecommendedMovieSlider";
import MovieDetailsActions from "@/components/DetailsPage/MovieDetailsActions";

interface MovieDetailsProps {
  params: {
    id: string;
  };
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

async function fetchMovieCredits(id: string): Promise<CastMember[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch movie credits");
  const data = await res.json();
  return data.cast;
}

async function fetchMovieRecommendations(id: string): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch movie recommendations");
  const data = await res.json();
  return data.results;
}

const MovieDetailsPage = async ({ params }: MovieDetailsProps) => {
  const movie = await fetchMovieDetails(params.id);
  const cast = await fetchMovieCredits(params.id);
  const recommendations = await fetchMovieRecommendations(params.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full relative">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            width={500}
            height={750}
            alt={movie.title || "Movie Poster"}
            className="rounded-lg object-contain w-full"
          />
          <span className="absolute top-0 right-5">
            <MovieDetailsActions movie={movie} />
          </span>
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-2">{movie.overview}</p>
          <h3 className="text-xl font-semibold mt-3">Genres</h3>
          <p className="">
            {movie.genres.map((genre) => genre.name).join(", ")}
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

          <h3 className="text-xl font-semibold mt-4">Cast</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 mt-2">
            {cast.slice(0, 12).map((member) => (
              <div key={member.cast_id} className="text-center">
                <Image
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                      : "/placeholder.png"
                  }
                  alt={member.name}
                  width={100}
                  height={150}
                  className="rounded-lg mx-auto w-full"
                />
                <p className="mt-2 font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-10 recommended-slider">
        <h2 className="text-2xl font-semibold mb-4">Recommended Movies</h2>
        <RecommendedMoviesSlider recommendations={recommendations} />
      </div>
    </div>
  );
};

export default MovieDetailsPage;
