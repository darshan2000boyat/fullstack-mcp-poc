"use client";

import Image from "@/components/ui/image";
import { WhatsNewBlockProps, WhatsNewArticle } from "@/typings/blocks";

function ArticleCard({ article }: { article: WhatsNewArticle }) {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-3xl">
      {/* Image */}
      <div className="relative h-[20rem] w-full overflow-hidden">
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title ?? "Article"} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-pineGreen/10" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6">
        {article.tag && (
          <span className="self-start bg-earlyDawn text-pineGreen .xsmall font-dubai font-medium uppercase px-3 py-1 rounded-full">
            {article.tag}
          </span>
        )}
        {article.title && (
          <p className="font-dubai font-medium text-pineGreen .large line-clamp-3">{article.title}</p>
        )}
        {article.date && (
          <p className="font-dubai text-pineGreen/50 .small">{article.date}</p>
        )}
      </div>
    </div>
  );
}

interface WhatsNewProps {
  block: WhatsNewBlockProps;
}

export function WhatsNew({ block }: WhatsNewProps) {
  if (block.Disabled) return null;

  const {
    label,
    headingLine1,
    headingLine2,
    exploreAllLabel = "Explore All",
    articles = [],
  } = block;

  return (
    <section className="bg-earlyDawn w-full py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[140rem] mx-auto flex flex-col gap-10">
        {/* Header row */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            {label && (
              <span className="font-dubai .small text-pineGreen/60 uppercase tracking-widest">{label}</span>
            )}
            <div>
              {headingLine1 && (
                <h2 className="font-dubai font-medium h2 text-pineGreen">{headingLine1}</h2>
              )}
              {headingLine2 && (
                <h2 className="font-dubai font-medium h2 text-pineGreen">{headingLine2}</h2>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {[
              { label: "Previous", d: "M15 19l-7-7 7-7" },
              { label: "Next", d: "M9 5l7 7-7 7" },
            ].map(({ label: ariaLabel, d }) => (
              <button
                key={ariaLabel}
                type="button"
                aria-label={ariaLabel}
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

        {/* Article cards */}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WhatsNew;
