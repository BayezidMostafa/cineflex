"use client";

import { useFavoriteList, useWatchList } from "@/lib/hooks/useMovieList";
import { Movie } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Clapperboard, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";

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
    "data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5Pzk3Pi0yNDABCwsLEA8QHxISHzYrJCU2MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0MjI0Mv/AABEIAJ8BPgMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xABAEAACAQIEAwUECQQIBQUAAAABAgADEQQSITEFQVEGEyJhcYGRBxQjMkJSobHB0fAHFSMzU4LhY3KCksL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgMEBP/EACMRAQEBAAMAAQUAAwEAAAAAAAAAAAECEQMhEjFBBFFxgUKB/9oADAMBAAIRAxEAPwC+U4iiigAooooAKKKKACiiigD//2Q==";

  // Pure opacity variants (no translate/scale -> no layout shift)
  const fadeVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.15 } },
  };

  return (
    <div>
      <motion.div
        className="relative group"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <Link href={`/movie/${data?.id}`} className="block overflow-hidden group">
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
              "w-full min-h-[340px] object-cover transition-all duration-300 rounded-md group-hover:scale-110",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </Link>
        <motion.div
          variants={fadeVariants}
          className="absolute top-2 right-3 flex gap-2"
        >
          <Button
            size="icon"
            onClick={() =>
              onToggleFavorite ? onToggleFavorite(data) : toggleFavorite()
            }
            className="bg-white hover:bg-white/80"
            aria-label={
              isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
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
            aria-label={
              isInWatchList ? "Remove from Watchlist" : "Add to Watchlist"
            }
          >
            <Clapperboard
              fill={isInWatchList ? "red" : "none"}
              stroke={isInWatchList ? "red" : "black"}
            />
          </Button>
        </motion.div>
        <motion.div
          variants={fadeVariants}
          className="absolute bottom-3 right-3"
        >
          <div className="bg-white backdrop-blur px-2 py-1 rounded-md">
            <p
              className={clsx("font-semibold", {
                "text-green-500": data?.vote_average > 7,
                "text-yellow-500":
                  data?.vote_average >= 5 && data?.vote_average <= 7,
                "text-red-500": data?.vote_average < 5,
              })}
            >
              {data?.vote_average.toFixed(1)}
            </p>
          </div>
        </motion.div>
      </motion.div>

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
