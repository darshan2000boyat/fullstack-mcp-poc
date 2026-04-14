import {
  PageBlock,
  TestBlockProps,
  HeroBannerProps,
  AboutWithStatsProps,
  PurposeStatementProps,
  BusinessGridProps,
  TestimonialProps,
  NewsGridProps,
} from "@/typings/blocks";
import { DynamicZoneProps } from "@/typings/common";
import { RouteProps } from "@/typings/strapi";
import dynamic from "next/dynamic";

const TestBlock = dynamic(() => import("@/components/blocks/TestBlock"));

interface FullBlockRendererPagesProps {
  blocks?: DynamicZoneProps[];
  page?: PageBlock["page"];
  routes?: RouteProps;
}

const FullBlockRendererPages = async ({
  blocks,
  page,
  routes,
}: FullBlockRendererPagesProps) => {
  const getComponent = (block: DynamicZoneProps, index: number) => {
    switch (block.__component) {
      case "blocks.test-block":
        return (
          <TestBlock block={block as TestBlockProps} key={`block-${index}`} />
        );
      case "blocks.global-area":
        return (
          <FullBlockRendererPages
            blocks={block?.Stacks?.Blocks}
            page={page}
            key={`block-${index}`}
          />
        );
      default:
        return <></>;
    }
  };

  if (!blocks?.length) return null;
  return <>{blocks?.map((block, i) => getComponent(block, i))}</>;
};

export default FullBlockRendererPages;
