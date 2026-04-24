import {
  PageBlock,
  TestBlockProps,
  HeroBannerProps,
  AboutWithStatsProps,
  PurposeStatementProps,
  BusinessGridProps,
  TestimonialProps,
  NewsGridProps,
  DivisionsProps,
  FootprintMapProps,
  ContactUsProps,
  LetUsHelpYouProps,
} from "@/typings/blocks";
import { DynamicZoneProps } from "@/typings/common";
import { RouteProps } from "@/typings/strapi";
import dynamic from "next/dynamic";

const TestBlock = dynamic(() => import("@/components/blocks/TestBlock"));
const AboutWithStats = dynamic(
  () => import("@/components/blocks/AboutWithStats"),
);
const Divisions = dynamic(() => import("@/components/blocks/Divisions"));
const FootprintMap = dynamic(() => import("@/components/blocks/FootprintMap"));
const ContactUs = dynamic(() => import("@/components/blocks/ContactUs"));
const LetUsHelpYou = dynamic(
  () => import("@/components/blocks/LetUsHelpYou"),
);

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
      case "blocks.about-with-stats":
        return (
          <AboutWithStats
            block={block as AboutWithStatsProps}
            key={`block-${index}`}
          />
        );
      case "blocks.divisions":
        return (
          <Divisions
            block={block as DivisionsProps}
            key={`block-${index}`}
          />
        );
      case "blocks.footprint-map":
        return (
          <FootprintMap
            block={block as FootprintMapProps}
            key={`block-${index}`}
          />
        );
      case "blocks.contact-us":
        return (
          <ContactUs
            block={block as ContactUsProps}
            key={`block-${index}`}
          />
        );
      case "blocks.let-us-help-you":
        return (
          <LetUsHelpYou
            block={block as LetUsHelpYouProps}
            key={`block-${index}`}
          />
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
