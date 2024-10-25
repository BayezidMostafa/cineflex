"use client";

import { Movie } from "@/lib/interfaces";
import useMovieStore from "@/store/movieStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const fetchMovies = async (page: number): Promise<{ results: Movie[] }> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }
  return res.json();
};

const Home = () => {
  const [page, setPage] = useState(1);
  const { movies, addMovies } = useMovieStore();
  const { data, error, isLoading } = useQuery({
    queryKey: ["movies", page],
    queryFn: () => fetchMovies(page),
  });

  useEffect(() => {
    if (data?.results) {
      addMovies(data.results);
    }
  }, [data, addMovies]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching movies</div>;
  }

  return (
    <div>
      <h1>Popular Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
        {movies.map((m, i) => (
          <div key={i}>
            <Image
              src={process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL + m?.poster_path}
              height={600}
              width={250}
              className="w-full"
              alt={``}
            />
          </div>
        ))}
      </div>
      <button onClick={() => setPage((prev) => prev + 1)}>Next Page</button>
    </div>
  );
};

export default Home;
