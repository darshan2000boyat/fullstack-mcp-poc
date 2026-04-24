import { cn } from "@/lib/utils";
import { DivisionTabItem, DivisionsProps } from "@/typings/blocks";
import ImageComponent from "@/components/ui/image";

function TabItem({
  tab,
  size,
}: {
  tab: DivisionTabItem;
  size: "mobile" | "desktop";
}) {
  const isMobile = size === "mobile";
  return (
    <p
      className={cn(
        "relative whitespace-nowrap font-red-hat-display font-semibold leading-[1.2] text-primary-800",
        isMobile ? "text-[2rem]" : "text-[2.4rem]",
        !tab.IsActive && "opacity-20",
      )}
    >
      {tab.IsActive && (
        <span
          aria-hidden
          className={cn(
            "absolute left-0 right-0 h-px bg-primary-800",
            isMobile ? "-top-[2.1rem]" : "-top-[2.3rem]",
          )}
        />
      )}
      {tab.Label}
      {tab.IsActive && <span className="sr-only"> (current section)</span>}
    </p>
  );
}

export default function Divisions({ block }: { block: DivisionsProps }) {
  const { IndexText, Title, Description, Media, Tabs, Common } = block;

  if (Common?.HideBlock) return null;

  const tabs = Tabs ?? [];
  const activeIdx = Math.max(0, tabs.findIndex((t) => t.IsActive));
  const windowStart = Math.max(
    0,
    Math.min(activeIdx - 1, Math.max(0, tabs.length - 3)),
  );
  const mobileTabs = tabs.slice(windowStart, windowStart + 3);

  const image = Media?.Image;
  const mobileImage = Media?.MobileImage ?? Media?.Image;

  return (
    <section
      id={Common?.BlockID || undefined}
      className="overflow-hidden bg-primary-100 py-[5.2rem] lg:py-[12rem]"
    >
      <div className="flex flex-col gap-[4rem] lg:gap-[6.1rem]">
        {/* Featured area */}
        <div className="order-2 lg:order-1">
          {/* Mobile featured */}
          <div className="lg:hidden">
            {mobileImage?.url && (
              <div className="relative h-[34.2rem] w-full">
                <ImageComponent
                  src={mobileImage.url}
                  alt={mobileImage.alternativeText || Title || ""}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )}
            <div className="relative z-10 mx-[2rem] -mt-[12.2rem] flex flex-col gap-[2rem] bg-overlay-gradient px-[2rem] py-[4rem]">
              <div className="flex flex-col gap-[2rem] text-white">
                {IndexText && (
                  <p className="whitespace-nowrap font-red-hat-display font-medium text-[1.6rem] leading-[1.1]">
                    {IndexText}
                  </p>
                )}
                {Title && (
                  <p className="font-mermaid font-bold text-[2.8rem] leading-[1.1]">
                    {Title}
                  </p>
                )}
              </div>
              <div aria-hidden className="h-px w-full bg-white/40" />
              {Description && (
                <p className="font-red-hat-display text-[1.6rem] leading-[1.3] text-white/80">
                  {Description}
                </p>
              )}
            </div>
          </div>

          {/* Desktop featured */}
          <div className="relative mx-auto hidden h-[72.6rem] w-full max-w-[144rem] lg:block">
            {image?.url && (
              <div className="absolute left-0 top-0 h-[72.6rem] w-[84.9rem]">
                <ImageComponent
                  src={image.url}
                  alt={image.alternativeText || Title || ""}
                  fill
                  className="object-cover"
                  sizes="849px"
                />
              </div>
            )}
            <div className="absolute right-0 top-[18.3rem] flex h-[44.9rem] w-[79.3rem] items-start gap-[8.5rem] bg-overlay-gradient px-[6rem] py-[8rem]">
              <div className="flex w-[23.3rem] flex-col gap-[2rem] text-white">
                {IndexText && (
                  <p className="whitespace-nowrap font-red-hat-display font-medium text-[1.8rem] leading-[1.1]">
                    {IndexText}
                  </p>
                )}
                {Title && (
                  <p className="font-mermaid font-bold text-[5rem] leading-[1.2]">
                    {Title}
                  </p>
                )}
              </div>
              <div aria-hidden className="h-[29rem] w-px bg-white/40" />
              {Description && (
                <p className="w-[32.3rem] font-red-hat-display text-[1.8rem] leading-[1.2] text-white/80">
                  {Description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="order-1 lg:order-2 lg:mx-auto lg:w-full lg:max-w-[144rem] lg:px-[6rem]">
            {/* Desktop: all tabs */}
            <div className="hidden flex-col gap-[2.3rem] lg:flex">
              <div aria-hidden className="h-px w-full bg-primary-800" />
              <div className="flex items-start justify-between gap-[4rem]">
                {tabs.map((tab, i) => (
                  <TabItem key={tab.id ?? i} tab={tab} size="desktop" />
                ))}
              </div>
            </div>
            {/* Mobile: windowed prev/active/next */}
            <div className="mx-auto flex w-[33.5rem] max-w-full flex-col items-center gap-[2.1rem] lg:hidden">
              <div aria-hidden className="h-px w-full bg-primary-800" />
              <div className="flex w-full items-start justify-center gap-[4rem]">
                {mobileTabs.map((tab, i) => (
                  <TabItem
                    key={tab.id ?? `${windowStart}-${i}`}
                    tab={tab}
                    size="mobile"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
