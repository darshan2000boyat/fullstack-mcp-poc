import { cn } from "@/lib/utils";
import parse, { HTMLReactParserOptions } from "html-react-parser";

interface RichTextProps {
  content?: string;
  className?: string;
  options?: HTMLReactParserOptions;
  variant?: "default" | "light" | "contrast"
}

export default function RichText({
  content,
  options,
  className,
  variant = "default"
}: RichTextProps) {
  if (!content) return null;

  const parserOptions: HTMLReactParserOptions = {
    ...options,
  };

  return (
    <div
      className={cn(
        // base & resets
        "[&amp;&gt;div&gt;*:last-child]:mb-0 prose min-w-full [&>div>*:first-child]:mt-0 text-primary",
        // headings
        "prose-h1:h1 prose-h2:h2 prose-h3:h3 prose-h4:h4 prose-h5:h5 prose-h3:max-md:h5 prose-headings:mb-8 prose-headings:text-black",
        // paragraphs & fonts
        "prose-p:p prose-p:font-red-hat-display prose-p:text-black/60",
        // links
        "prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary-300",
        // lists & list markers
        "prose-ol:text-black/60 prose-ul:my-12 prose-ul:ps-0 prose-ul:text-black/60 prose-li:relative prose-li:!mt-0 prose-li:mb-8 prose-li:p-0 prose-li:text-black/60",
        "prose-li:marker:font-extralight prose-li:marker:text-black/60 prose-li:before:absolute prose-li:before:-start-6 prose-li:before:top-3 prose-li:before:bg-black/60",
        // responsive list tweaks + content-specific overrides
        "prose-ul:max-md:my-8 prose-li:before:max-md:-start-5 md:prose-li:before:top-3 [&>div>ol>li:before]:content-none [&>div>ul>li]:list-none",
        // fallback list resets
        "prose-ol:list-none prose-ol:pl-0 prose-ul:list-none prose-ul:pl-0 prose-li:before:content-none",
        "prose-h1:text-primary prose-h2:text-primary prose-strong:text-secondary prose-span:text-white",
        variant === "light" &&
          "prose-headings:!text-white prose-p:!text-white/80 prose-ol:!text-white/80 prose-ul:!text-white/80 prose-li:!text-white/80 prose-li:marker:!text-white/70 prose-a:!text-white hover:prose-a:!text-white/80",
        variant === "contrast" &&
          "prose-headings:!text-white prose-strong:!text-white prose-p:text-white/80 drop-shadow-md",
        className,
      )}
    >
      {parse(content, parserOptions)}
    </div>
  );
}
