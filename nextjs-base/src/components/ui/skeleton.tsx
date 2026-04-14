import { cn } from "@/lib/utils";

function Skeleton({
  className,
  children,
  isDark = false,
  ...props
}: React.ComponentProps<"div"> & { isDark?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-4xl",
        isDark ? "bg-black-100/20" : "bg-white/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Skeleton };
