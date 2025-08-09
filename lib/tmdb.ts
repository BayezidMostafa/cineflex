// lib/tmdb.ts

import { Movie } from "@/lib/interfaces";

export async function fetchDiscoverMovies(params: Record<string, string>, page = 1): Promise<{
  results: Movie[];
  total_pages: number;
  total_results: number;
}> {
  const query = new URLSearchParams({
    ...params,
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
    page: page.toString(),
  });

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${query.toString()}`, {
    next: { revalidate: 60 }, // ✅ cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch discover movies");
  }

  return res.json();
}
