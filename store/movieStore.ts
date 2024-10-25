import { Movie, MovieState } from "@/lib/interfaces";
import { create } from "zustand";

const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  addMovies: (movies: Movie[]) => set({ movies }),
}));

export default useMovieStore;
