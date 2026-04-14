"use client";

import { useI18n } from "@/app/locales/client";
import { cn } from "@/lib/utils";
import { FileUpload } from "@ark-ui/react";
import { FileText, XIcon } from "lucide-react";

interface FileInputProps extends FileUpload.RootProps {
  label?: string;
  placeholder?: string;
  destructive?: boolean;
}

export const FileInput = ({
  label = "Drag & Drop file here",
  placeholder = "pdf, jpg or pngs, Maximum 10 MB",
  destructive,
  ...props
}: FileInputProps) => {
  const t = useI18n();
  return (
    <FileUpload.Root className="w-full space-y-8" {...props}>
      <div
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-6 rounded-[2rem] border-[1px] border-dashed border-black/25 p-8",
          destructive && "border-red-700",
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <FileUpload.Dropzone className="text-center">
            <p className="font-medium">{label} </p>
          </FileUpload.Dropzone>
          <p> Or </p>
          <FileUpload.Trigger asChild>
            <div className="text6 bg-brick-red text-beige border-brick-red rounded-full border px-9 py-6 uppercase transition-all duration-300 ease-linear hover:bg-transparent hover:text-black">
              Upload
            </div>
          </FileUpload.Trigger>
        </div>
        <p className="text-p2 text-grey">{placeholder}</p>
      </div>
      <FileUpload.ItemGroup className="space-y-8">
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item
                key={file.name}
                file={file}
                className="rtl:direction-rtl mb-8 flex items-center gap-4 rounded-lg border border-black/25 px-10 py-7"
              >
                <FileText className="size-8 shrink-0" />
                <FileUpload.ItemName className="text2" />
                <FileUpload.ItemDeleteTrigger asChild>
                  <button className="ltr:me-0 ltr:ms-auto rtl:me-auto rtl:ms-0">
                    <XIcon className="size-8" />
                  </button>
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
};
