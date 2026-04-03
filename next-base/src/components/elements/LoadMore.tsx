"use client";
import { useI18n } from "@/app/locales/client";
import { cn } from "@/lib/utils";
const LoadMore = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => {
  const t = useI18n();
  return (
    <div
      className={cn(
        "load-more lg:hover:text-primary !m-0 flex cursor-pointer items-center justify-center pt-16 font-semibold transition-colors duration-300 max-md:pt-10",
        className,
      )}
      onClick={onClick}
    >
      {"Load More"}
    </div>
  );
};

export default LoadMore;
