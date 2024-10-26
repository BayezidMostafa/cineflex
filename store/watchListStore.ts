import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { Movie } from "@/lib/interfaces";
import {
  addMovieToWatchList,
  getWatchList,
  removeMovieFromWatchList,
} from "@/app/actions/watchListActions";

interface WatchListState {
  watchList: Movie[];
  loadWatchList: () => Promise<void>;
  addToWatchList: (movie: Movie) => Promise<void>;
  removeFromWatchList: (movieId: number) => Promise<void>;
  isInWatchList: (movieId: number) => boolean;
}

const localStoragePersist: PersistStorage<WatchListState> = {
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

const useWatchListStore = create<WatchListState>()(
  persist(
    (set, get) => ({
      watchList: [],

      // Load watchList from server and sync with local storage
      loadWatchList: async () => {
        const serverWatchList = await getWatchList();
        set({ watchList: serverWatchList });
        localStorage.setItem("watchList", JSON.stringify(serverWatchList));
      },

      // Add to watchList with optimistic UI update and server sync
      addToWatchList: async (movie: Movie) => {
        const { watchList } = get();
        if (!watchList.some((m) => m.id === movie.id)) {
          const updatedWatchList = [...watchList, movie];
          set({ watchList: updatedWatchList });
          localStorage.setItem("watchList", JSON.stringify(updatedWatchList));
          await addMovieToWatchList(movie);
        }
      },

      // Remove from watchList with optimistic UI update and server sync
      removeFromWatchList: async (movieId: number) => {
        const { watchList } = get();
        const updatedWatchList = watchList.filter((m) => m.id !== movieId);
        set({ watchList: updatedWatchList });
        localStorage.setItem("watchList", JSON.stringify(updatedWatchList));
        await removeMovieFromWatchList(movieId);
      },

      // Check if movie is in watchList
      isInWatchList: (movieId: number) => {
        const { watchList } = get();
        return watchList.some((movie) => movie.id === movieId);
      },
    }),
    {
      name: "watchList",
      storage: localStoragePersist,
    }
  )
);

export default useWatchListStore;
