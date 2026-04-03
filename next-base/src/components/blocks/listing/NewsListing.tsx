"use client";
import { Button } from "@/components/ui/button";
import { queryToString } from "@/lib/utils";
import { PageBlock } from "@/typings/blocks";
import { useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
// import { NewsAttributes, NewsCategoryAttributes } from "@/typings/news";
import NewsCard from "@/components/elements/cards/News";
import SearchInput from "@/components/ui/searchInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { APIResponse } from "@/typings/common";
import { NewsDataDatum } from "@/typings/news";

const NewsListing = ({ block }: PageBlock) => {
  const PAGE_SIZE = 1;
  const SORT_OPTIONS = [
    {
      title: "Latest First",
      value: "PublishedDate:desc",
    },
    {
      title: "Oldest First",
      value: "PublishedDate:asc",
    },
  ] as const;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0].value);

  const { data, error, size, setSize, isLoading } = useSWRInfinite<
    APIResponse<any>
  >(
    (pageIndex) => {
      const params = queryToString({
        page: pageIndex + 1,
        pageSize: PAGE_SIZE,
        query: searchTerm,
        category: selectedCategory,
        sort: sortBy,
      });

      return `/api/articles?${params}`;
    },

    {
      revalidateFirstPage: false,
      keepPreviousData: true,
    },
  );

  const { data: categories } = useSWR(`/api/articles/categories`);

  if (error) return <div>Error loading data</div>;
  if (!data && isLoading)
    return <div className="mb-36 text-center">Loading...</div>;
  const articles = data?.flatMap((e) => e?.data?.data);

  const totalPages =
    data?.[data.length - 1]?.data?.meta?.pagination?.pageCount || 0;
  const hasMorePages = size < totalPages;

  return (
    <section className="px-12">
      <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-32">
        <SearchInput
          className="w-full"
          onSearch={(e) => setSearchTerm(e)}
          placeholder="Search articles"
        />
        <div className="flex items-center gap-5">
          <Select
            value={selectedCategory}
            onValueChange={(e) => setSelectedCategory(e === "all" ? "" : e)}
            key={selectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.data?.data?.map((category: any) => (
                <SelectItem key={category.id} value={category.attributes.Key}>
                  {category.attributes.Title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(e) => setSortBy(e)}
            key={sortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS?.map((sortOption, id) => (
                <SelectItem key={id} value={sortOption.value}>
                  {sortOption.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="small mb-12">{totalPages} results found</p>
      <div className="-mx-4 mb-12 flex flex-wrap">
        {articles?.map((article: NewsDataDatum, i) => (
          <div className="w-full px-4 sm:w-1/2 lg:w-1/3" key={i}>
            <NewsCard key={i} data={article} />
          </div>
        ))}
      </div>
      {hasMorePages && (
        <div className="mb-20 text-center">
          <Button size="lg" onClick={() => setSize(size + 1)}>
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default NewsListing;
