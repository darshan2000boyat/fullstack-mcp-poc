import {
  HeroSectionBlockProps,
  KeyFeaturesBlockProps,
  LetUsHelpYouBlockProps,
  MeetLeadersBlockProps,
  PageBlock,
  StartFundraiseBlockProps,
  SuccessNumbersBlockProps,
  TestBlockProps,
  TickerMessageBlockProps,
  UrgentAppealsBlockProps,
  WhatsNewBlockProps,
  WhyJoodBlockProps,
} from "@/typings/blocks";
import { DynamicZoneProps } from "@/typings/common";
import { RouteProps } from "@/typings/strapi";
import dynamic from "next/dynamic";

const TestBlock = dynamic(() => import("@/components/blocks/TestBlock"));
const HeroSection = dynamic(() => import("@/components/blocks/HeroSection"));
const WhyJood = dynamic(() => import("@/components/blocks/WhyJood"));
const LetUsHelpYou = dynamic(() => import("@/components/blocks/LetUsHelpYou"));
const UrgentAppeals = dynamic(() => import("@/components/blocks/UrgentAppeals"));
const KeyFeatures = dynamic(() => import("@/components/blocks/KeyFeatures"));
const SuccessNumbers = dynamic(() => import("@/components/blocks/SuccessNumbers"));
const StartFundraise = dynamic(() => import("@/components/blocks/StartFundraise"));
const WhatsNew = dynamic(() => import("@/components/blocks/WhatsNew"));
const MeetLeaders = dynamic(() => import("@/components/blocks/MeetLeaders"));
const TickerMessage = dynamic(() => import("@/components/blocks/TickerMessage"));

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
      case "blocks.hero-section":
        return (
          <HeroSection
            block={block as HeroSectionBlockProps}
            key={`block-${index}`}
          />
        );
      case "blocks.why-jood":
        return (
          <WhyJood block={block as WhyJoodBlockProps} key={`block-${index}`} />
        );
      case "blocks.let-us-help-you":
        return (
          <LetUsHelpYou block={block as LetUsHelpYouBlockProps} key={`block-${index}`} />
        );
      case "blocks.urgent-appeals":
        return (
          <UrgentAppeals block={block as UrgentAppealsBlockProps} key={`block-${index}`} />
        );
      case "blocks.key-features":
        return (
          <KeyFeatures block={block as KeyFeaturesBlockProps} key={`block-${index}`} />
        );
      case "blocks.success-numbers":
        return (
          <SuccessNumbers block={block as SuccessNumbersBlockProps} key={`block-${index}`} />
        );
      case "blocks.start-fundraise":
        return (
          <StartFundraise block={block as StartFundraiseBlockProps} key={`block-${index}`} />
        );
      case "blocks.whats-new":
        return (
          <WhatsNew block={block as WhatsNewBlockProps} key={`block-${index}`} />
        );
      case "blocks.meet-leaders":
        return (
          <MeetLeaders block={block as MeetLeadersBlockProps} key={`block-${index}`} />
        );
      case "blocks.ticker-message":
        return (
          <TickerMessage block={block as TickerMessageBlockProps} key={`block-${index}`} />
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
  return (
    <>
      {blocks?.map((block, i) => <div key={i}>{getComponent(block, i)}</div>)}
    </>
  );
};

export default FullBlockRendererPages;
