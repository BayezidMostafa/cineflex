export interface Movie {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    genre_ids: number[];
    popularity: number;
    adult: boolean;
    backdrop_path: string;
    original_language: string;
    original_title: string;
    video: boolean;
    vote_count: number;
  }
  
  export interface IData {
    page: number;
    results: Movie[];
    total_page: number;
    total_result: number;
  }
  
  export interface MovieState {
    movies: Movie[];
    addMovies: (movies: Movie[]) => void;
  }
  