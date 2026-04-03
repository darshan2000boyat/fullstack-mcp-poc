"use client";

import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { HeroExploreTile, HeroSectionBlockProps, HeroStat } from "@/typings/blocks";

// ---------------------------------------------------------------------------
// StatItem
// ---------------------------------------------------------------------------

function StatItem({ value, label }: HeroStat) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-rakkas text-pineGreen leading-tight text-[6rem] md:text-[8rem]">
        {value}
      </p>
      <p className="font-dubai text-pineGreen-400 .small opacity-80">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CampaignCard
// ---------------------------------------------------------------------------

function CampaignCard({
  tag,
  title,
  contributors,
  raisedAmount,
  goalAmount,
  imageUrl,
}: {
  tag?: string;
  title?: string;
  contributors?: string;
  raisedAmount?: string;
  goalAmount?: string;
  imageUrl?: string;
}) {
  return (
    <div className="bg-pineGreen flex flex-col rounded-3xl shadow-3xl overflow-hidden w-full max-w-[53.4rem]">
      {/* Campaign image */}
      <div className="relative h-[18rem] md:h-[22.2rem] w-full overflow-hidden rounded-t-3xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title ?? "Campaign image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-pineGreen-600" />
        )}
        {tag && (
          <span className="absolute top-4 left-4 bg-white text-pineGreen .xsmall font-dubai font-medium uppercase px-3 py-1 rounded-full">
            {tag}
          </span>
        )}
      </div>

      {/* Title & contributors */}
      <div className="px-4 py-2">
        <p className="font-dubai font-medium text-white .large truncate">{title}</p>
        {contributors && (
          <p className="font-dubai text-white/60 .small">{contributors} contributors</p>
        )}
      </div>

      {/* Raised / Goal */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col items-center gap-1">
          <p className="font-rakkas text-white .p font-bold">{raisedAmount}</p>
          <p className="font-dubai text-white/60 .xsmall">Raised</p>
        </div>
        <div className="size-14 rounded-full border border-white/20 flex-center">
          <span className="font-dubai text-white .xsmall font-bold">%</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="font-rakkas text-white .p font-bold">{goalAmount}</p>
          <p className="font-dubai text-white/60 .xsmall">Goal</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          aria-label="Share campaign"
          className="size-[5.2rem] rounded-full border border-white/20 flex-center text-white shrink-0 hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="flex-1 bg-limeGreen text-pineGreen font-dubai font-medium .p py-3 rounded-full hover:bg-limeGreen-600 transition-colors"
        >
          Contribute Now
        </button>
        <button
          type="button"
          aria-label="Add to cart"
          className="size-[5.2rem] rounded-full border border-white/20 flex-center text-white shrink-0 hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ExploreTileCard
// ---------------------------------------------------------------------------

function ExploreTileCard({ tile }: { tile: HeroExploreTile }) {
  const imageUrl = tile.image?.formats?.medium?.url ?? tile.image?.url;
  const isKhaki = tile.backgroundColor === "#c8a15e" || tile.backgroundColor === "#C8A15E";
  const isSalmon = tile.backgroundColor === "#e57858" || tile.backgroundColor === "#E57858" || tile.backgroundColor === "#E57859";

  return (
    <div
      className={cn(
        "relative flex flex-col justify-end overflow-hidden rounded-3xl p-8 h-[22rem] md:h-[28rem]",
        isKhaki && "bg-deepKhaki",
        isSalmon && "bg-salmonOrange",
        !isKhaki && !isSalmon && "bg-pineGreen"
      )}
      style={!isKhaki && !isSalmon ? { backgroundColor: tile.backgroundColor } : undefined}
    >
      {imageUrl && (
        <div className="absolute bottom-0 right-0 w-1/2 h-3/4">
          <Image src={imageUrl} alt={tile.title} fill className="object-cover object-top" />
        </div>
      )}
      {tile.title && (
        <p className="font-dubai font-medium text-white h4 relative z-10">{tile.title}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroSection — main block
// ---------------------------------------------------------------------------

interface HeroSectionProps {
  block: HeroSectionBlockProps;
  className?: string;
}

export function HeroSection({ block, className }: HeroSectionProps) {
  if (block.Disabled) return null;

  const {
    stats = [],
    featuredCampaignTag,
    featuredCampaignTitle,
    featuredCampaignImage,
    featuredCampaignContributors,
    featuredCampaignRaisedAmount,
    featuredCampaignGoalAmount,
    exploreTiles = [],
  } = block;

  const campaignImageUrl =
    featuredCampaignImage?.formats?.large?.url ?? featuredCampaignImage?.url;

  return (
    <section className={cn("bg-tertiary w-full min-h-screen flex flex-col", className)}>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="sticky top-0 z-30 mx-4 mt-4 flex items-center justify-between gap-4 rounded-full border border-white/40 bg-pineGreen px-3 py-[0.5rem] backdrop-blur-[2.2rem]"
      >
        {/* User type switcher */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-[0.2rem] shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-limeGreen px-3 py-2 font-dubai font-medium .small text-pineGreen shadow-xs"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">For Individuals</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="hidden sm:block">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-3 py-2 font-dubai .small text-white/50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">For Companies</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex-center h-10 w-24 shrink-0">
          {/* TODO: replace with actual logo asset */}
          <span className="font-dubai font-medium text-white .h5">JOOD</span>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <span className="font-dubai hidden md:block .small text-white uppercase">العربيه</span>

          {[
            { label: "Search", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { label: "Cart", d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
            { label: "Profile", d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
          ].map(({ label, d }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="hidden md:flex size-10 rounded-full border border-white/20 flex-center text-white hover:bg-white/10 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d={d} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}

          {/* Quick contribution pill */}
          <div className="hidden lg:flex items-center justify-between gap-3 rounded-full bg-earlyDawn pl-4 pr-2 py-2 min-w-[22rem]">
            <div className="flex flex-col leading-tight">
              <span className="font-dubai .xsmall text-pineGreen/50">Enter amount</span>
              <span className="font-dubai .xsmall text-pineGreen">to Contribute</span>
            </div>
            <span className="font-rakkas text-pineGreen text-[2.4rem] font-bold">Ð 500</span>
            <button
              type="button"
              aria-label="Quick contribute"
              className="size-10 rounded-full bg-limeGreen flex-center text-pineGreen hover:bg-limeGreen-600 transition-colors shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8 flex-1">

        {/* Left: stats + campaign card */}
        <div className="relative flex flex-1 flex-col gap-10 overflow-hidden rounded-3xl bg-earlyDawn p-8">
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-x-16 gap-y-6">
              {stats.map((stat, i) => (
                <StatItem key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          )}
          <CampaignCard
            tag={featuredCampaignTag}
            title={featuredCampaignTitle}
            contributors={featuredCampaignContributors}
            raisedAmount={featuredCampaignRaisedAmount}
            goalAmount={featuredCampaignGoalAmount}
            imageUrl={campaignImageUrl}
          />
        </div>

        {/* Right: contribute CTA + explore tiles */}
        <div className="flex w-full flex-col gap-4 lg:w-[34rem] xl:w-[40rem] shrink-0">
          {/* Contribute CTA bar */}
          <div className="flex items-center justify-between gap-4 rounded-full bg-pineGreen pl-6 pr-2 py-3 shadow-xl">
            <div className="flex flex-col leading-tight">
              <span className="font-dubai .xsmall text-white/60 capitalize">choose amount</span>
              <span className="font-dubai .xsmall text-white">to Contribute</span>
            </div>
            <span className="font-rakkas text-white text-[4rem] leading-tight">Ð 50</span>
            <button
              type="button"
              aria-label="Contribute"
              className="size-[5.2rem] rounded-full bg-limeGreen flex-center text-pineGreen hover:bg-limeGreen-600 transition-colors shrink-0"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Explore tiles */}
          {exploreTiles.length > 0 && (
            <div className="flex flex-col gap-4">
              {exploreTiles.map((tile, i) => (
                <ExploreTileCard key={i} tile={tile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
