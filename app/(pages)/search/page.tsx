"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/lib/interfaces";
import Card from "@/components/Movie/Card/Card";
import Skeleton from "@/components/Movie/Card/Skeleton";
import useDebounce from "@/lib/hooks/useDebounce";

const fetchSearchResults = async (query: string, page: number) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }
  return res.json();
};

const Search = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);

  const debouncedQuery = useDebounce(initialQuery, 500);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: ["searchResults", debouncedQuery, page],
    queryFn: () => fetchSearchResults(debouncedQuery, page),
    enabled: !!debouncedQuery,
  });

  useEffect(() => {
    if (data?.results && page === 1) {
      setMovies(data.results);
    } else if (data?.results && page > 1) {
      setMovies((prev) => [...prev, ...data.results]);
    }
  }, [data, page]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !isFetching &&
        data?.page < data?.total_pages
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, data?.page, data?.total_pages]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="mt-5 mb-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold">Search Results</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-8 mt-5">
        {movies.map((movie) => (
          <Card key={movie.id} data={movie} />
        ))}
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)}
      </div>

      <div ref={loaderRef} className="flex justify-center mt-5">
        {isFetching && <Skeleton />}
      </div>

      {error && (
        <p className="text-center text-red-500 mt-4">Failed to load results.</p>
      )}
    </div>
  );
};

export default Search;
