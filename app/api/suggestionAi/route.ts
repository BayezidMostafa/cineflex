import { NextResponse } from "next/server";
import axios from "axios";
import { Movie } from "@/lib/interfaces";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "TMDB API KEY";
const OPENAI_API_KEY = "your_openai_api_key";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre");
  const country = searchParams.get("country");

  if (!genre || !country) {
    return NextResponse.json(
      { error: "Genre and country are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch movies from TMDb
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genre,
          region: country,
          sort_by: "popularity.desc",
        },
      }
    );

    const movies = tmdbResponse.data.results;

    // Create a prompt for OpenAI
    const movieTitles = movies.map((movie: Movie) => movie.title).join(", ");
    const prompt = `
      I have the following movies: ${movieTitles}.
      Based on the genre (${genre}) and country (${country}), suggest the top 3 movies to watch with a brief explanation why they are the best.
    `;

    // Fetch suggestions from OpenAI
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const suggestions = openaiResponse.data.choices[0].text.trim();

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch movie suggestions" },
      { status: 500 }
    );
  }
}
