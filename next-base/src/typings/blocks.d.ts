import { CommonElement, DynamicZoneProps, ImageFragment, MediaProps } from "./common";
import { SitemapPageData } from "./strapi";

export interface PageBlock {
  block?: DynamicZoneProps;
  page?: SitemapPageData;
}

export interface TestBlockProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Title: string;
  Media: MediaProps;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroExploreTile {
  title: string;
  backgroundColor: string;
  image?: ImageFragment;
}

export interface HeroSectionBlockProps {
  id?: number;
  __component?: string;
  stats?: HeroStat[];
  featuredCampaignTag?: string;
  featuredCampaignTitle?: string;
  featuredCampaignImage?: ImageFragment;
  featuredCampaignContributors?: string;
  featuredCampaignRaisedAmount?: string;
  featuredCampaignGoalAmount?: string;
  exploreTiles?: HeroExploreTile[];
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Why Jood
// ---------------------------------------------------------------------------

export interface WhyJoodCategory {
  label: string;
  icon?: string;
  backgroundColor?: string;
  raisedAmount?: string;
  progress?: number;
}

export interface WhyJoodBlockProps {
  id?: number;
  __component?: string;
  eyebrow?: string;
  heading?: string;
  categories?: WhyJoodCategory[];
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Let Us Help You
// ---------------------------------------------------------------------------

export interface LetUsHelpYouBlockProps {
  id?: number;
  __component?: string;
  prefixText?: string;
  suffixText?: string;
  amountOptions?: string[];
  causeOptions?: string[];
  frequencyOptions?: string[];
  ctaLabel?: string;
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Urgent Appeals
// ---------------------------------------------------------------------------

export interface UrgentAppealsCampaign {
  tag?: string;
  title?: string;
  imageUrl?: string;
  raisedAmount?: string;
  goalAmount?: string;
  contributors?: string;
}

export interface UrgentAppealsBlockProps {
  id?: number;
  __component?: string;
  heading?: string;
  exploreAllLabel?: string;
  campaigns?: UrgentAppealsCampaign[];
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Key Features
// ---------------------------------------------------------------------------

export interface KeyFeaturesBlockProps {
  id?: number;
  __component?: string;
  sectionLabel?: string;
  backgroundImage?: ImageFragment;
  features?: string[];
  description?: string;
  ctaLabel?: string;
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Success Numbers
// ---------------------------------------------------------------------------

export interface SuccessNumbersBlockProps {
  id?: number;
  __component?: string;
  heading?: string;
  highlightedNumber?: string;
  subheading?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  profileImages?: ImageFragment[];
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Start Fundraise
// ---------------------------------------------------------------------------

export interface IconBadge {
  icon?: string;
  backgroundColor?: string;
  label?: string;
}

export interface StartFundraiseBlockProps {
  id?: number;
  __component?: string;
  heading?: string;
  phoneImage?: ImageFragment;
  iconBadges?: IconBadge[];
  ctaLabel?: string;
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Whats New
// ---------------------------------------------------------------------------

export interface WhatsNewArticle {
  imageUrl?: string;
  tag?: string;
  title?: string;
  date?: string;
}

export interface WhatsNewBlockProps {
  id?: number;
  __component?: string;
  label?: string;
  headingLine1?: string;
  headingLine2?: string;
  exploreAllLabel?: string;
  articles?: WhatsNewArticle[];
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Meet Leaders
// ---------------------------------------------------------------------------

export interface LeaderCard {
  rank?: number;
  name?: string;
  location?: string;
  amount?: string;
  backgroundColor?: string;
  avatarUrl?: string;
}

export interface MeetLeadersBlockProps {
  id?: number;
  __component?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  leaders?: LeaderCard[];
  Disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Ticker Message
// ---------------------------------------------------------------------------

export interface TickerMessageBlockProps {
  id?: number;
  __component?: string;
  message?: string;
  Disabled?: boolean;
}
