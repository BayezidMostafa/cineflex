"use client";

import React, { useEffect, useState } from "react";
import {
  getFavoriteList,
  toggleFavoriteMovie,
} from "@/app/actions/movieAction";
import { Movie } from "@/lib/interfaces";
import Card from "@/components/Movie/Card/Card";
import Skeleton from "@/components/Movie/Card/Skeleton";

const FavoritesPage: React.FC = () => {
  const [favoriteList, setFavoriteList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteList() {
      setLoading(true);
      const data = await getFavoriteList();
      setFavoriteList(data);
      setLoading(false);
    }
    fetchFavoriteList();
  }, []);

  const handleToggleFavoriteMovie = async (movie: Movie) => {
    setFavoriteList((prevList) => {
      const isFavorite = prevList.some((fav) => fav.id === movie.id);
      if (isFavorite) {
        return prevList.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prevList, movie];
      }
    });

    await toggleFavoriteMovie(movie);
    const updatedList = await getFavoriteList();
    setFavoriteList(updatedList);
  };

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
              onToggleFavorite={handleToggleFavoriteMovie}
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
