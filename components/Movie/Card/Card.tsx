import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/interfaces";
import { Clapperboard, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  getWatchlist,
} from "@/app/actions/watchlistActions";

interface CardProps {
  data: Movie;
}

const Card: React.FC<CardProps> = ({ data }) => {
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);

  // Check if the movie is already in the watchlist when the component mounts
  React.useEffect(() => {
    getWatchlist().then((watchlist) => {
      setIsInWatchlist(watchlist.some((movie) => movie.id === data.id));
    });
  }, [data.id]);

  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      await removeMovieFromWatchlist(data.id);
    } else {
      await addMovieToWatchlist(data);
    }
    // Update the state to reflect the new status
    setIsInWatchlist((prev) => !prev);
  };

  return (
    <div>
      <div className="relative">
        <Link href={`/movie/${data?.id}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${data?.poster_path}`}
            height={400}
            width={250}
            className="w-full"
            alt={data?.title || "movie-poster"}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </Link>
        <div className="absolute bottom-3 right-3 bg-white backdrop-blur px-2 py-1 rounded-md">
          <p
            className={`font-semibold ${
              data?.vote_average > 7
                ? "text-green-500"
                : data?.vote_average >= 5
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {data?.vote_average}
          </p>
        </div>
        <div className="absolute top-2 right-3 flex gap-2">
          <Button size="icon" onClick={handleWatchlistToggle}>
            <Heart />
          </Button>
          <Button size="icon" onClick={handleWatchlistToggle}>
            <Clapperboard
              fill={isInWatchlist ? "red" : "none"}
              stroke={isInWatchlist ? "red" : "black"}
            />
          </Button>
        </div>
      </div>
      <Link href={`/movie/${data?.id}`}>
        <p className="max-w-52 font-semibold mt-2">
          {data?.title || "No title found"}
        </p>
      </Link>
      <p className="text-sm text-primary/70">
        {data?.release_date
          ? new Date(data?.release_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "No date found"}
      </p>
    </div>
  );
};

export default Card;
