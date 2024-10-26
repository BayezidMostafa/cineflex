import { Movie, MovieState } from "@/lib/interfaces";
import { create } from "zustand";

const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  addMovies: (newMovies: Movie[]) =>
    set((state) => ({ movies: [...state.movies, ...newMovies] })),
  resetMovies: () => set({ movies: [] }),
}));

export default useMovieStore;
