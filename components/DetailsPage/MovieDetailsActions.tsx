// components/DetailsPage/MovieDetailsActions.tsx
"use client";

import React from "react";
import { Movie } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Clapperboard, Heart } from "lucide-react";
import { useFavoriteList, useWatchList } from "@/lib/hooks/useMovieList";

interface MovieDetailsActionsProps {
  movie: Movie;
}

const MovieDetailsActions: React.FC<MovieDetailsActionsProps> = ({ movie }) => {
  const { isInWatchList, toggleWatchList } = useWatchList(movie);
  const { isFavorite, toggleFavorite } = useFavoriteList(movie);

  return (
    <div className="flex gap-2">
      <Button size="icon" onClick={toggleFavorite} className="bg-white hover:bg-white/80">
        <Heart fill={isFavorite ? "red" : "none"} stroke={isFavorite ? "red" : "black"} />
      </Button>
      <Button size="icon" onClick={toggleWatchList} className="bg-white hover:bg-white/80">
        <Clapperboard fill={isInWatchList ? "red" : "none"} stroke={isInWatchList ? "red" : "black"} />
      </Button>
    </div>
  );
};

export default MovieDetailsActions;
