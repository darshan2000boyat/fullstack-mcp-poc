"use client";
import ImageComponent from "@/components/ui/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxProps {
  img?: string;
  alt?: string;
  className?: string;
  percent?: number;
  overflow?: boolean;
  scaleValue?: number | null;
  children?: React.ReactNode;
}

const Parallax = ({
  img,
  alt,
  className,
  percent = 10,
  overflow = false,
  scaleValue = null,
  children,
}: ParallaxProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const transformPercent = `${percent}%`;
  const negativeTransformPercent = `${percent * -1}%`;
  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [transformPercent, negativeTransformPercent],
  );

  return (
    <div
      className={`relative ${
        !overflow ? `overflow-hidden` : null
      } ${className}`}
      ref={ref}
    >
      <motion.div
        className="size-full"
        style={{
          translateY: translateY,
          scale: overflow ? 1 : scaleValue ? String(scaleValue) : 1.2, //Set scale only if overflow is true, default is 1.2
        }}
      >
        {img ? (
          <ImageComponent src={img} alt={alt ? alt : "Alt text"} fill />
        ) : null}
        {children}
      </motion.div>
    </div>
  );
};

export default Parallax;
