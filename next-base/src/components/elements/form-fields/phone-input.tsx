import { InputProps } from "@/components/elements/form-fields/input";
import { Label } from "@/components/elements/form-fields/label";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    classNames?: {
      wrapper?: string;
      label?: string;
      helperText?: string;
    };
    label?: string;
    placeholder?: string;
    required?: boolean;
    destructive?: boolean;
    helperText?: string;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    (
      {
        className,
        onChange,
        classNames,
        label,
        required,
        destructive,
        helperText,
        ...props
      },
      ref,
    ) => {
      return (
        <div
          className={cn(
            "group bg-transparent p-8",
            destructive && "!border-red-700",
            classNames?.wrapper,
          )}
        >
          {label ? (
            <Label className={cn("block", classNames?.label)}>
              {label}{" "}
              {required ? <span className="text-red-700">*</span> : null}
            </Label>
          ) : null}
          <RPNInput.default
            ref={ref}
            className={cn("text2 flex gap-6 bg-transparent", className)}
            flagComponent={FlagComponent}
            countrySelectComponent={CountrySelect}
            inputComponent={InputComponent}
            /**
             * Handles the onChange event.
             *
             * react-phone-number-input might trigger the onChange event as undefined
             * when a valid phone number is not entered. To prevent this,
             * the value is coerced to an empty string.
             *
             * @param {E164Number | undefined} value - The entered value
             */
            onChange={(value) => onChange?.(value as any)}
            {...props}
          />
          {/* {helperText ? (
            <div
              className={cn(
                "error-msg",
                destructive && "text-red-700",
                classNames?.helperText,
              )}
            >
              {helperText}
            </div>
          ) : null} */}
        </div>
      );
    },
  );

PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder, ...props }, ref) => (
    <input
      className={cn(
        "p text2 w-full bg-transparent text-black/60 placeholder-black/60 outline-none rtl:text-right",
        className,
      )}
      placeholder={placeholder}
      {...props}
      ref={ref}
    />
  ),
);

InputComponent.displayName = "InputComponent";

type CountrySelectOptions = {
  label: string;
  value: RPNInput.Country;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOptions[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Select onValueChange={(value) => handleSelect(value as RPNInput.Country)}>
      <SelectPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn("flex items-center gap-[0.4rem] p-0 outline-none")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <span className="text2 text-black">
            +{RPNInput.getCountryCallingCode(value)}
          </span>
          <ChevronDownIcon
            className={cn("h-8", disabled ? "hidden" : "opacity-100")}
          />
        </button>
      </SelectPrimitive.Trigger>
      <SelectContent
        className="overflow-hidden rounded-[3rem] border border-black/25 bg-white py-6 outline-none rtl:-start-8 sm:rtl:-start-[4rem] md:rtl:-start-16 xl:rtl:-start-52"
        alignOffset={-20}
      >
        {options
          .filter((x) => x.value)
          .map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-4 pb-4">
                <span>
                  <FlagComponent
                    country={option.value}
                    countryName={option.label}
                  />
                </span>
                <span className="text4 text-black/60">{option.label}</span>
                {option.value && (
                  <span className="text4 text-black/40">
                    {`+${RPNInput.getCountryCallingCode(option.value)}`}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 text-p1 flex h-[1.3rem] w-8 gap-[0.4rem] overflow-hidden">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
