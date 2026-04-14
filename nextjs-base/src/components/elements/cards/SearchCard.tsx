"use client";
import { useI18n } from "@/app/locales/client";
import OverlayLink from "@/components/elements/OverlayLink";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";

const SearchCard = ({
  result,
  routeURL,
  breadcrumbs,
}: {
  result: any;
  routeURL: string;
  breadcrumbs: Array<{ title: string; url?: string }>;
}) => {
  const t = useI18n();

  return (
    <div className="hc0text-white rounded-6xl bg-grey hc:text-white hc:hover:bg-primary max-sm:rounded-4xl relative flex min-h-[43rem] flex-col justify-between p-16 transition-all duration-300 max-sm:min-h-[26.7rem] max-sm:p-8">
      <OverlayLink href={routeURL} />
      <div className="top">
        <ul className="flex flex-wrap items-center text-ellipsis whitespace-nowrap opacity-40">
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={`crumb-${index}`}>
              <li className="text-breadcrumb inline-flex text-[1.4rem] leading-tight max-sm:text-xl">
                <div className="link-underline text-[1.4rem] transition-all duration-700 after:bg-white hover:opacity-50 max-sm:text-xl">
                  {crumb.title}
                </div>
              </li>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2">/</span>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
      <div className="bottom max-sm:pe-12">
        <h2 className="line-clamp-2 text-5xl leading-normal max-sm:text-[2.4rem]">
          {result?.PageTitle}
        </h2>
        <p className="mt-8 line-clamp-2 font-light opacity-80 max-sm:text-[1.6rem]">
          {result?.PageDescription}
        </p>
        <Button
          href="#"
          showLogo={false}
          className="hc:bg-white hc:text-black hc:lg:hover:bg-primary hc:lg:hover:text-white group mt-16 inline-block py-8 max-sm:mt-8 max-sm:py-4"
        >
          {"Learn More"}
        </Button>
      </div>
    </div>
  );
};

export default SearchCard;
