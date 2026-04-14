"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type ImagePlaceholderClasses = {
  wrapper?: string;
  image?: string;
};

export interface ImagePlaceholderProps extends ImageProps {
  classNames?: ImagePlaceholderClasses;
  enableLoading?: boolean;
  loading?: "lazy" | "eager";
  unoptimized?: boolean;
  blur?: boolean;
  fetchPriority?: "high" | "low";
}

const ImagePlaceholder = ({
  classNames,
  className,
  loading,
  enableLoading = false,
  blur = true,
  unoptimized = true,
  fetchPriority,
  ...imgProps
}: ImagePlaceholderProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <div className={cn("relative size-full", classNames?.wrapper)}>
      <AnimatePresence mode="wait">
        {!loaded && blur ? (
          <motion.div
            initial={{ backdropFilter: `blur(15px)` }}
            animate={{ backdropFilter: "blur(15px)" }}
            exit={{ backdropFilter: "blur(0)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          />
        ) : null}
      </AnimatePresence>

      <Image
        {...imgProps}
        alt={imgProps?.alt}
        className={cn("select-none", className, classNames?.image)}
        onLoad={() => setLoaded(true)}
        placeholder={
          blur ? (imgProps?.blurDataURL ? "blur" : "empty") : undefined
        }
        blurDataURL={blur ? imgProps?.blurDataURL || "" : undefined}
        sizes={imgProps?.sizes ?? "100vw"}
        priority={imgProps?.priority || false}
        unoptimized={unoptimized}
        loading={loading || imgProps?.priority ? undefined : "lazy"}
        fetchPriority="high"
      />
    </div>
  );
};

export default ImagePlaceholder;
