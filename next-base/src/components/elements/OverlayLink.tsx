import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";

const OverlayLink = ({
  href,
  className,
  ariaLabel,
  target = "_self",
  rel,
  ...rest
}: {
  href: string;
  className?: string;
  target?: string;
  ariaLabel?: string;
  rel?: string;
}) => {
  return (
    <Link
      href={href}
      aria-label={ariaLabel || "Overlay Link"}
      className={cn(`absolute start-0 top-0 z-30 size-full`, className)}
      target={target}
      rel={rel || undefined}
      {...rest}
    >
      <span className="sr-only"></span>
    </Link>
  );
};

export default OverlayLink;
