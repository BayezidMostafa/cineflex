"use client";

import { useFavoriteList, useWatchList } from "@/lib/hooks/useMovieList";
import { Movie } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Clapperboard, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

interface CardProps {
  data: Movie;
  preload?: boolean;
  onToggleWatchList?: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
}

const Card: React.FC<CardProps> = ({
  data,
  preload = false,
  onToggleWatchList,
  onToggleFavorite,
}) => {
  const { isInWatchList, toggleWatchList } = useWatchList(data);
  const { isFavorite, toggleFavorite } = useFavoriteList(data);

  const [loaded, setLoaded] = useState(false);

  const posterUrl = `https://image.tmdb.org/t/p/w342${data?.poster_path}`;

  const staticBlurDataURL =
    "data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a" +
    "HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5Pzk3Pi0yNDABCwsLEA8QHxISHzYrJCU2MjI0MjI0MjI0" +
    "MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0Mv/AABEIAJ8BPgMBIgACEQE" +
    "DEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xABAEAACAQIEAwUECQQIBQUAAAABAg" +
    "ADEQQSITEFQVEGEyJhcYGRBxQjMkJSobHB0fAHFSMzU4LhY3KCksL/xAAYAQEBAQEBAAAAAAAAAA" +
    "AAAAAAAQIDBP/EACMRAQEBAAMAAQUAAwEAAAAAAAAAAAECEQMhEjFBBFFxgUKB/9oADAMBAAIRAx" +
    "EAPwC+U4iiigAooooAKKKKACiiigD//2Q==";

  return (
    <div>
      <div className="relative">
        <Link href={`/movie/${data?.id}`}>
          <Image
            src={posterUrl}
            height={278}
            width={185}
            alt={data?.title || "movie-poster"}
            loading={preload ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL={staticBlurDataURL}
            onLoadingComplete={() => setLoaded(true)}
            className={clsx(
              "w-full min-h-[340px] object-cover transition-opacity duration-500 rounded-md",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </Link>

        <div className="absolute bottom-3 right-3 bg-white backdrop-blur px-2 py-1 rounded-md">
          <p
            className={clsx("font-semibold", {
              "text-green-500": data?.vote_average > 7,
              "text-yellow-500": data?.vote_average >= 5 && data?.vote_average <= 7,
              "text-red-500": data?.vote_average < 5,
            })}
          >
            {data?.vote_average.toFixed(1)}
          </p>
        </div>

        <div className="absolute top-2 right-3 flex gap-2">
          <Button
            size="icon"
            onClick={() =>
              onToggleFavorite ? onToggleFavorite(data) : toggleFavorite()
            }
            className="bg-white hover:bg-white/80"
          >
            <Heart
              fill={isFavorite ? "red" : "none"}
              stroke={isFavorite ? "red" : "black"}
            />
          </Button>
          <Button
            size="icon"
            onClick={() =>
              onToggleWatchList ? onToggleWatchList(data) : toggleWatchList()
            }
            className="bg-white hover:bg-white/80"
          >
            <Clapperboard
              fill={isInWatchList ? "red" : "none"}
              stroke={isInWatchList ? "red" : "black"}
            />
          </Button>
        </div>
      </div>

      <Link href={`/movie/${data?.id}`}>
        <p className="max-w-52 font-semibold mt-2 truncate">
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
