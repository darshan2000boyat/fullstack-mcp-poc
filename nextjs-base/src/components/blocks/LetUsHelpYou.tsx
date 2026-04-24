"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/components/ui/link";
import ImageComponent from "@/components/ui/image";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn, getStrapiMedia } from "@/lib/utils";
import type {
  LetUsHelpYouProps,
  VisitOption,
  VisitSelector,
} from "@/typings/blocks";

type SelectorKey = "group" | "duration" | "date";

const VARIANT_STYLES = {
  primary: {
    text: "text-lightBlue",
    bg: "bg-lightBlue",
    chevron: "text-white",
  },
  accent: {
    text: "text-golden",
    bg: "bg-golden",
    chevron: "text-white",
  },
} as const;

function SelectorInline({
  selector,
  value,
  open,
  onToggle,
  onSelect,
}: {
  selector: VisitSelector;
  value: VisitOption | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (opt: VisitOption) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  useClickOutside([panelRef, triggerRef, chevronRef], () => {
    if (open) onToggle();
  });

  const variant = VARIANT_STYLES[selector.Variant] ?? VARIANT_STYLES.primary;
  const label = value?.Label ?? selector.Placeholder ?? "";
  const borderColor =
    selector.Variant === "accent" ? "border-golden" : "border-lightBlue";

  return (
    <span className="relative inline-flex items-center gap-[1rem] align-baseline">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        className={cn(
          "underline underline-offset-[0.6rem] decoration-[0.3rem] transition-opacity",
          variant.text,
          open ? "opacity-80" : "hover:opacity-80",
        )}
      >
        {label}
      </button>
      <button
        ref={chevronRef}
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${selector.Placeholder || label}`}
        className={cn(
          "flex h-[5rem] w-[5rem] shrink-0 items-center justify-center rounded-full transition-transform",
          variant.bg,
          variant.chevron,
          open && "rotate-180",
        )}
      >
        <ChevronDown className="h-[2rem] w-[2rem]" strokeWidth={2.5} />
      </button>
      {open && selector.Options?.length > 0 && (
        <div
          ref={panelRef}
          className={cn(
            "absolute left-0 top-full z-2 mt-[1.6rem] w-[42rem] max-w-[90vw] overflow-hidden rounded-[2.8rem] border-[3px] bg-darkGreen shadow-[0_0.6rem_0.9rem_-0.18rem_rgba(0,0,0,0.1),0_0.24rem_0.36rem_-0.24rem_rgba(0,0,0,0.1)]",
            borderColor,
          )}
          role="listbox"
        >
          {selector.Options.map((opt, i) => {
            const isActive = opt.id != null ? opt.id === value?.id : i === 0;
            return (
              <button
                key={opt.id ?? i}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => onSelect(opt)}
                className={cn(
                  "block w-full px-[2.3rem] py-[1.7rem] text-left text-[2.6rem] font-bold leading-[1.2] text-golden transition-colors hover:bg-[#007b85]",
                  isActive && "bg-[#007b85]",
                )}
              >
                {opt.Label}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

export default function LetUsHelpYou({ block }: { block: LetUsHelpYouProps }) {
  const {
    Common,
    Eyebrow,
    HeadingPrefix,
    Connector1,
    Connector2,
    GroupSelector,
    DurationSelector,
    DateSelector,
    CTA,
    BackgroundImage,
    DecorativeImage,
  } = block || {};

  const selectors = useMemo(
    () =>
      ({
        group: GroupSelector,
        duration: DurationSelector,
        date: DateSelector,
      }) as Record<SelectorKey, VisitSelector>,
    [GroupSelector, DurationSelector, DateSelector],
  );

  const [openKey, setOpenKey] = useState<SelectorKey | null>(null);
  const [values, setValues] = useState<Record<SelectorKey, VisitOption | null>>(
    () => ({
      group: GroupSelector?.Options?.[0] ?? null,
      duration: DurationSelector?.Options?.[0] ?? null,
      date: DateSelector?.Options?.[0] ?? null,
    }),
  );

  if (Common?.HideBlock) return null;

  const bg = BackgroundImage?.Image;
  const decorative = DecorativeImage?.Image;
  const bgSrc = bg?.url ? getStrapiMedia(bg) : null;
  const decorativeSrc = decorative?.url ? getStrapiMedia(decorative) : null;

  const handleSelect = (key: SelectorKey, opt: VisitOption) => {
    setValues((prev) => ({ ...prev, [key]: opt }));
    setOpenKey(null);
  };

  const toggle = (key: SelectorKey) =>
    setOpenKey((prev) => (prev === key ? null : key));

  const ctaHref = CTA?.url
    ? (() => {
        try {
          const url = new URL(
            CTA.url,
            typeof window !== "undefined"
              ? window.location.origin
              : "http://localhost",
          );
          if (values.group?.Value ?? values.group?.Label)
            url.searchParams.set(
              "group",
              values.group?.Value ?? values.group?.Label ?? "",
            );
          if (values.duration?.Value ?? values.duration?.Label)
            url.searchParams.set(
              "duration",
              values.duration?.Value ?? values.duration?.Label ?? "",
            );
          if (values.date?.Value ?? values.date?.Label)
            url.searchParams.set(
              "date",
              values.date?.Value ?? values.date?.Label ?? "",
            );
          return CTA.url.startsWith("http")
            ? url.toString()
            : `${url.pathname}${url.search}`;
        } catch {
          return CTA.url;
        }
      })()
    : "#";

  return (
    <section
      id={Common?.BlockID || undefined}
      className="relative isolate overflow-hidden bg-darkGreen py-[8rem] lg:py-[12rem]"
    >
      {/* Right-side image with wavy mask */}
      {bgSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] lg:block"
          style={{
            WebkitMaskImage:
              "radial-gradient(120% 100% at 70% 50%, #000 55%, transparent 72%)",
            maskImage:
              "radial-gradient(120% 100% at 70% 50%, #000 55%, transparent 72%)",
          }}
        >
          <ImageComponent
            src={bgSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="60vw"
          />
        </div>
      )}

      {/* Decorative peacock */}
      {decorativeSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-[40%] top-[30%] z-1 hidden h-[50rem] w-[45rem] rotate-[6deg] opacity-90 mix-blend-multiply blur-[2px] lg:block"
        >
          <ImageComponent
            src={decorativeSrc}
            alt=""
            fill
            className="object-contain"
            sizes="45rem"
          />
        </div>
      )}

      <div className="secPad-x relative z-2 mx-auto max-w-[144rem]">
        <div className="flex flex-col gap-[3.5rem] lg:max-w-[90rem]">
          {Eyebrow && (
            <p className="text-[1.4rem] font-bold uppercase leading-[1.1] tracking-[0.1em] text-white lg:text-[1.6rem]">
              {Eyebrow}
            </p>
          )}

          <div className="flex flex-col gap-[1.5rem] text-[4.4rem] font-bold leading-[1.1] tracking-[-0.02em] text-white/50 md:text-[6rem] lg:gap-[2rem] lg:text-[8.7rem] lg:tracking-[-0.046em]">
            <div className="flex flex-wrap items-center gap-x-[2rem] gap-y-[1rem]">
              {HeadingPrefix && <span>{HeadingPrefix}</span>}
              <SelectorInline
                selector={GroupSelector}
                value={values.group}
                open={openKey === "group"}
                onToggle={() => toggle("group")}
                onSelect={(opt) => handleSelect("group", opt)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-[2rem] gap-y-[1rem]">
              {Connector1 && <span>{Connector1}</span>}
              <SelectorInline
                selector={DurationSelector}
                value={values.duration}
                open={openKey === "duration"}
                onToggle={() => toggle("duration")}
                onSelect={(opt) => handleSelect("duration", opt)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-[2rem] gap-y-[1rem]">
              {Connector2 && <span>{Connector2}</span>}
              <SelectorInline
                selector={DateSelector}
                value={values.date}
                open={openKey === "date"}
                onToggle={() => toggle("date")}
                onSelect={(opt) => handleSelect("date", opt)}
              />
            </div>
          </div>

          {CTA?.Title && (
            <Link
              href={ctaHref}
              target={CTA.type === "external" ? "_blank" : undefined}
              className="group mt-[1rem] inline-flex w-fit items-center gap-[1rem] rounded-full bg-lightBlue py-[1.2rem] pl-[2.4rem] pr-[0.8rem] text-[1.4rem] font-black uppercase leading-[1] tracking-[0.08em] text-white transition-colors hover:bg-lightBlue-300"
            >
              {CTA.Title}
              <span
                aria-hidden
                className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-white text-lightBlue"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform group-hover:translate-x-[0.2rem]"
                >
                  <path
                    d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
