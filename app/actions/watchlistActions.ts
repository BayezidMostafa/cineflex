// app/actions/watchlistActions.ts
"use server";

import { Movie } from "@/lib/interfaces";

// Mock in-memory watchlist data for demonstration
const mockWatchlist: Movie[] = [];

// Add movie to watchlist
export async function addMovieToWatchlist(movie: Movie) {
    console.log(movie)
  // Check if the movie is already in the watchlist to avoid duplicates
  if (!mockWatchlist.some((m) => m.id === movie.id)) {
    mockWatchlist.push(movie);
  }
  return mockWatchlist;
}

// Remove movie from watchlist
export async function removeMovieFromWatchlist(movieId: number) {
  const index = mockWatchlist.findIndex((m) => m.id === movieId);
  if (index !== -1) {
    mockWatchlist.splice(index, 1);
  }
  return mockWatchlist;
}

// Fetch current watchlist
export async function getWatchlist() {
  return mockWatchlist;
}
