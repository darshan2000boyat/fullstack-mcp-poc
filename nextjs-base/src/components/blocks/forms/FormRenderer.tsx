"use client";
import Input from "@/components/elements/form-fields/input";
import { PhoneInput } from "@/components/elements/form-fields/phone-input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/elements/form-fields/radio-group";
import TextArea from "@/components/elements/form-fields/textarea";
import { cn } from "@/lib/utils";
import type { FormField } from "@/typings/form";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Controller,
  UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";

import { useCurrentLocale } from "@/app/locales/client";
import { FileInput } from "@/components/elements/form-fields/file-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import "@/styles/react-datepicker.css";
import { CalendarIcon, ClockIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from "zod";

interface FormRendererProps
  extends Pick<UseFormReturn, "control" | "register"> {
  formFields?: FormField[];
}

const emailSchema = z.string().email("Invalid email address");
const textSchema = z.string().trim().min(1, "Required");

const FormRenderer = ({ formFields, control, register }: FormRendererProps) => {
  const watchAll = useWatch({
    control,
  });
  const { errors } = useFormState({
    control,
  });

  const isArabic = useCurrentLocale() === "ar" ? true : false;

  const getFormFields = (field: FormField, index: number) => {
    const submissionKey = field?.SubmissionKey;
    const fieldId = field?.id;
    const label = field?.Label;
    const placeholder = field?.Placeholder ?? field?.Label;

    switch (field?.Type) {
      case "email":
      case "number":
      case "text":
        return (
          <div
            className={cn(
              "relative w-full",
              field?.width === "w-50%" && "sm:w-[calc(50%-1rem)]",
              field?.width === "w-25%" && "sm:w-[calc(25%-1rem)]",
            )}
          >
            <Input
              {...register(submissionKey, {
                // required: field?.Mandatory,
                validate: (value) => {
                  // console.log(value, "z-val");
                  let validationResult;

                  if (field?.Type === "email") {
                    validationResult = emailSchema.safeParse(value);
                  } else {
                    validationResult = textSchema.safeParse(value);
                  }

                  if (!validationResult.success) {
                    return (
                      validationResult.error.errors[0]?.message ||
                      "Invalid input"
                    );
                  }

                  return true;
                },
              })}
              key={`${submissionKey}-${fieldId}`}
              placeholder={field?.Placeholder}
              label={label}
              hideLabel={field?.hideLabel}
              required={field?.Mandatory}
              type={
                field?.Type === "number"
                  ? "number"
                  : field?.Type === "email"
                    ? "email"
                    : "text"
              }
              destructive={!!errors?.[submissionKey]?.message}
              helperText={errors?.[submissionKey]?.message as string}
              classNames={{
                wrapper: "mb-8 sm:mb-10",
                label: "z-2",
                helperText: "absolute -bottom-10 start-6",
              }}
            />
          </div>
        );
      case "textarea":
        return (
          <TextArea
            {...register(submissionKey, {
              // required: field?.Mandatory,
              validate: (value) => {
                // console.log(value, "z-val");
                let validationResult;

                validationResult = textSchema.safeParse(value);

                if (!validationResult.success) {
                  return (
                    validationResult.error.errors[0]?.message || "Invalid input"
                  );
                }

                return true;
              },
            })}
            type={field?.Type}
            label={label}
            hideLabel={field?.hideLabel}
            placeholder={placeholder}
            classNames={{}}
            key={`${submissionKey}-${fieldId}`}
            destructive={!!errors?.[submissionKey]?.message}
          />
        );
      case "radio":
        return (
          <Controller
            control={control}
            name={submissionKey}
            rules={{ required: field?.Mandatory }}
            key={`${submissionKey}-${fieldId}`}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                value={value}
                onValueChange={onChange}
                className={cn("mb-12 sm:mb-20")}
              >
                {field?.SelectOptions?.map((option) => (
                  <div key={option?.Value} className="flex items-center gap-4">
                    <RadioGroupItem value={option?.Value} id={option?.Value} />
                    <Label className="text3">{option?.Label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );

      case "phone":
        return (
          <Controller
            control={control}
            name={submissionKey}
            key={`${submissionKey}-${fieldId}`}
            rules={{
              validate: (val) => {
                if (field?.Mandatory) {
                  if (!val?.trim()) return "Phone number is required";
                  if (!isValidPhoneNumber(val)) return "Invalid phone number";
                }
              },
            }}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                value={value}
                onChange={onChange}
                defaultCountry="AE"
                placeholder={field?.Placeholder}
                label={label}
                required={field?.Mandatory}
                destructive={!!errors?.[submissionKey]?.message}
                helperText={errors?.[submissionKey]?.message as string}
                classNames={{
                  wrapper:
                    "relative mb-8 w-full rounded-[30rem] border border-black/25 bg-transparent sm:mb-10",
                  label: "hidden",
                  helperText: "absolute -bottom-10 start-6",
                }}
              />
            )}
          />
        );
      case "select":
        return (
          <Controller
            control={control}
            name={submissionKey}
            rules={{
              validate: (val) => {
                if (field?.Mandatory) {
                  if (!val?.trim()) return "Field is required";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <div
                className={cn(
                  "relative w-full",
                  field?.width === "w-50%" && "sm:w-[calc(50%-1rem)]",
                  field?.width === "w-25%" && "sm:w-[calc(25%-1rem)]",
                )}
              >
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger
                    className="!text2 mb-8 w-full normal-case sm:mb-10"
                    label={label}
                    required={field?.Mandatory}
                    destructive={!!errors?.[submissionKey]}
                  >
                    <SelectValue placeholder={placeholder} className="text2" />
                  </SelectTrigger>
                  <SelectContent>
                    {field?.SelectOptions?.map((option) => (
                      <SelectItem key={option?.id} value={option?.Value}>
                        {option?.Label}
                      </SelectItem>
                    ))}
                    {field?.SelectOptions?.length === 0 ? (
                      <SelectItem value="disabled" disabled>
                        No Options Available
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        );
      case "date":
        return (
          <Controller
            control={control}
            name={submissionKey}
            rules={{
              required: field?.Mandatory,
            }}
            render={({ field: { onChange, value } }) => (
              <div
                className={cn(
                  "relative",
                  field?.width === "w-50%" &&
                    "w-full sm:w-[calc(50%-1rem)] [&>div]:w-full",
                )}
              >
                <DatePicker
                  value={value}
                  onChange={onChange}
                  required={field?.Mandatory}
                  selected={value}
                  placeholderText={label}
                  className={cn(
                    "text2 rtl:direction-ltr mb-8 w-full rounded-full border border-black/25 bg-transparent px-12 py-8 text-black !outline-none transition-colors duration-300 ease-linear placeholder:text-black/60 hover:border-black sm:mb-10 rtl:text-end",
                    !!errors?.[submissionKey] && "border-red-700",
                  )}

                  // destructive={!!errors?.[submissionKey]}
                />
                <CalendarIcon className="pointer-events-none absolute end-8 top-8 size-8" />
              </div>
            )}
          />
        );
      case "time":
        return (
          <div
            className={cn(
              "relative",
              field?.width === "w-50%" &&
                "relative w-full sm:w-[calc(50%-1rem)] [&>div]:w-full",
            )}
          >
            <Controller
              control={control}
              name={submissionKey}
              rules={{
                required: field?.Mandatory,
              }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  required={field?.Mandatory}
                  selected={value}
                  placeholderText={label}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className={cn(
                    "text2 rtl:direction-ltr mb-8 w-full rounded-full border border-black/25 bg-transparent px-12 py-8 text-black !outline-none transition-colors duration-300 ease-linear placeholder:text-black/60 hover:border-black sm:mb-10 rtl:text-end",
                    !!errors?.[submissionKey] && "border-red-700",
                  )}
                  // destructive={!!errors?.[submissionKey]}
                />
              )}
            />
            <ClockIcon className="pointer-events-none absolute end-8 top-8 size-8" />
          </div>
        );
      case "upload":
        const maxFiles = field?.maxFiles ?? 1;
        const maxFileSize = 10485760; //10MB

        return (
          <Controller
            control={control}
            name={submissionKey}
            rules={{
              validate: {
                required: (value) => {
                  if (field?.Mandatory && (!value || value?.length < 1)) {
                    return false;
                  }
                  return true;
                },
                maxFiles: (value) => {
                  if (value?.length < maxFiles) {
                    return false;
                  }
                  return true;
                },
              },
            }}
            render={({ field: { onChange } }) => (
              <FileInput
                accept={["application/pdf", "image/jpeg", "image/png"]}
                maxFiles={maxFiles}
                maxFileSize={maxFileSize}
                onFileChange={(e) => onChange(e.acceptedFiles)}
                label={label}
                placeholder={placeholder}
                destructive={!!errors?.[submissionKey]}
              />
            )}
          />
        );
    }
  };

  return <>{formFields?.map(getFormFields)}</>;
};

export default FormRenderer;
