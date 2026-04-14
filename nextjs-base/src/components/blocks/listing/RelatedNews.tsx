"use client";

import NewsCard from "@/components/elements/cards/News";
import { NewsDataDatum } from "@/typings/news";

// import { NewsAttributes, NewsData } from "@/typings/news";
import { Swiper, SwiperSlide } from "swiper/react";

interface NewsSliderViewProps {
  data?: any;
}

export default function RelatedNews({ data }: NewsSliderViewProps) {
  return (
    <section className="px-12">
      <h2 className="h4 mb-12">Related News</h2>

      <Swiper
        slidesPerView={4}
        watchOverflow
        allowTouchMove={false}
        spaceBetween={30}
      >
        {data?.data?.map((e: NewsDataDatum, i: number) => (
          <SwiperSlide key={i}>
            <NewsCard key={i} data={e} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
