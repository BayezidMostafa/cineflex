"use client";

import React from "react";
import Image from "next/image";
import { Movie } from "@/lib/interfaces";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

interface RecommendedMoviesSliderProps {
  recommendations: Movie[];
}

const RecommendedMoviesSlider: React.FC<RecommendedMoviesSliderProps> = ({ recommendations }) => {
  return (
    <Swiper
      modules={[Scrollbar]}
      spaceBetween={20}
      slidesPerView={2}
      scrollbar={{ draggable: true }}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
    >
      {recommendations.map((recMovie) => (
        <SwiperSlide key={recMovie.id}>
          <div className="text-center">
            <Image
              src={`https://image.tmdb.org/t/p/w200${recMovie.poster_path}`}
              alt={recMovie.title || "Recommended Movie"}
              width={150}
              height={225}
              className="rounded-lg mx-auto w-full"
            />
            <p className="mt-2 font-medium">{recMovie.title}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RecommendedMoviesSlider;
