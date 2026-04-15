"use client";

import { useEffect, useRef } from "react";
import { AboutWithStatsProps } from "@/typings/blocks";
import RichText from "@/components/blocks/RichText";
import { Link } from "@/components/ui/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const numericValue = parseFloat(value.replace(/,/g, ""));
  const hasCommas = value.includes(",");

  useEffect(() => {
    if (!ref.current || isNaN(numericValue)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericValue,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        if (!ref.current) return;
        const formatted = hasCommas
          ? Math.round(obj.val).toLocaleString()
          : Math.round(obj.val).toString();
        ref.current.textContent = formatted;
      },
    });
  }, [numericValue, hasCommas]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
};

const StatItem = ({
  number,
  label,
  large,
}: {
  number: string;
  label: string;
  large?: boolean;
}) => (
  <div
    className={`flex flex-col ${large ? "gap-[0.2rem]" : "gap-[5rem] max-md:gap-[2rem]"}`}
  >
    <AnimatedCounter
      value={number}
      className="h1-plus-1 font-red-hat-display text-primary"
    />
    <p
      className={`h6 font-red-hat-display text-primary ${large ? "pt-[4rem] max-md:pt-[2rem]" : ""}`}
    >
      {label}
    </p>
  </div>
);

const AboutWithStats = ({ block }: { block: AboutWithStatsProps }) => {
  const {
    Common,
    Eyebrow,
    Heading,
    Description,
    Link: BlockLink,
    Stats,
  } = block || {};

  if (Common?.HideBlock) return null;

  return (
    <section
      id={Common?.BlockID || undefined}
      className="relative bg-white py-[10rem] max-md:py-[6rem]"
    >
      <div className="relative mx-auto max-w-[128rem] px-[6rem] max-md:px-[2rem]">
        {/* Vertical center divider */}
        <div className="absolute bottom-0 left-1/2 top-0 w-px bg-black/10 max-md:hidden" />

        {/* Top content: two columns */}
        <div className="flex max-md:flex-col max-md:gap-[4rem] lg:items-start">
          {/* Left: Eyebrow + Heading */}
          <div className="flex w-1/2 flex-col gap-[3rem] pr-[6rem] max-md:w-full max-md:pr-0">
            {Eyebrow && (
              <p className="h6 font-red-hat-display text-primary">
                {Eyebrow}
              </p>
            )}
            {Heading && (
              <RichText
                content={Heading}
                className="section-title capitalize"
              />
            )}
          </div>

          {/* Right: Description + Link */}
          <div className="flex w-1/2 flex-col justify-between gap-[3rem] pl-[6rem] max-md:w-full max-md:pl-0">
            {Description && (
              <p className="p font-red-hat-display text-black/60">
                {Description}
              </p>
            )}
            {BlockLink?.url && (
              <Link
                href={BlockLink.url}
                target={BlockLink.type === "external" ? "_blank" : "_self"}
                className="small flex h-[5rem] w-fit items-center gap-[1rem] border border-black/10 bg-white px-[2rem] capitalize text-primary transition-colors hover:bg-primary-100"
              >
                {BlockLink.Title}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="10.5" stroke="currentColor" />
                  <path
                    d="M9 7l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Stats section */}
        {Stats && Stats.length > 0 && (
          <div className="mt-[12rem] flex flex-col gap-[12rem] max-md:mt-[6rem] max-md:gap-[6rem]">
            {Stats.length > 2 ? (
              <>
                {/* Row 1: right-aligned stats (first 2) */}
                <div className="flex justify-end max-md:justify-start">
                  <div className="flex gap-[11.9rem] max-md:grid max-md:grid-cols-2 max-md:gap-[4rem]">
                    {Stats.slice(0, 2).map((stat) => (
                      <StatItem
                        key={stat.id || stat.Label}
                        number={stat.Number}
                        label={stat.Label}
                      />
                    ))}
                  </div>
                </div>

                {/* Row 2: large stat left + remaining stats right */}
                <div className="flex items-center lg:gap-[35rem] max-md:flex-col max-md:gap-[6rem]">
                  {Stats[2] && (
                    <StatItem
                      number={Stats[2].Number}
                      label={Stats[2].Label}
                      large
                    />
                  )}
                  {Stats.length > 3 && (
                    <div className="flex gap-[18.8rem] max-md:grid max-md:grid-cols-2 max-md:gap-[4rem]">
                      {Stats.slice(3).map((stat) => (
                        <StatItem
                          key={stat.id || stat.Label}
                          number={stat.Number}
                          label={stat.Label}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Fallback: 2 or fewer stats in a single row */
              <div className="flex gap-[11.9rem] max-md:grid max-md:grid-cols-2 max-md:gap-[4rem]">
                {Stats.map((stat) => (
                  <StatItem
                    key={stat.id || stat.Label}
                    number={stat.Number}
                    label={stat.Label}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutWithStats;
