"use server";

import { Movie } from "@/lib/interfaces";

let watchList: Movie[] = [];

export async function getWatchList(): Promise<Movie[]> {
  return watchList;
}

export async function addMovieToWatchList(movie: Movie): Promise<Movie[]> {
  if (!watchList.some((m) => m.id === movie.id)) {
    watchList.push(movie);
  }
  return watchList;
}

export async function removeMovieFromWatchList(
  movieId: number
): Promise<Movie[]> {
  watchList = watchList.filter((m) => m.id !== movieId);
  return watchList;
}
