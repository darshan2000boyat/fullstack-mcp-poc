/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "public", "images", "footprint");

// Figma frame origins (x, y) inside Layer_1 (3470 × 1130). Coordinates come
// straight from the Figma metadata for node 6408:4247 — translating each
// country's SVG by these values places every dot in its exact Figma position
// without any scaling.
const COUNTRIES = [
  { key: "iraq",    frameName: "Iraq",    x: 1848,        y: 296     },
  { key: "jordan",  frameName: "Jordan",  x: 1795.97265625, y: 311.305419921875 },
  { key: "egypt",   frameName: "Egypt",   x: 1586,        y: 342.8004150390625 },
  { key: "ksa",     frameName: "KSA",     x: 1765.1795654296875, y: 368 },
  { key: "kuwait",  frameName: "Kuwait",  x: 1883,        y: 352     },
  { key: "bahrain", frameName: "Bahrain", x: 1921,        y: 372     },
  { key: "qatar",   frameName: "Qatar",   x: 1880.382080078125, y: 381.49114990234375 },
  { key: "uae",     frameName: "UAE",     x: 1912.257080078125, y: 391.9605712890625 },
  { key: "oman",    frameName: "Oman",    x: 1906.712646484375, y: 404 },
];

const extractPaths = (svgText, frameName) => {
  const re = new RegExp(`<g id="${frameName}">([\\s\\S]+?)</g>`, "m");
  const match = svgText.match(re);
  if (!match) throw new Error(`Could not locate <g id="${frameName}"> in source`);
  return match[1].trim().replace(/\s*fill="[^"]*"/g, "");
};

const base = fs.readFileSync(path.join(DIR, "base-map.svg"), "utf-8");

let countryGroups = "";
for (const { key, frameName, x, y } of COUNTRIES) {
  const countrySvg = fs.readFileSync(path.join(DIR, `country-${key}.svg`), "utf-8");
  const paths = extractPaths(countrySvg, frameName);
  countryGroups +=
    `<g id="country-${key}" data-country="${key}" transform="translate(${x} ${y})">\n${paths}\n</g>\n`;
}

// Insert country groups right before the closing </svg> so they sit alongside
// the base-map group inside the same coordinate space.
const combined = base.replace(/<\/svg>\s*$/, `${countryGroups}</svg>\n`);

const outPath = path.join(DIR, "world-map.svg");
fs.writeFileSync(outPath, combined);
console.log(`Wrote ${outPath} (${combined.length.toLocaleString()} bytes)`);

// Also write a small countries-only SVG — same viewBox as the base map so it
// can be inlined and overlaid without any coordinate maths. CSS controls fill.
const countriesOnly = `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 3469.93 1129.95" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n${countryGroups}</svg>\n`;
const countriesPath = path.join(DIR, "countries-map.svg");
fs.writeFileSync(countriesPath, countriesOnly);
console.log(`Wrote ${countriesPath} (${countriesOnly.length.toLocaleString()} bytes)`);
