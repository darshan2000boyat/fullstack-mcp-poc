"use client";

import { cn } from "@/lib/utils";
import { LetUsHelpYouBlockProps } from "@/typings/blocks";
import { useState } from "react";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  accentColor?: "limeGreen" | "salmonOrange" | "deepKhaki";
}

function InlineDropdown({ options, value, onChange, accentColor = "limeGreen" }: DropdownProps) {
  const [open, setOpen] = useState(false);

  const underlineClass = {
    limeGreen: "border-limeGreen",
    salmonOrange: "border-salmonOrange",
    deepKhaki: "border-deepKhaki",
  }[accentColor];

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "font-dubai font-medium text-pineGreen border-b-2 pb-1 inline-flex items-center gap-1",
          underlineClass
        )}
      >
        {value}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="absolute top-full left-0 mt-2 z-20 bg-white border border-pineGreen/10 rounded-2xl shadow-3xl overflow-hidden min-w-[16rem]">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  "w-full text-left px-5 py-3 font-dubai .p text-pineGreen hover:bg-earlyDawn transition-colors",
                  opt === value && "font-medium bg-earlyDawn"
                )}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

interface LetUsHelpYouProps {
  block: LetUsHelpYouBlockProps;
}

export function LetUsHelpYou({ block }: LetUsHelpYouProps) {
  if (block.Disabled) return null;

  const {
    prefixText = "I want to donate",
    suffixText = "to help",
    amountOptions = ["Ð 50", "Ð 100", "Ð 250", "Ð 500"],
    causeOptions = ["Education", "Health", "Environment", "Food"],
    frequencyOptions = ["monthly", "weekly", "once"],
    ctaLabel = "Find a cause",
  } = block;

  const [amount, setAmount] = useState(amountOptions[0] ?? "Ð 50");
  const [cause, setCause] = useState(causeOptions[0] ?? "Education");
  const [frequency, setFrequency] = useState(frequencyOptions[0] ?? "monthly");

  return (
    <section className="bg-white w-full py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[120rem] mx-auto flex flex-col items-center gap-10 text-center">
        {/* Interactive sentence */}
        <p className="font-dubai font-medium text-pineGreen text-[2.4rem] md:text-[3.2rem] lg:text-[4rem] leading-relaxed flex flex-wrap justify-center items-end gap-x-3 gap-y-2">
          <span>{prefixText}</span>
          <InlineDropdown options={amountOptions} value={amount} onChange={setAmount} accentColor="limeGreen" />
          <InlineDropdown options={causeOptions} value={cause} onChange={setCause} accentColor="salmonOrange" />
          <span>{suffixText}</span>
          <InlineDropdown options={frequencyOptions} value={frequency} onChange={setFrequency} accentColor="deepKhaki" />
        </p>

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

export default LetUsHelpYou;
