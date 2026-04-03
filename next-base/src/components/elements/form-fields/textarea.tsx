import { Label } from "@/components/elements/form-fields/label";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const InputVariants = cva(
  "text2 text:black/60 block w-full rounded-[2rem] border bg-transparent p-8 shadow-none outline-none group-[.error]:border-red-700",
  {
    variants: {
      theme: {
        dark: "border-black/25 text-black placeholder:text-black/60",
        light: "border-beige/25 text-beige placeholder:text-beige/60",
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  },
);

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof InputVariants> {
  rows?: number;
  label?: string;
  name: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  destructive?: boolean;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      rows = 8,
      classNames,
      type,
      label,
      hideLabel,
      error,
      name,
      destructive,
      disabled,
      required,
      theme,
      id,
      ...rest
    },
    ref,
  ) => {
    const newID = React.useId();
    let fieldId = id ?? newID;

    return (
      <div
        className={cn(
          "form-group group relative mb-8 w-full sm:mb-10",
          classNames?.wrapper,
          destructive && "error",
        )}
      >
        {label && !hideLabel ? (
          <Label className={cn("block", classNames?.label)} htmlFor={fieldId}>
            {label}
          </Label>
        ) : null}

        <textarea
          id={fieldId}
          ref={ref}
          className={InputVariants({ theme, className: classNames?.input })}
          rows={rows}
          name={name}
          {...rest}
        />
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
