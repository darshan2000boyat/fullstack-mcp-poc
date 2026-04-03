import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { UpdateStateFunction } from "@/typings/common";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

const SearchPageInput = ({
  updateState,
  label,
  className,
}: {
  updateState: UpdateStateFunction;
  label: string;
  className?: string;
}) => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value);

  useEffect(() => {
    // if (debouncedValue) {
    //   updateState({
    //     keyword: debouncedValue,
    //   });
    // }
    updateState({
      keyword: debouncedValue,
    });
  }, [debouncedValue, updateState]);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-full border border-black/25 px-6 transition-colors duration-300 ease-linear hover:border-black",
        className,
      )}
    >
      <SearchIcon className="size-7" />
      <input
        placeholder={label}
        onChange={(e) => setValue(e.target.value)}
        className={`text2 placeholder:text2 w-full bg-transparent pb-7 pt-8 outline-none`}
      />
    </div>
  );
};

export default SearchPageInput;
