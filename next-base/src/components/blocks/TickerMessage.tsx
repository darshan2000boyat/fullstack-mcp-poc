"use client";

import { TickerMessageBlockProps } from "@/typings/blocks";

interface TickerMessageProps {
  block: TickerMessageBlockProps;
}

export function TickerMessage({ block }: TickerMessageProps) {
  if (block.Disabled) return null;

  const { message = "Big Contributions · Make A Difference · Give Generously · " } = block;

  // Repeat text enough times to fill the ticker
  const repeated = Array(8).fill(message).join("  ·  ");

  return (
    <div className="bg-salmonOrange w-full overflow-hidden py-4">
      <div
        className="flex whitespace-nowrap animate-marquee [--duration:20s] [--gap:0px]"
        aria-label={message}
        role="marquee"
      >
        <span className="font-rakkas text-white text-[2.4rem] leading-none pr-8">
          {repeated}
        </span>
        {/* Duplicate for seamless loop */}
        <span className="font-rakkas text-white text-[2.4rem] leading-none pr-8" aria-hidden="true">
          {repeated}
        </span>
      </div>
    </div>
  );
}

export default TickerMessage;
