"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { FootprintMapProps } from "@/typings/blocks";
import RichText from "@/components/blocks/RichText";

const COUNTRY_KEYS = [
  "iraq",
  "jordan",
  "egypt",
  "ksa",
  "kuwait",
  "bahrain",
  "qatar",
  "uae",
  "oman",
] as const;

// Layer_1 in Figma sits at x=-996, y=60 inside the 1440x900 Map frame and
// spans 3470x1130. These percentages reproduce that placement exactly so the
// base map and the country dots share the same coordinate space.
const LAYER_1_STYLE: CSSProperties = {
  left: "-69.167%",
  top: "14.667%",
  width: "240.972%",
  height: "125.556%",
  transform: "scale(2.2)",
  transformOrigin: "50.6% 31.7%",
};

const normalizeKey = (label: string) => label.trim().toLowerCase();

function CountryChip({
  label,
  isActive,
  onSelect,
}: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="max-md:shrink-0">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className={cn(
          "flex items-center justify-center whitespace-nowrap rounded-[2.2rem] px-[2.2rem] py-[1.2rem] font-red-hat-display text-[1.4rem] font-medium leading-[1.8rem] transition-colors duration-200 max-md:min-h-[4rem] max-md:px-[1.6rem] max-md:py-[0.9rem] max-md:text-[1.2rem] max-md:leading-[1.6rem]",
          isActive
            ? "bg-secondary text-white"
            : "border border-primary text-primary hover:bg-primary/5",
        )}
      >
        {label}
      </button>
    </li>
  );
}

function MapLayer({ countriesSvg }: { countriesSvg: string }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={LAYER_1_STYLE}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/footprint/base-map.svg"
          alt=""
          className="absolute inset-0 block size-full max-w-none"
        />
        <div
          className="absolute inset-0 block size-full"
          dangerouslySetInnerHTML={{ __html: countriesSvg }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-gradient-to-b from-primary-100 from-[17.832%] to-transparent max-md:h-[24rem]"
      />
    </>
  );
}

export default function FootprintMapClient({
  block,
  countriesSvg,
}: {
  block: FootprintMapProps;
  countriesSvg: string;
}) {
  const { Common, Title, Subtitle, Countries } = block || {};
  const countries = Countries ?? [];

  const initialActive = useMemo(() => {
    const fromCms = countries.find((c) => c.IsActive)?.Label;
    return normalizeKey(fromCms ?? countries[0]?.Label ?? "uae");
  }, [countries]);

  const [activeKey, setActiveKey] = useState(initialActive);

  if (Common?.HideBlock) return null;

  const activeRules = COUNTRY_KEYS.map(
    (key) =>
      `.footprint-map[data-footprint-active="${key}"] #country-${key}{fill:#BD9E6D;}`,
  ).join("");

  return (
    <section
      id={Common?.BlockID || undefined}
      data-footprint-active={activeKey}
      className="footprint-map relative overflow-hidden bg-primary-100"
    >
      <style>
        {`.footprint-map [id^="country-"]{fill:#002D73;transition:fill 300ms ease-out;}${activeRules}`}
      </style>

      <div className="relative mx-auto hidden aspect-[1440/900] w-full max-w-[144rem] overflow-hidden md:block">
        <MapLayer countriesSvg={countriesSvg} />

        <div className="relative z-10 flex flex-col items-center px-[2rem] pt-[6rem]">
          <div className="w-full max-w-[45vw] text-center">
            {Title && <h2 className="h2 text-center text-primary">{Title}</h2>}
            {Subtitle && <RichText content={Subtitle} className="mt-[1.2rem]" />}
          </div>

          {countries.length > 0 && (
            <ul className="mt-[3.8rem] flex max-w-screen justify-center gap-[1.2rem]">
              {countries.map((country, i) => {
                const key = normalizeKey(country.Label);
                return (
                  <CountryChip
                    key={country.id ?? `${country.Label}-${i}`}
                    label={country.Label}
                    isActive={key === activeKey}
                    onSelect={() => setActiveKey(key)}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="relative mx-auto min-h-screen w-full overflow-hidden md:hidden">

        <div className="relative z-10 flex flex-col items-center gap-y-6 px-[1.6rem] pt-16 pb-[2.4rem]">
          <div className="w-full text-center">
            {Title && <h2 className="h2 text-center text-primary">{Title}</h2>}
            {Subtitle && (
              <RichText
                content={Subtitle}
                className="mt-[0.8rem]"
              />
            )}
          </div>

          <div className="flex-1" />

          {countries.length > 0 && (
            <ul className="w-[calc(100%+3.2rem)] flex flex-nowrap justify-start gap-[0.8rem] overflow-x-auto px-[1.6rem] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {countries.map((country, i) => {
                const key = normalizeKey(country.Label);
                return (
                  <CountryChip
                    key={country.id ?? `${country.Label}-${i}`}
                    label={country.Label}
                    isActive={key === activeKey}
                    onSelect={() => setActiveKey(key)}
                  />
                );
              })}
            </ul>
          )}
        </div>
        <div className="absolute inset-x-0 top-96 -translate-x-16 translate-y-24 aspect-[1100/1050] overflow-hidden scale-[1.5]">
          <MapLayer countriesSvg={countriesSvg} />
        </div>
      </div>
    </section>
  );
}
