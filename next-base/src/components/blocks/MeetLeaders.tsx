"use client";

import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { MeetLeadersBlockProps, LeaderCard } from "@/typings/blocks";

const RANK_COLORS = [
  "bg-pineGreen",
  "bg-salmonOrange",
  "bg-deepKhaki",
];

function RankCard({ leader, index }: { leader: LeaderCard; index: number }) {
  const colorClass = RANK_COLORS[index % RANK_COLORS.length];
  const isLight = colorClass === "bg-deepKhaki";

  return (
    <div className={cn("flex items-center gap-4 rounded-3xl p-5 shadow-3xl", colorClass)}>
      {/* Rank */}
      <div className="flex-center size-10 rounded-full bg-white/20 shrink-0">
        <span className={cn("font-rakkas text-[2rem] leading-none", isLight ? "text-pineGreen" : "text-white")}>
          {leader.rank ?? index + 1}
        </span>
      </div>

      {/* Avatar */}
      <div className="relative size-14 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
        {leader.avatarUrl ? (
          <Image src={leader.avatarUrl} alt={leader.name ?? "Leader"} fill className="object-cover" />
        ) : (
          <div className={cn("absolute inset-0", isLight ? "bg-pineGreen/20" : "bg-white/20")} />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        {leader.name && (
          <p className={cn("font-dubai font-medium .p truncate", isLight ? "text-pineGreen" : "text-white")}>
            {leader.name}
          </p>
        )}
        {leader.location && (
          <p className={cn("font-dubai .xsmall truncate", isLight ? "text-pineGreen/60" : "text-white/60")}>
            {leader.location}
          </p>
        )}
      </div>

      {/* Amount */}
      {leader.amount && (
        <p className={cn("font-rakkas text-[2rem] leading-none shrink-0", isLight ? "text-pineGreen" : "text-white")}>
          {leader.amount}
        </p>
      )}
    </div>
  );
}

interface MeetLeadersProps {
  block: MeetLeadersBlockProps;
}

export function MeetLeaders({ block }: MeetLeadersProps) {
  if (block.Disabled) return null;

  const {
    eyebrow,
    heading,
    description,
    primaryCtaLabel = "Become a Leader",
    secondaryCtaLabel = "View All Leaders",
    leaders = [],
  } = block;

  return (
    <section className="bg-white w-full py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[140rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Left: text + CTAs */}
        <div className="flex flex-col gap-6 lg:max-w-[50rem] shrink-0">
          {eyebrow && (
            <span className="font-dubai .small text-pineGreen/60 uppercase tracking-widest">{eyebrow}</span>
          )}
          {heading && (
            <h2 className="font-dubai font-medium h2 text-pineGreen">{heading}</h2>
          )}
          {description && (
            <p className="font-dubai text-pineGreen/70 .large">{description}</p>
          )}
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="bg-pineGreen text-white font-dubai font-medium .p px-8 py-4 rounded-full hover:bg-pineGreen-600 transition-colors"
            >
              {primaryCtaLabel}
            </button>
            <button
              type="button"
              className="border border-pineGreen/20 text-pineGreen font-dubai font-medium .p px-8 py-4 rounded-full hover:bg-pineGreen hover:text-white transition-colors"
            >
              {secondaryCtaLabel}
            </button>
          </div>
        </div>

        {/* Right: stacked rank cards */}
        {leaders.length > 0 && (
          <div className="flex flex-col gap-4 w-full lg:max-w-[55rem]">
            {leaders.map((leader, i) => (
              <RankCard key={i} leader={leader} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MeetLeaders;
