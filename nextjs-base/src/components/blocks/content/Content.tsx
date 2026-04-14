"use client";
import { DynamicZoneProps } from "@/typings/common";

const Content = ({ block }: { block: DynamicZoneProps }) => {
  return (
    <section className="tw:w-full grid grid-cols-2 gap-4">
      <div
        dangerouslySetInnerHTML={{
          __html: block?.ContentLeft || "",
        }}
      ></div>
      <div
        dangerouslySetInnerHTML={{
          __html: block?.ContentRight || "",
        }}
      ></div>
    </section>
  );
};

export default Content;
