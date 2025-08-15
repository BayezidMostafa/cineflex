"use client";

import { Movie } from "@/lib/interfaces";
import useMovieStore from "@/store/movieStore";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/lib/hooks/useDebounce";
import Card from "@/components/Movie/Card/Card";
import Skeleton from "@/components/Movie/Card/Skeleton";
import { useUser } from "@clerk/clerk-react";
import AdvancedFilterDialog from "@/components/filter/filter";
import Image from "next/image";
import Link from "next/link";

interface SearchFormData {
  search: string;
}

const fetchMovies = async (page: number): Promise<{ results: Movie[] }> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }
  return res.json();
};

const searchMovies = async (query: string): Promise<{ results: Movie[] }> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`
  );
  if (!res.ok) {
    throw new Error("Failed to search movies");
  }
  return res.json();
};

const Home = () => {
  const initialPage = useRef(1);
  const [page, setPage] = useState(initialPage.current);
  const { movies, addMovies, resetMovies } = useMovieStore();
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["movies", page],
    queryFn: () => fetchMovies(page),
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SearchFormData>();
  const searchQuery = watch("search");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    resetMovies(); 
  }, [resetMovies]);

  useEffect(() => {
    if (data?.results) {
      addMovies(data.results);
    }
  }, [data, addMovies]);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 3) {
      searchMovies(debouncedSearchQuery).then((response) => {
        setSuggestions(response.results);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !isFetching &&
        page === initialPage.current
      ) {
        initialPage.current = page + 1;
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, page]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect(); // Clean up observer
  }, [handleObserver]);

  const onSubmit = (data: SearchFormData) => {
    router.push(`/search?query=${encodeURIComponent(data.search)}`);
  };

  const { user } = useUser();

  useEffect(() => {
    console.log("User information:", user);
  }, [user]);

  return (
    <div className="mt-5 mb-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 relative">
        <h1 className="text-xl sm:text-2xl font-bold">Popular Movies</h1>
        <div className="sm:max-w-md w-full flex items-center gap-4 ">
          <div className="relative w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <input
                {...register("search", {
                  required: "Please enter a search term",
                  minLength: {
                    value: 3,
                    message: "Search term must be at least 3 characters",
                  },
                })}
                type="text"
                placeholder="Search movies..."
                className="border p-2 rounded w-full outline-none bg-transparent"
              />
              {errors.search && (
                <p className="text-red-500 mt-1">{errors?.search?.message}</p>
              )}
            </form>
            {suggestions.length > 0 && (
              <div
                className="absolute mt-2 w-full max-h-60 overflow-y-auto z-10 border rounded bg-background shadow-md"
                role="listbox"
              >
                {suggestions.map((movie) => {
                  const year =
                    movie.release_date && movie.release_date.length >= 4
                      ? movie.release_date.slice(0, 4)
                      : "—";

                  const posterSrc = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                    : "/placeholder.png";

                  return (
                    <Link
                      href={`/movie/${movie.id}`}
                      key={movie.id}
                      role="option"
                      aria-selected="false"
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-secondary"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="shrink-0">
                        <Image
                          src={posterSrc}
                          alt={`${movie.title} poster`}
                          width={40}
                          height={56}
                          className="rounded-sm object-cover bg-muted"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="truncate font-medium leading-5">
                          {movie.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {year}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <AdvancedFilterDialog />
          </div>
        </div>
      </div>
      {error && <h2>Failed to load data</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 lg:gap-8 mt-5">
        {movies.map((m, i) => (
          <Card key={i} data={m} />
        ))}
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} />)}
      </div>

      <div ref={loaderRef} className="flex justify-center mt-5">
        {isFetching &&
          Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    </div>
  );
};

export default Home;
