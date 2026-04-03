import { useControllableState } from "@/hooks/useControllableState";
import { cn } from "@/lib/utils";
import type AnimationProps from "framer-motion";
import { HTMLAttributes, createContext, useContext, useId } from "react";

const spring: AnimationProps.Transition = {
  type: "spring",
  stiffness: 700,
  damping: 50,
} as const;

interface SearchTabsContextType {
  layoutId: string;
  selectedTabValue?: string;
  onChange: (value: string) => void;
}

const SearchTabsContext = createContext<SearchTabsContextType>(
  {} as SearchTabsContextType,
);

export const useSearchTabs = () => {
  const context = useContext(SearchTabsContext);
  if (!context) {
    throw new Error("useSearchTabs must be used within an SearchTabsProvider");
  }
  return context;
};

export interface SearchTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
}

const SearchTabs = ({
  className,
  children,
  onValueChange,
  value: valueProp,
  ...props
}: SearchTabsProps) => {
  const layoutId = useId();
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  return (
    <SearchTabsContext.Provider
      value={{
        layoutId,
        onChange: setValue,
        selectedTabValue: value,
      }}
    >
      <div className={cn("flex justify-center gap-4", className)} {...props}>
        {children}
      </div>
    </SearchTabsContext.Provider>
  );
};

const Tab = ({
  className,
  children,
  value,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  value: string;
}) => {
  const { selectedTabValue, layoutId, onChange } = useSearchTabs();

  const isActive = selectedTabValue === value;

  return (
    <button
      className={cn(
        "text3 hover:border-brick-red hover:bg-brick-red hover:text-beige relative rounded-full border border-black/25 px-12 pb-4 pt-5 uppercase transition-all duration-300 ease-linear",
        isActive && "border-brick-red bg-brick-red text-beige",
        className,
      )}
      onClick={() => onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export { SearchTabs, Tab };
