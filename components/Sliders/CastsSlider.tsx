"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Scrollbar } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/scrollbar";

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
    <div className="relative max-w-[600px]">
      <Swiper
        modules={[Autoplay, FreeMode, Scrollbar]}
        loop={false} // scrollbar works best without looping
        speed={1000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        freeMode={{
          enabled: true,
          sticky: false,
        }}
        scrollbar={{
          hide: false,
          draggable: true,
        }}
        slidesPerView={5}
        spaceBetween={10}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="casts-slider"
      >
        {cast.map((member) => (
          <SwiperSlide key={member.cast_id} className="pb-5">
            <div className="text-center">
              <Image
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                    : "/placeholder.png"
                }
                alt={member.name}
                width={100}
                height={150}
                className="rounded-lg mx-auto w-full"
              />
              <p className="mt-2 font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.character}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CastsSlider;
