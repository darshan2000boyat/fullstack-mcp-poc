"use client";

import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { StartFundraiseBlockProps, IconBadge } from "@/typings/blocks";

const BADGE_POSITIONS = [
  "top-[10%] left-[5%]",
  "top-[10%] right-[5%]",
  "bottom-[10%] left-[5%]",
  "bottom-[10%] right-[5%]",
];

function FloatingBadge({ badge, position }: { badge: IconBadge; position: string }) {
  const isDeepKhaki = badge.backgroundColor === "#c8a15e" || badge.backgroundColor === "#C8A15E";
  const isSalmon = badge.backgroundColor === "#e57859" || badge.backgroundColor === "#E57859";
  const isLimeGreen = badge.backgroundColor === "#ddeb70" || badge.backgroundColor === "#DDEB70";

  return (
    <div
      className={cn(
        "absolute size-20 rounded-full flex-center shadow-3xl",
        position,
        isDeepKhaki && "bg-deepKhaki",
        isSalmon && "bg-salmonOrange",
        isLimeGreen && "bg-limeGreen",
        !isDeepKhaki && !isSalmon && !isLimeGreen && "bg-pineGreen"
      )}
      style={
        !isDeepKhaki && !isSalmon && !isLimeGreen && badge.backgroundColor
          ? { backgroundColor: badge.backgroundColor }
          : undefined
      }
      aria-label={badge.label}
    >
      <span className={cn("text-2xl", isLimeGreen ? "text-pineGreen" : "text-white")}>
        {badge.icon ?? "✦"}
      </span>
    </div>
  );
}

interface StartFundraiseProps {
  block: StartFundraiseBlockProps;
}

export function StartFundraise({ block }: StartFundraiseProps) {
  if (block.Disabled) return null;

  const {
    heading,
    phoneImage,
    iconBadges = [],
    ctaLabel = "Start A Fundraiser",
  } = block;

  const phoneUrl = phoneImage?.formats?.large?.url ?? phoneImage?.url;

  return (
    <section className="bg-tertiary w-full py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[100rem] mx-auto flex flex-col items-center gap-12 text-center">
        {/* Heading */}
        {heading && (
          <h2 className="font-dubai font-medium h2 text-pineGreen max-w-[70rem]">{heading}</h2>
        )}

        {/* Phone mockup with floating badges */}
        <div className="relative w-full max-w-[40rem] aspect-[9/16] md:aspect-auto md:h-[60rem]">
          {phoneUrl && (
            <Image src={phoneUrl} alt="App preview" fill className="object-contain" />
          )}
          {!phoneUrl && (
            <div className="absolute inset-0 bg-pineGreen/10 rounded-3xl" />
          )}

          {iconBadges.map((badge, i) => (
            <FloatingBadge
              key={i}
              badge={badge}
              position={BADGE_POSITIONS[i % BADGE_POSITIONS.length]}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          className="bg-pineGreen text-white font-dubai font-medium .p px-10 py-4 rounded-full hover:bg-pineGreen-600 transition-colors"
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}

export default StartFundraise;
