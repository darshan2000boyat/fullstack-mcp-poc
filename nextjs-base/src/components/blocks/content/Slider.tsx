"use client";
import ImageComponent from "@/components/ui/image";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper/types";
const Slider = () => {
  //   const nanoid = customAlphabet("abcdefghiklmnopqrstuvwxyz", 5);
  //   const paginationID = nanoid();
  // const { prevEl, nextEl, prevId, nextId } = useSwiperNavigation();

  const progressIndicator = useRef<HTMLDivElement | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    progressIndicator?.current?.style.setProperty(
      "width",
      `${(1 - progress) * 100}%`,
    );
  };

  return (
    <>
      <div className="mt-10 flex">
        <Swiper
          slidesPerView={1}
          watchOverflow
          // loop
          thumbs={{ swiper: thumbsSwiper }}
          pagination={{
            el: `.pagination`,
            type: "fraction",
          }}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          onAutoplayTimeLeft={onAutoplayTimeLeft} //Autoplay Progress animation
          modules={[Navigation, Pagination, Autoplay, Thumbs]}
          navigation={{ nextEl: ".right-arrow", prevEl: ".left-arrow" }}
          className="h-[60rem] w-1/2 cursor-grab"
        >
          <SwiperSlide>
            <ImageComponent
              src="https://picsum.photos/800/800"
              alt="Image"
              fill
            />
          </SwiperSlide>
          <SwiperSlide>
            <ImageComponent
              src="https://picsum.photos/801/801"
              alt="Image"
              fill
            />
          </SwiperSlide>
          <SwiperSlide>
            <ImageComponent
              src="https://picsum.photos/803/803"
              alt="Image"
              fill
            />
          </SwiperSlide>
        </Swiper>
        <Swiper
          slidesPerView={1}
          watchOverflow
          allowTouchMove={false}
          // loop
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          modules={[Thumbs, Autoplay]}
          onSwiper={setThumbsSwiper}
          className="h-[60rem] w-1/2"
        >
          <SwiperSlide>
            <h2 className="flex h-full items-center justify-center">Slide 1</h2>
          </SwiperSlide>
          <SwiperSlide>
            <h2 className="flex h-full items-center justify-center">Slide 2</h2>
          </SwiperSlide>
          <SwiperSlide>
            <h2 className="flex h-full items-center justify-center">Slide </h2>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="mt-10 w-1/2">
        <div className="flex items-center justify-between gap-10">
          <div className="flex flex-row items-center gap-8">
            <div className="left-arrow relative end-0 start-0 mt-0 flex size-20 cursor-pointer items-center justify-center rounded-full border border-black bg-transparent after:content-none">
              Prev
            </div>
            <div className="right-arrow relative end-0 start-0 mt-0 flex size-20 cursor-pointer items-center justify-center rounded-full border border-black bg-transparent after:content-none">
              Next
            </div>
          </div>
          <div className="grow space-y-6 text-end">
            <div className="pagination direction-ltr"></div>
            <div className="progress relative h-px w-full bg-black/20">
              <div
                className="absolute start-0 top-0 z-[1] block h-px w-0 bg-black"
                ref={progressIndicator}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
