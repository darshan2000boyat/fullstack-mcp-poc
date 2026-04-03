"use client";

import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { UrgentAppealsBlockProps, UrgentAppealsCampaign } from "@/typings/blocks";

function AppealCard({ campaign }: { campaign: UrgentAppealsCampaign }) {
  return (
    <div className="bg-pineGreen flex flex-col rounded-3xl overflow-hidden shadow-3xl">
      {/* Image */}
      <div className="relative h-[18rem] w-full overflow-hidden rounded-t-3xl">
        {campaign.imageUrl ? (
          <Image
            src={campaign.imageUrl}
            alt={campaign.title ?? "Campaign"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-pineGreen-600" />
        )}
        {campaign.tag && (
          <span className="absolute top-4 left-4 bg-white text-pineGreen .xsmall font-dubai font-medium uppercase px-3 py-1 rounded-full">
            {campaign.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {campaign.title && (
          <p className="font-dubai font-medium text-white .large truncate">{campaign.title}</p>
        )}
        {campaign.contributors && (
          <p className="font-dubai text-white/60 .small">{campaign.contributors} contributors</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
        <div className="flex flex-col items-center gap-1">
          <p className="font-rakkas text-white .p font-bold">{campaign.raisedAmount}</p>
          <p className="font-dubai text-white/60 .xsmall">Raised</p>
        </div>
        <div className="size-12 rounded-full border border-white/20 flex-center">
          <span className="font-dubai text-white .xsmall font-bold">%</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="font-rakkas text-white .p font-bold">{campaign.goalAmount}</p>
          <p className="font-dubai text-white/60 .xsmall">Goal</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-3">
        <button
          type="button"
          aria-label="Share"
          className="size-[5.2rem] rounded-full border border-white/20 flex-center text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="flex-1 bg-limeGreen text-pineGreen font-dubai font-medium .p py-3 rounded-full hover:bg-limeGreen-600 transition-colors"
        >
          Contribute Now
        </button>
      </div>
    </div>
  );
}

interface UrgentAppealsProps {
  block: UrgentAppealsBlockProps;
}

export function UrgentAppeals({ block }: UrgentAppealsProps) {
  if (block.Disabled) return null;

  const { heading, exploreAllLabel = "Explore All", campaigns = [] } = block;

  return (
    <section className="bg-earlyDawn w-full py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[140rem] mx-auto flex flex-col gap-10">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {heading && (
            <h2 className="font-dubai font-medium h3 text-pineGreen">{heading}</h2>
          )}
          <div className="flex items-center gap-3">
            {/* Slider arrows */}
            {[
              { label: "Previous", d: "M15 19l-7-7 7-7" },
              { label: "Next", d: "M9 5l7 7-7 7" },
            ].map(({ label, d }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="size-12 rounded-full border border-pineGreen/20 flex-center text-pineGreen hover:bg-pineGreen hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d={d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
            <button
              type="button"
              className="font-dubai .small text-pineGreen border border-pineGreen/20 px-5 py-2 rounded-full hover:bg-pineGreen hover:text-white transition-colors"
            >
              {exploreAllLabel}
            </button>
          </div>
        </div>

        {/* Campaign cards */}
        {campaigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {campaigns.map((campaign, i) => (
              <AppealCard key={i} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default UrgentAppeals;
