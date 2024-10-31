"use client";

import React from "react";
import Card from "@/components/Movie/Card/Card";
import Skeleton from "@/components/Movie/Card/Skeleton";
import { useGetMovieList } from "@/lib/hooks/useGetMovieList";

const WatchListPage: React.FC = () => {
  const {
    movieList: watchList,
    loading,
    toggleMovieInList,
  } = useGetMovieList("watchList");

  return (
    <div className="min-h-screen mt-5">
      <h1 className="text-2xl font-bold mb-4">Your Watch List</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} />
            ))}
        </div>
      ) : watchList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {watchList.map((movie) => (
            <Card
              data={movie}
              key={movie.id}
              onToggleWatchList={() => toggleMovieInList(movie)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-center">Your watch list is empty.</p>
      )}
    </div>
  );
};

export default WatchListPage;
