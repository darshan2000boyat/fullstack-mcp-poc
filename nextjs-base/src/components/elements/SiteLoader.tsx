"use client";
import { useApp } from "@/components/AppProvider";
import ImageComponent from "@/components/ui/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const SiteLoader = () => {
  const { splashStatusUpdate } = useApp();
  const introRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(introRef?.current, {
        opacity: 0,
        delay: 1.5,
        ease: "easeOutCubic",
        onComplete: () => {
          splashStatusUpdate();
          introRef?.current?.classList.add("pointer-events-none");
          document.body.classList.remove("overflow-hidden");
        },
      });
    },
    {
      scope: introRef,
    },
  );

  return (
    <section
      ref={introRef}
      className="intro_section | fixed left-0 top-0 z-[110] flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-300"
    >
      <ImageComponent
        src="/images/logo.svg"
        alt="Logo"
        width={200}
        height={200}
      />
    </section>
  );
};

export default SiteLoader;
