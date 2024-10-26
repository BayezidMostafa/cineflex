// store/favoriteMoviesStore.ts
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { Movie } from "@/lib/interfaces";
import {
  addMovieToFavorites,
  getFavoriteMovies,
  removeMovieFromFavorites,
} from "@/app/actions/favoriteMoviesActions";

interface FavoriteMoviesState {
  favoriteMovies: Movie[];
  loadFavorites: () => Promise<void>;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

const localStoragePersist: PersistStorage<FavoriteMoviesState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const useFavoriteMoviesStore = create<FavoriteMoviesState>()(
  persist(
    (set, get) => ({
      favoriteMovies: [],

      // Load favorites from server and sync with local storage
      loadFavorites: async () => {
        const serverFavorites = await getFavoriteMovies();
        set({ favoriteMovies: serverFavorites });
        localStorage.setItem("favoriteMovies", JSON.stringify(serverFavorites));
      },

      // Add to favorites with optimistic UI update and server sync
      addToFavorites: async (movie: Movie) => {
        const { favoriteMovies } = get();
        if (!favoriteMovies.some((m) => m.id === movie.id)) {
          const updatedFavoriteMovies = [...favoriteMovies, movie];
          set({ favoriteMovies: updatedFavoriteMovies });
          localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavoriteMovies));
          await addMovieToFavorites(movie);
        }
      },

      // Remove from favorites with optimistic UI update and server sync
      removeFromFavorites: async (movieId: number) => {
        const { favoriteMovies } = get();
        const updatedFavoriteMovies = favoriteMovies.filter((m) => m.id !== movieId);
        set({ favoriteMovies: updatedFavoriteMovies });
        localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavoriteMovies));
        await removeMovieFromFavorites(movieId);
      },

      // Check if movie is in favorites
      isFavorite: (movieId: number) => {
        const { favoriteMovies } = get();
        return favoriteMovies.some((movie) => movie.id === movieId);
      },
    }),
    {
      name: "favoriteMovies",
      storage: localStoragePersist,
    }
  )
);

export default useFavoriteMoviesStore;
