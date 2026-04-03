"use client";

import Image from "@/components/ui/image";
import { KeyFeaturesBlockProps } from "@/typings/blocks";

interface KeyFeaturesProps {
  block: KeyFeaturesBlockProps;
}

export function KeyFeatures({ block }: KeyFeaturesProps) {
  if (block.Disabled) return null;

  const {
    sectionLabel = "Key Features",
    backgroundImage,
    features = [],
    description,
    ctaLabel = "Get Started",
  } = block;

  const bgUrl = backgroundImage?.formats?.large?.url ?? backgroundImage?.url;

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden rounded-3xl mx-4 md:mx-8 my-8">
      {/* Background image */}
      {bgUrl ? (
        <Image src={bgUrl} alt="Key Features background" fill className="object-cover object-center" />
      ) : (
        <div className="absolute inset-0 bg-pineGreen" />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-pineGreen/60 via-transparent to-pineGreen/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[70vh] p-8 md:p-12 lg:p-16">
        {/* Top-left label */}
        <p className="font-dubai font-medium text-white h4">{sectionLabel}</p>

        {/* Bottom area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-auto">
          {/* Feature list — bottom left */}
          {features.length > 0 && (
            <ul className="flex flex-col gap-3 max-w-[50rem]">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="size-6 rounded-full bg-limeGreen flex-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="font-dubai text-white .p">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Description + CTA — bottom right */}
          <div className="flex flex-col gap-6 lg:max-w-[40rem]">
            {description && (
              <p className="font-dubai text-white/80 .p">{description}</p>
            )}
            <button
              type="button"
              className="self-start bg-limeGreen text-pineGreen font-dubai font-medium .p px-8 py-4 rounded-full hover:bg-limeGreen-600 transition-colors"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default KeyFeatures;
