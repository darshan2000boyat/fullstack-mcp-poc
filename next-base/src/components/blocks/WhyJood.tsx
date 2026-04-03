"use client";

import { cn } from "@/lib/utils";
import { WhyJoodBlockProps, WhyJoodCategory } from "@/typings/blocks";

function CategoryCard({ category }: { category: WhyJoodCategory }) {
  const bg = category.backgroundColor;
  const isDeepKhaki = bg === "#c8a15e" || bg === "#C8A15E";
  const isSalmon = bg === "#e57859" || bg === "#E57859" || bg === "#E57858";
  const isLimeGreen = bg === "#ddeb70" || bg === "#DDEB70";
  const isPineGreen = bg === "#234840" || bg === "#234840";

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-3xl p-6 min-h-[22rem]",
        isDeepKhaki && "bg-deepKhaki",
        isSalmon && "bg-salmonOrange",
        isLimeGreen && "bg-limeGreen",
        isPineGreen && "bg-pineGreen",
        !isDeepKhaki && !isSalmon && !isLimeGreen && !isPineGreen && "bg-pineGreen"
      )}
      style={
        !isDeepKhaki && !isSalmon && !isLimeGreen && !isPineGreen && bg
          ? { backgroundColor: bg }
          : undefined
      }
    >
      {/* Icon placeholder */}
      <div className="size-12 rounded-full bg-white/20 flex-center">
        <span className="text-white text-xl">{category.icon ?? "✦"}</span>
      </div>

      <div className="flex flex-col gap-3">
        <p
          className={cn(
            "font-dubai font-medium h5",
            isLimeGreen ? "text-pineGreen" : "text-white"
          )}
        >
          {category.label}
        </p>

        {/* Progress bar */}
        {typeof category.progress === "number" && (
          <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                isLimeGreen ? "bg-pineGreen" : "bg-limeGreen"
              )}
              style={{ width: `${category.progress}%` }}
            />
          </div>
        )}

        {category.raisedAmount && (
          <p
            className={cn(
              "font-rakkas text-[2.8rem] leading-none",
              isLimeGreen ? "text-pineGreen" : "text-white"
            )}
          >
            {category.raisedAmount}
          </p>
        )}
      </div>
    </div>
  );
}

interface WhyJoodProps {
  block: WhyJoodBlockProps;
}

export function WhyJood({ block }: WhyJoodProps) {
  if (block.Disabled) return null;

  const { eyebrow, heading, categories = [] } = block;

  return (
    <section className="bg-tertiary w-full py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[140rem] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          {eyebrow && (
            <span className="font-dubai .small text-pineGreen/60 uppercase tracking-widest">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="font-dubai font-medium h2 text-pineGreen max-w-[60rem]">
              {heading}
            </h2>
          )}
        </div>

        {/* Category cards grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard key={i} category={cat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WhyJood;
