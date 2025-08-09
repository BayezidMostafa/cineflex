import { fetchDiscoverMovies } from "@/lib/tmdb";
import Card from "@/components/Movie/Card/Card";
import { Movie } from "@/lib/interfaces";
import Link from "next/link";

interface DiscoverPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export const dynamic = "force-dynamic"; // allows dynamic search params

const Discover = async ({ searchParams }: DiscoverPageProps) => {
  const page = Number(searchParams.page) || 1;

  const apiFilters: Record<string, string> = {
    sort_by: "popularity.desc",
    include_adult: "false",
  };

  const keys = [
    "with_genres",
    "primary_release_year",
    "vote_average.gte",
    "with_original_language",
  ];

  keys.forEach((key) => {
    const value = searchParams[key];
    if (typeof value === "string") {
      apiFilters[key] = value;
    }
  });

  const data = await fetchDiscoverMovies(apiFilters, page);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Discover Results</h1>

      {data.results.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {data.results.map((movie: Movie) => (
            <Card key={movie.id} data={movie} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-10">
        {page > 1 && (
          <Link
            href={`/discover?${new URLSearchParams({
              ...apiFilters,
              page: String(page - 1),
            })}`}
            className="px-4 py-1.5 transition border-2 rounded-md border-primary hover:bg-primary hover:text-secondary"
          >
            Previous
          </Link>
        )}
        {page < data.total_pages && (
          <Link
            href={`/discover?${new URLSearchParams({
              ...apiFilters,
              page: String(page + 1),
            })}`}
            className="px-4 py-1.5 transition border-2 rounded-md border-primary hover:bg-primary hover:text-secondary"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export default Discover;
