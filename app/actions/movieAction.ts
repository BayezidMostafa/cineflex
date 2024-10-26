"use server";

import { Movie } from "@/lib/interfaces";

const watchList = new Map<number, Movie>();
const favoriteList = new Map<number, Movie>();

export async function toggleWatchList(movie: Movie) {
  const isInWatchList = watchList.has(movie.id);

  if (isInWatchList) {
    watchList.delete(movie.id);
  } else {
    watchList.set(movie.id, movie);
  }

  return { isInWatchList: !isInWatchList };
}

export async function toggleFavoriteMovie(movie: Movie) {
  const isFavoriteMovie = favoriteList.has(movie.id);

  if (isFavoriteMovie) {
    favoriteList.delete(movie.id);
  } else {
    favoriteList.set(movie.id, movie);
  }

  return { isFavoriteMovie: !isFavoriteMovie };
}

export async function getMovieStatus(movieId: number) {
  return {
    isInWatchList: watchList.has(movieId),
    isFavoriteMovie: favoriteList.has(movieId),
  };
}

export async function getWatchList() {
  return Array.from(watchList.values());
}

export async function getFavoriteList() {
  return Array.from(favoriteList.values());
}
