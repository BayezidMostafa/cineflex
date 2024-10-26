"use server";

import { Movie } from "@/lib/interfaces";

let favoriteMovies: Movie[] = [];

export async function getFavoriteMovies(): Promise<Movie[]> {
  return favoriteMovies;
}

export async function addMovieToFavorites(movie: Movie): Promise<Movie[]> {
  if (!favoriteMovies.some((m) => m.id === movie.id)) {
    favoriteMovies.push(movie);
  }
  return favoriteMovies;
}

export async function removeMovieFromFavorites(
  movieId: number
): Promise<Movie[]> {
  favoriteMovies = favoriteMovies.filter((m) => m.id !== movieId);
  return favoriteMovies;
}
