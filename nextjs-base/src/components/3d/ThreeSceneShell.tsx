import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ThreeSceneShellProps {
  children: ReactNode;
  className?: string;
  overlay?: ReactNode;
}

const ThreeSceneShell = ({
  children,
  className,
  overlay,
}: ThreeSceneShellProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-slate-950",
        className,
      )}
    >
      <div className="relative min-h-[420px] w-full md:min-h-[560px]">
        {children}
      </div>
      {overlay ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          {overlay}
        </div>
      ) : null}
    </section>
  );
};

export default ThreeSceneShell;
