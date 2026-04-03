"use client";
import React, { ReactNode, useRef } from "react";
import { useInView, motion } from "framer-motion";

const FadeUp = ({ children, ...props }: { children: ReactNode }) => {
  const body = useRef(null);
  const isInView = useInView(body, { once: true, margin: "-25%" });
  const animation = {
    initial: { opacity: 0, y: 20 },
    enter: () => ({
      y: "0",
      opacity: 1,
      transition: { ease: "easeOut", duration: 1 },
      // transition: {
      //   duration: 0.75,
      //   ease: [0.33, 1, 0.68, 1],
      //   delay: 0.075 * i,
      // },
    }),
  };
  return (
    <motion.div
      variants={animation}
      initial="initial"
      animate={isInView ? "enter" : ""}
      ref={body}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
