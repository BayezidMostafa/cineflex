"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Clapperboard, Heart, Loader } from "lucide-react";
import {
  toggleWatchList,
  toggleFavoriteMovie,
  getMovieStatus,
} from "@/app/actions/movieAction";

interface MovieDetailsActionsProps {
  movie: Movie;
}

const MovieDetailsActions: React.FC<MovieDetailsActionsProps> = ({ movie }) => {
  const [isInWatchList, setIsInWatchList] = useState<boolean>(false);
  const [isFavoriteMovie, setIsFavoriteMovie] = useState<boolean>(false);
  const [loadingWatchList, setLoadingWatchList] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStatus() {
      setLoadingStatus(true);
      const status = await getMovieStatus(movie.id);
      setIsInWatchList(status.isInWatchList);
      setIsFavoriteMovie(status.isFavoriteMovie);
      setLoadingStatus(false);
    }
    fetchStatus();
  }, [movie.id]);

  const handleWatchListToggle = async () => {
    setLoadingWatchList(true);
    setIsInWatchList((prev) => !prev);
    const result = await toggleWatchList(movie);
    setIsInWatchList(result.isInWatchList);
    setLoadingWatchList(false);
  };

  const handleFavoriteMovieToggle = async () => {
    setLoadingFavorite(true);
    setIsFavoriteMovie((prev) => !prev);
    const result = await toggleFavoriteMovie(movie);
    setIsFavoriteMovie(result.isFavoriteMovie);
    setLoadingFavorite(false);
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        size="icon"
        onClick={handleFavoriteMovieToggle}
        className="bg-white hover:bg-white/80"
      >
        {loadingStatus || loadingFavorite ? (
          <Loader className="animate-spin text-black" />
        ) : (
          <Heart
            fill={isFavoriteMovie ? "red" : "none"}
            stroke={isFavoriteMovie ? "red" : "black"}
          />
        )}
      </Button>
      <Button
        size="icon"
        onClick={handleWatchListToggle}
        className="bg-white hover:bg-white/80"
      >
        {loadingStatus || loadingWatchList ? (
          <Loader className="animate-spin text-black" />
        ) : (
          <Clapperboard
            fill={isInWatchList ? "red" : "none"}
            stroke={isInWatchList ? "red" : "black"}
          />
        )}
      </Button>
    </div>
  );
};

export default MovieDetailsActions;
