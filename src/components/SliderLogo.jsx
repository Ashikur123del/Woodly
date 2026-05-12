"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import logo1 from "@/assets/-1.jpeg";
import logo2 from "@/assets/-2.jpeg";
import logo3 from "@/assets/-3.jpeg";
import logo4 from "@/assets/-4.jpeg";

const SliderLogo = () => {
  const logos = [logo1, logo2, logo3, logo4, logo1, logo2, logo3, logo4];

  return (
    <section className="pt-2">
      <div className="max-w-6xl mx-auto px-4">
        <Swiper
  modules={[Autoplay]}
  spaceBetween={30}
  slidesPerView={1}   // default (mobile)
  loop={true}
  speed={4000}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
  }}
  breakpoints={{
    640: { slidesPerView: 1 }, // small device
    768: { slidesPerView: 2 }, // tablet
    1024: { slidesPerView: 1 }, // large screen
  }}
>
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              {/* fixed height container */}
              <div className="relative w-full h-30 flex items-center justify-center">
                <Image
                  src={logo}
                  alt={`Logo ${index + 1}`}
                  fill
                  className="object-center rounded-sm"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SliderLogo;