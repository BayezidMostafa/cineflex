import { useState, useEffect, useRef } from "react";
import { Movie } from "@/lib/interfaces";
import toast from "react-hot-toast";

function getLocalStorageList(key: string): Movie[] {
  if (typeof window === "undefined") return [];
  const storedList = localStorage.getItem(key);
  return storedList ? JSON.parse(storedList) : [];
}

function setLocalStorageList(key: string, list: Movie[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function useGetMovieList(listType: "watchList" | "favoriteList") {
  const STORAGE_KEY = listType;
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedList = getLocalStorageList(STORAGE_KEY);
    setMovieList(storedList);
    setLoading(false);
  }, [STORAGE_KEY]);

  const toggleMovieInList = (movie: Movie) => {
    setMovieList((prevList) => {
      const isInList = prevList.some((item) => item.id === movie.id);
      const updatedList = isInList
        ? prevList.filter((item) => item.id !== movie.id)
        : [...prevList, movie];
      
      setLocalStorageList(STORAGE_KEY, updatedList);

      // Clear any existing toast timers to avoid duplicate toasts
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

      // Set a new timer to throttle the toast notifications
      toastTimeoutRef.current = setTimeout(() => {
        if (isInList) {
          toast.error(`${movie.title} removed from ${listType === "watchList" ? "Watchlist" : "Favorites"}`);
        } else {
          toast.success(`${movie.title} added to ${listType === "watchList" ? "Watchlist" : "Favorites"}`);
        }
      }, 200); // 200ms delay to avoid double toasts

      return updatedList;
    });
  };

  return { movieList, loading, toggleMovieInList };
}
