import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/interfaces";
import { Clapperboard, Heart, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  toggleWatchList,
  toggleFavoriteMovie,
  getMovieStatus,
} from "@/app/actions/movieAction";

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
  const [isInWatchList, setIsInWatchList] = useState<boolean>(false);
  const [isFavoriteMovie, setIsFavoriteMovie] = useState<boolean>(false);
  const [loadingWatchList, setLoadingWatchList] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true); // Initial loading state

  useEffect(() => {
    let isMounted = true;
    async function fetchStatus() {
      setLoadingStatus(true);
      const status = await getMovieStatus(data.id);
      if (isMounted) {
        setIsInWatchList(status.isInWatchList);
        setIsFavoriteMovie(status.isFavoriteMovie);
        setLoadingStatus(false); // Disable initial loading
      }
    }
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [data.id]);

  const handleWatchListToggle = async () => {
    setLoadingWatchList(true);
    setIsInWatchList((prev) => !prev);
    const result = await toggleWatchList(data);
    setIsInWatchList(result.isInWatchList);
    setLoadingWatchList(false);
  };

  const handleFavoriteMovieToggle = async () => {
    setLoadingFavorite(true);
    setIsFavoriteMovie((prev) => !prev);
    const result = await toggleFavoriteMovie(data);
    setIsFavoriteMovie(result.isFavoriteMovie);
    setLoadingFavorite(false);
  };

  return (
    <div>
      <div className="relative">
        <Link href={`/movie/${data.id}`} className="">
          <Image
            src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${data.poster_path}`}
            height={350}
            width={250}
            className="w-full min-h-[340px] object-cover"
            alt={data.title || "movie-poster"}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </Link>
        <div className="absolute bottom-3 right-3 bg-white backdrop-blur px-2 py-1 rounded-md">
          <p
            className={`font-semibold ${
              data.vote_average > 7
                ? "text-green-500"
                : data.vote_average >= 5
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {data.vote_average.toFixed(1)}
          </p>
        </div>
        <div className="absolute top-2 right-3 flex gap-2">
          <Button
            size="icon"
            onClick={() =>
              onToggleFavorite
                ? onToggleFavorite(data)
                : handleFavoriteMovieToggle()
            }
            className="bg-white"
          >
            {loadingStatus || loadingFavorite ? (
              <Loader className="animate-spin" />
            ) : (
              <Heart
                fill={isFavoriteMovie ? "red" : "none"}
                stroke={isFavoriteMovie ? "red" : "black"}
              />
            )}
          </Button>
          <Button
            size="icon"
            onClick={() =>
              onToggleWatchList
                ? onToggleWatchList(data)
                : handleWatchListToggle()
            }
            className="bg-white"
          >
            {loadingStatus || loadingWatchList ? (
              <Loader className="animate-spin" />
            ) : (
              <Clapperboard
                fill={isInWatchList ? "red" : "none"}
                stroke={isInWatchList ? "red" : "black"}
              />
            )}
          </Button>
        </div>
      </div>
      <Link href={`/movie/${data.id}`}>
        <p className="max-w-52 font-semibold mt-2">
          {data.title || "No title found"}
        </p>
      </Link>
      <p className="text-sm text-primary/70">
        {data.release_date
          ? new Date(data.release_date).toLocaleDateString("en-US", {
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
