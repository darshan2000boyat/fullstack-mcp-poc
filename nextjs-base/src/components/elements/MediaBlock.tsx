"use client";

import { useIsMedium } from "@/hooks/useBreakpoints";
import { cn, getStrapiMedia } from "@/lib/utils";
import { MediaProps } from "@/typings/common";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import ImageComponent from "../ui/image";

interface MediaBlockProps {
  media?: MediaProps;
  alt?: string;
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  offset?: number;
}

const MediaBlock = ({
  media,
  alt = "media",
  className = "",
  imageClassName = "",
  videoClassName = "",
  offset = 500,
}: MediaBlockProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const isMedium = useIsMedium();

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: `${offset}px`,
    threshold: 0,
    freezeOnceVisible: true,
  });

  const hasImage = media?.Image || media?.MobileImage;
  const hasVideo = media?.VideoUrl || media?.MobileVideoUrl;

  const videoSrc = !isMedium
    ? media?.MobileVideoUrl || media?.VideoUrl
    : media?.VideoUrl;

  const preloaderSrc = getStrapiMedia(hasImage, "placeholder");

  useEffect(() => {
    if (!hasVideo) return;
    const vid = videoRef.current;
    if (!vid) return;
    const markLoaded = () => setLoaded(true);
    vid.addEventListener("loadeddata", markLoaded, { once: true });
    return () => {
      vid.removeEventListener("loadeddata", markLoaded);
    };
  }, [hasVideo]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "image-video relative size-full overflow-hidden",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {!loaded && preloaderSrc ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1, backdropFilter: `blur(15px)` }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={
              preloaderSrc
                ? {
                    backgroundImage: `url(${preloaderSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
        ) : null}
      </AnimatePresence>
      {hasImage && !hasVideo && (
        <picture className={imageClassName}>
          {media?.MobileImage && (
            <source
              srcSet={getStrapiMedia(media?.MobileImage)}
              media="(max-width: 767px)"
            />
          )}
          <ImageComponent
            src={getStrapiMedia(media?.Image)}
            onLoad={() => setLoaded(true)}
            alt={alt}
            width={1440}
            height={1080}
            unoptimized={true}
            className="size-full object-cover"
          />
        </picture>
      )}

      {hasVideo && (
        <video
          ref={(node) => {
            (
              videoRef as React.MutableRefObject<HTMLVideoElement | null>
            ).current = node;
            ref(node);
          }}
          className={cn("size-full object-cover", videoClassName)}
          autoPlay={isIntersecting}
          poster={getStrapiMedia(media?.Image || media?.MobileImage)}
          controls={false}
          muted
          loop
          playsInline
          disablePictureInPicture
        >
          {isIntersecting && <source src={videoSrc} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default MediaBlock;
