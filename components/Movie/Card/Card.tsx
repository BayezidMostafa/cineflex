import { Movie } from "@/lib/interfaces";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps {
  data: Movie;
}

const Card: React.FC<CardProps> = ({ data }) => {
  return (
    <div>
      <Link href={`/movie/${data?.id}`}>
        <div className="relative">
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
        </div>
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
