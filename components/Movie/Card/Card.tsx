"use client";

import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/interfaces";
import { Clapperboard, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import placeholderImage from "@/public/placeholder.png";
import { useFavoriteList, useWatchList } from "@/lib/hooks/useMovieList";

interface CardProps {
  data: Movie;
  onToggleWatchList?: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
}

const Card: React.FC<CardProps> = ({
  data,
  onToggleWatchList,
  onToggleFavorite,
}) => {
  const { isInWatchList, toggleWatchList } = useWatchList(data);
  const { isFavorite, toggleFavorite } = useFavoriteList(data);

  return (
    <div>
      <div className="relative">
        <Link href={`/movie/${data?.id}`} className="">
          <Image
            src={
              data?.poster_path
                ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${data?.poster_path}`
                : placeholderImage.src
            }
            height={350}
            width={250}
            className="w-full min-h-[340px] object-cover"
            alt={data?.title || "movie-poster"}
            loading="lazy"
            placeholder="blur"
            blurDataURL={placeholderImage.src}
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
