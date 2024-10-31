"use client";

import React from "react";
import Card from "@/components/Movie/Card/Card";
import Skeleton from "@/components/Movie/Card/Skeleton";
import { useGetMovieList } from "@/lib/hooks/useGetMovieList";

const FavoritesPage: React.FC = () => {
  const {
    movieList: favoriteList,
    loading,
    toggleMovieInList,
  } = useGetMovieList("favoriteList");

  return (
    <div className="min-h-screen mt-5">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Movies</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 md:gap-8">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} />
            ))}
        </div>
      ) : favoriteList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 md:gap-8">
          {favoriteList.map((movie) => (
            <Card
              onToggleFavorite={() => toggleMovieInList(movie)}
              data={movie}
              key={movie.id}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-center">Your favorites list is empty.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
