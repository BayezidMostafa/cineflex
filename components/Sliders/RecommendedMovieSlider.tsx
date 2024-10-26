"use client";

import React from "react";
import { Movie } from "@/lib/interfaces";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import Card from "../Movie/Card/Card";

interface RecommendedMoviesSliderProps {
  recommendations: Movie[];
}

const RecommendedMoviesSlider: React.FC<RecommendedMoviesSliderProps> = ({
  recommendations,
}) => {
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
      className=""
    >
      {recommendations.map((recMovie) => (
        <SwiperSlide key={recMovie.id} className="pb-8">
          <Card data={recMovie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RecommendedMoviesSlider;
