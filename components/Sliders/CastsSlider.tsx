"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import Image from "next/image";
export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface CastsSliderProps {
  cast: CastMember[];
}

const CastsSlider: React.FC<CastsSliderProps> = ({ cast }) => {
  return (
    <Swiper
      scrollbar={{
        hide: true,
      }}
      modules={[Scrollbar]}
      slidesPerView={5}
      spaceBetween={5}
      breakpoints={{
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 2,
        },
        // when window width is >= 768px
        768: {
          slidesPerView: 3,
        },
        // when window width is >= 1024px
        1024: {
          slidesPerView: 4,
        },
        // when window width is >= 1280px
        1280: {
          slidesPerView: 5,
        },
      }}
      className="max-w-[600px]"
    >
      {cast?.map((member) => (
        <SwiperSlide key={member?.cast_id}>
          <div className="text-center">
            <Image
              src={
                member?.profile_path
                  ? `https://image.tmdb.org/t/p/w200${member?.profile_path}`
                  : "/placeholder.png"
              }
              alt={member?.name}
              width={100}
              height={150}
              className="rounded-lg mx-auto w-full"
            />
            <p className="mt-2 font-medium">{member?.name}</p>
            <p className="text-sm text-gray-500">{member?.character}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CastsSlider;
