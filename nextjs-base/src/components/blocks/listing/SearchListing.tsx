"use client";

import { useCurrentLocale, useI18n } from "@/app/locales/client";
import SearchCard from "@/components/elements/cards/SearchCard";
import LoadMore from "@/components/elements/LoadMore";
import SearchCardSkeleton from "@/components/elements/skeletons/SearchCardSkeleton";

import SearchInput from "@/components/ui/searchInput";
import { cn, getRouteURL, getTitleBreadcrumbs } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

const COLLECTION_TYPES = {
  ALL: { model: "all", label: "All" },
  NEWSEVENT: {
    model: "api::news-and-events.news-and-events",
    label: "News & Event",
  },
  SERVICES: { model: "api::project.project", label: "Services" },
  BUSINESS: { model: "api::projectb.projectb", label: "For Business" },
  VACANCIES: { model: "api::vacancy.vacancy", label: "Vacancies" },
} as const;

const PAGE_SIZE = 6;
const SearchListing = ({ block }: { block: any }) => {
  const searchParams = useSearchParams();
  const locale = useCurrentLocale();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState<string>(initialQuery);
  const t = useI18n();

  const initialTab = (
    searchParams.get("type") || "ALL"
  ).toUpperCase() as keyof typeof COLLECTION_TYPES;
  const [activeTab, setActiveTab] = useState(initialTab);

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    (pageIndex) => {
      const page = pageIndex + 1;
      const params = qs.stringify(
        {
          page,
          query,
          locale,
          type: COLLECTION_TYPES[activeTab].model,
          pageSize: 6,
        },
        { skipNulls: true },
      );
      return `/api/search?${params}`;
    },
    {
      revalidateFirstPage: false,
      keepPreviousData: true,
    },
  );

  const totalPages =
    data?.[data.length - 1]?.data?.meta?.pagination?.pageCount || 0;
  const totalResults =
    data?.[data.length - 1]?.data?.meta?.pagination?.total || 0;
  const allCounts =
    data?.[data.length - 1]?.data?.meta?.pagination?.allCounts || {};

  const hasMorePages = size < totalPages;

  const searchResults = data?.flatMap((e) => e?.data?.data) || [];
  const noResultsFound = !searchResults.length && !isLoading && !isValidating;

  const handleTabClick = (tab: keyof typeof COLLECTION_TYPES) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setSize(1);
    }
  };

  const handleLoadMore = () => {
    if (hasMorePages) {
      setSize(size + 1);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: "Search Page",
    description: "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="search-listing-block space-y-16 pb-40 max-sm:space-y-8 lg:-mt-20">
        <div className="search-block px-16 max-md:px-8 max-sm:px-4">
          <div className="relative flex w-[46rem] max-sm:w-full">
            <SearchInput
              className="p1 rounded-4xl bg-grey placeholder:text-black-100/40 hc:bg-white hc:[border:1px_solid_black] hc:placeholder:text-black h-auto w-full border-none px-8 py-7 pe-24 text-black max-sm:py-6"
              placeholder={"What Are You Looking For"}
              onSearch={(e) => setQuery(e)}
              initialValue={initialQuery}
            />

            <span className="icon-search lg:group-hover:text-primary h6 absolute end-10 top-1/2 -translate-y-1/2 text-black transition-colors duration-300 max-sm:text-[2.4rem]"></span>
          </div>
        </div>
        <div className="filters-block flex gap-[0.8rem] overflow-auto px-16 scrollbar-hide max-sm:ps-5">
          {Object.keys(COLLECTION_TYPES).map((key) => {
            const collection =
              COLLECTION_TYPES[key as keyof typeof COLLECTION_TYPES];
            const count =
              allCounts[collection.model as keyof typeof allCounts] || 0; // Access count using model
            return (
              <div
                key={key}
                className={cn(
                  "p1 border-black-100/10 hover:bg-primary group inline-flex min-w-40 flex-shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full border px-8 py-5 leading-none text-black transition-all duration-700 hover:border-transparent hover:text-white",
                  activeTab === key &&
                    "bg-primary border-transparent text-white",
                )}
                onClick={() =>
                  handleTabClick(key as keyof typeof COLLECTION_TYPES)
                }
              >
                {collection.label}
                <span
                  className={cn(
                    "bg-grey-400 group-hover:text-primary flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full p-2 text-[1.4rem] transition-all duration-700 group-hover:bg-white",
                    activeTab === key && "text-primary",
                  )}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
        <div className="search-listing bg-ghostWhite px-16 max-md:px-8 max-sm:px-4">
          <p className="hc:text-black text-[1.6rem] text-black/60">
            {`${totalResults} Results found for "${query || COLLECTION_TYPES[activeTab].label || "All"}"`}
          </p>

          <div className="results-block">
            {isLoading ? (
              <div className="mt-16 grid grid-cols-3 gap-x-20 gap-y-12 max-lg:grid-cols-2 max-lg:gap-10 max-sm:mt-8 max-sm:grid-cols-1 max-sm:gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <SearchCardSkeleton
                    key={`vacancy-row-${index}`}
                    index={index}
                  />
                ))}
              </div>
            ) : noResultsFound ? (
              <div className="no-results rounded-6xl bg-grey mt-16 h-[43.5rem] p-8 max-sm:h-[40rem]">
                <div className="mx-auto flex size-full max-w-[31rem] flex-col items-center justify-center space-y-10 text-center">
                  <p className="text-black-100 text-5xl font-light">
                    {"No Results Found"}
                  </p>
                  <p className="text-black-100/60 text-[1.6rem] font-light">
                    {"No Results Found Description"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-16 grid grid-cols-3 gap-x-20 gap-y-12 max-lg:grid-cols-2 max-lg:gap-10 max-sm:mt-8 max-sm:grid-cols-1 max-sm:gap-4">
                {searchResults?.map((result, index) => {
                  let ParentPage = result?.ParentPage;

                  if (result?.ParentPages?.length) {
                    const parentRoute =
                      result?.entity == "api::project.project"
                        ? "service-project-listing"
                        : "business-project-listing";
                    ParentPage = result?.ParentPages?.find(
                      (pp: any) => pp?.PageType === parentRoute,
                    );
                  }

                  const routeURL = getRouteURL(result?.PageURL, ParentPage);

                  const breadcrumbs = [
                    { title: "Home", url: "/" },
                    ...getTitleBreadcrumbs(ParentPage),
                  ];

                  return (
                    <SearchCard
                      key={`search-item-${index}`}
                      routeURL={routeURL}
                      result={result}
                      breadcrumbs={breadcrumbs}
                    />
                  );
                })}
              </div>
            )}

            {hasMorePages && !isLoading ? (
              <LoadMore onClick={handleLoadMore} />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchListing;
