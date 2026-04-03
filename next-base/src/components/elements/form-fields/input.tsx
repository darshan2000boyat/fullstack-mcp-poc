import { Label } from "@/components/elements/form-fields/label";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const InputVariants = cva(
  "text2 z-1 text:black/60 group-hover:bg-beige peer relative block w-full rounded-[30rem] border bg-transparent p-8 shadow-none outline-none placeholder:text-transparent focus:outline-none group-[.error]:border-red-700",
  {
    variants: {
      theme: {
        dark: "border-black/25 text-black focus:border-black",
        light: "border-beige/25 text-beige",
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  label?: string;
  hideLabel?: boolean;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
    helperText?: string;
  };
  destructive?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      classNames,
      type,
      label,
      hideLabel,
      error,
      name,
      placeholder,
      disabled,
      destructive,
      required,
      helperText,
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
          "form-group group relative w-full",
          destructive && "error",
          classNames?.wrapper,
        )}
      >
        <input
          id={fieldId}
          ref={ref}
          type={type ? type : "text"}
          className={InputVariants({ theme, className: classNames?.input })}
          name={name}
          placeholder={placeholder || label}
          {...rest}
        />
        {label && !hideLabel ? (
          <Label
            className={cn(
              "absolute -top-4 start-8 translate-y-0 bg-white px-2 text-black/60 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:-top-4 peer-focus:translate-y-0 peer-focus:px-2",
              classNames?.label,
            )}
            htmlFor={fieldId}
          >
            {label} {required ? <span className="text-red">*</span> : null}
          </Label>
        ) : null}
        {error ? <span className="text-red">{error}</span> : null}
        {/* {helperText ? (
          <p
            className={cn(
              "error-msg",
              destructive && "text-red-700 ",
              classNames?.helperText
            )}
          >
            {helperText}
          </p>
        ) : null} */}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
