import { readFileSync } from "fs";
import path from "path";
import { FootprintMapProps } from "@/typings/blocks";
import FootprintMapClient from "./FootprintMapClient";

// Read once per server process. The combined countries SVG is ~40KB and holds
// all nine country groups in the same coordinate space as base-map.svg, each
// tagged with id="country-<name>" so CSS can flip its fill from blue to gold.
const countriesSvg = readFileSync(
  path.join(
    process.cwd(),
    "public",
    "images",
    "footprint",
    "countries-map.svg",
  ),
  "utf-8",
);

export default function FootprintMap({ block }: { block: FootprintMapProps }) {
  return <FootprintMapClient block={block} countriesSvg={countriesSvg} />;
}
