"use client";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useControllableState } from "@/hooks/useControllableState";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cn, generateTimes } from "@/lib/utils";
import { parseTime, Time } from "@internationalized/date";
import { Clock } from "lucide-react";
import React, { useMemo } from "react";
import {
  TimeField as AriaTimeField,
  TimeFieldProps as AriaTimeFieldProps,
  DateInput,
  DateSegment,
  TimeValue,
  ValidationResult,
} from "react-aria-components";

export interface TimeFieldProps
  extends Omit<AriaTimeFieldProps<TimeValue>, "value" | "onChange"> {
  label?: string;
  disabled?: boolean;
  layout?: "" | "plain";
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  helperText?: string;
  destructive?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TimeField({
  label,
  description,
  errorMessage,
  className,
  helperText,
  disabled: isDisabled = false,
  layout = "",
  destructive,
  id,
  value: valueProp,
  onChange,
  ...props
}: TimeFieldProps) {
  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    onChange: onChange,
  });
  const generatedId = React.useId();
  const elId = id ?? generatedId;
  const [isOpen, dropdownHandler] = useDisclosure(false);

  const timesArray = useMemo(generateTimes, []);

  const currentValue = useMemo(
    () => (value ? parseTime(value?.split(":").slice(0, 2).join(":")) : null),
    [value],
  );

  return (
    <Popover open={isOpen} onOpenChange={dropdownHandler.set}>
      <PopoverAnchor
        className={cn(
          "relative flex flex-col gap-2",
          isDisabled && "pointer-events-none opacity-50",
        )}
        aria-label="TimeField"
      >
        <AriaTimeField
          className={cn(
            "relative flex items-center rounded-full border border-black/20 bg-white px-8 py-4",
            destructive && "border-red",
            className,
          )}
          id={elId}
          aria-label={label ?? "TimeField"}
          value={currentValue}
          onChange={(e) => setValue(new Time(e?.hour, e?.minute).toString())}
          isDisabled={isDisabled}
          {...props}
        >
          {label ? (
            <label
              htmlFor={elId}
              className={cn("l2 text-body/40 absolute top-3 transition-all")}
            >
              {label}
            </label>
          ) : null}
          <DateInput className={cn("flex items-center text-xl")}>
            {(segment) => (
              <DateSegment
                className={cn(
                  "rounded-md outline-none transition-all data-[focused]:bg-blue-500 data-[focused]:px-1 data-[focused]:text-white",
                )}
                segment={segment}
              />
            )}
          </DateInput>
          <PopoverTrigger className="ms-auto">
            <Clock />
          </PopoverTrigger>
        </AriaTimeField>
        {helperText ? (
          <div
            className={cn(
              "p3-m ps-[1.688rem] font-medium",
              destructive && "text-red",
            )}
          >
            {helperText}
          </div>
        ) : null}
      </PopoverAnchor>
      <PopoverContent className="max-h-64 w-[var(--radix-popper-anchor-width)] overflow-y-auto p-0 text-xl">
        {timesArray?.map((time) => {
          const parsedTime = parseTime(time.value);
          const changeValue = new Time(parsedTime?.hour, parsedTime?.minute);
          const isSelected = currentValue
            ? changeValue.compare(
                new Time(currentValue?.hour, currentValue?.minute),
              ) === 0
            : null;

          return (
            <div
              key={time.value}
              className={cn(
                "p-4 transition-colors hover:bg-gray-200",
                isSelected && "bg-gray-300",
              )}
              onClick={() => {
                setValue(changeValue.toString());
                dropdownHandler.close();
              }}
            >
              {time.label}
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
