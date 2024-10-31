import { useState, useEffect } from "react";
import { Movie } from "@/lib/interfaces";
import toast from "react-hot-toast";

const WATCHLIST_KEY = "watchList";
const FAVORITE_KEY = "favoriteList";

function getLocalStorageList(key: string): Movie[] {
  const storedList = localStorage.getItem(key);
  return storedList ? JSON.parse(storedList) : [];
}

function setLocalStorageList(key: string, list: Movie[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function isMovieInList(list: Movie[], movieId: number): boolean {
  return list.some((movie) => movie.id === movieId);
}

// Hook to manage watchlist state with toast notifications
export function useWatchList(movie: Movie) {
  const [isInWatchList, setIsInWatchList] = useState<boolean>(false);

  useEffect(() => {
    const watchList = getLocalStorageList(WATCHLIST_KEY);
    setIsInWatchList(isMovieInList(watchList, movie.id));
  }, [movie.id]);

  const toggleWatchList = () => {
    const watchList = getLocalStorageList(WATCHLIST_KEY);
    const newIsInWatchList = !isInWatchList;
    const updatedList = newIsInWatchList
      ? [...watchList, movie]
      : watchList.filter((m) => m.id !== movie.id);

    setLocalStorageList(WATCHLIST_KEY, updatedList);
    setIsInWatchList(newIsInWatchList);

    // Show toast notification
    if (newIsInWatchList) {
      toast.success(`${movie.title} added to Watchlist`);
    } else {
      toast.error(`${movie.title} removed from Watchlist`);
    }
  };

  return { isInWatchList, toggleWatchList };
}

// Hook to manage favorite state with toast notifications
export function useFavoriteList(movie: Movie) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const favoriteList = getLocalStorageList(FAVORITE_KEY);
    setIsFavorite(isMovieInList(favoriteList, movie.id));
  }, [movie.id]);

  const toggleFavorite = () => {
    const favoriteList = getLocalStorageList(FAVORITE_KEY);
    const newIsFavorite = !isFavorite;
    const updatedList = newIsFavorite
      ? [...favoriteList, movie]
      : favoriteList.filter((m) => m.id !== movie.id);

    setLocalStorageList(FAVORITE_KEY, updatedList);
    setIsFavorite(newIsFavorite);

    // Show toast notification
    if (newIsFavorite) {
      toast.success(`${movie.title} added to Favorites`);
    } else {
      toast.error(`${movie.title} removed from Favorites`);
    }
  };

  return { isFavorite, toggleFavorite };
}
