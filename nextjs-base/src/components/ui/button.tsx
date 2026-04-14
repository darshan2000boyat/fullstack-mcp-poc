import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

const ButtonVariants = cva(
  "small inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
        outline:
          "border border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-2",
        lg: "h-20 rounded-md px-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  href?: string;
  target?: string;
  typeDiv?: boolean;
  loading?: boolean;
  showLogo?: boolean; // New prop to control logo visibility
  dark?: boolean; // New prop to control logo visibility
}

export interface BaseButtonProps extends VariantProps<typeof ButtonVariants> {
  loading?: boolean;
  asChild?: boolean;
  showLogo?: boolean; // Add to base props
  dark?: boolean; // Add to base props
}

export interface ButtonAsLinkProps
  extends BaseButtonProps,
    React.ComponentPropsWithoutRef<typeof Link> {}

export interface ButtonAsButtonProps
  extends BaseButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

export interface DivAsButtonProps
  extends BaseButtonProps,
    React.ButtonHTMLAttributes<HTMLDivElement> {}

const Button = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      href,
      target,
      loading,
      typeDiv,
      onClick,
      children,
      showLogo = false, // Default to false
      dark = false, // Default to false
      ...props
    },
    ref,
  ) => {
    if (typeDiv) {
      const divOnClick = onClick as
        | React.MouseEventHandler<HTMLDivElement>
        | undefined;
      return (
        <div
          className={cn(ButtonVariants({ variant, size }), className)}
          ref={ref as React.Ref<HTMLDivElement>}
          onClick={divOnClick}
          {...(props as DivAsButtonProps)}
        >
          {children}
        </div>
      );
    }

    if (href) {
      return (
        <Link
          className={cn(ButtonVariants({ variant, size }), className)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          prefetch={false}
          {...(props as Omit<ButtonAsLinkProps, "href" | "onClick">)}
          onClick={
            onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
          }
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        className={cn(ButtonVariants({ variant, size }), className)}
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...(props as ButtonAsButtonProps)}
      >
        {loading ? <Spinner className="me-2 size-4" /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, ButtonVariants };
