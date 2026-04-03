import type { Attribute, Schema } from '@strapi/strapi';

export interface BlocksContent extends Schema.Component {
  collectionName: 'components_blocks_contents';
  info: {
    description: '';
    displayName: 'Content';
    icon: 'folder';
  };
  attributes: {
    content: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'rich';
        }
      >;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface BlocksGoogleMap extends Schema.Component {
  collectionName: 'components_blocks_google_maps';
  info: {
    description: '';
    displayName: 'Google Map';
    icon: 'pinMap';
  };
  attributes: {
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    Latitude: Attribute.String;
    Longitude: Attribute.String;
  };
}

export interface BlocksHeroSection extends Schema.Component {
  collectionName: 'components_blocks_hero_sections';
  info: {
    description: 'Full-screen hero with stats, featured campaign card, and explore category tiles';
    displayName: 'Hero Section';
    icon: 'layout';
  };
  attributes: {
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    exploreTiles: Attribute.JSON;
    featuredCampaignContributors: Attribute.String;
    featuredCampaignGoalAmount: Attribute.String;
    featuredCampaignImage: Attribute.Media<'images'>;
    featuredCampaignRaisedAmount: Attribute.String;
    featuredCampaignTag: Attribute.String;
    featuredCampaignTitle: Attribute.String;
    stats: Attribute.JSON;
  };
}

export interface BlocksKeyFeatures extends Schema.Component {
  collectionName: 'components_blocks_key_features';
  info: {
    description: 'Full-bleed background image with feature list and description CTA';
    displayName: 'Key Features';
    icon: 'star';
  };
  attributes: {
    backgroundImage: Attribute.Media<'images'>;
    ctaLabel: Attribute.String;
    description: Attribute.Text;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    features: Attribute.JSON;
    sectionLabel: Attribute.String;
  };
}

export interface BlocksLetUsHelpYou extends Schema.Component {
  collectionName: 'components_blocks_let_us_help_yous';
  info: {
    description: 'Interactive contribution selector with underlined dropdowns and CTA';
    displayName: 'Let Us Help You';
    icon: 'puzzle';
  };
  attributes: {
    amountOptions: Attribute.JSON;
    causeOptions: Attribute.JSON;
    ctaLabel: Attribute.String;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    frequencyOptions: Attribute.JSON;
    prefixText: Attribute.String;
    suffixText: Attribute.String;
  };
}

export interface BlocksMeetLeaders extends Schema.Component {
  collectionName: 'components_blocks_meet_leaders';
  info: {
    description: 'Left text block with CTAs, right stacked leaderboard rank cards';
    displayName: 'Meet Leaders';
    icon: 'user';
  };
  attributes: {
    description: Attribute.Text;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    eyebrow: Attribute.String;
    heading: Attribute.String;
    leaders: Attribute.JSON;
    primaryCtaLabel: Attribute.String;
    secondaryCtaLabel: Attribute.String;
  };
}

export interface BlocksNewsListing extends Schema.Component {
  collectionName: 'components_blocks_news_listings';
  info: {
    displayName: 'NewsListing';
    icon: 'apps';
  };
  attributes: {
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    searchPlaceholder: Attribute.String;
  };
}

export interface BlocksStartFundraise extends Schema.Component {
  collectionName: 'components_blocks_start_fundraises';
  info: {
    description: 'Centered heading, phone mockup image, floating icon badges, and CTA';
    displayName: 'Start Fundraise';
    icon: 'rocket';
  };
  attributes: {
    ctaLabel: Attribute.String;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    heading: Attribute.String;
    iconBadges: Attribute.JSON;
    phoneImage: Attribute.Media<'images'>;
  };
}

export interface BlocksSuccessNumbers extends Schema.Component {
  collectionName: 'components_blocks_success_numbers';
  info: {
    description: 'Headline with large number display, profile avatars, and app store buttons';
    displayName: 'Success Numbers';
    icon: 'chart-line';
  };
  attributes: {
    appStoreUrl: Attribute.String;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    googlePlayUrl: Attribute.String;
    heading: Attribute.String;
    highlightedNumber: Attribute.String;
    profileImages: Attribute.Media<'images', true>;
    subheading: Attribute.String;
  };
}

export interface BlocksTickerMessage extends Schema.Component {
  collectionName: 'components_blocks_ticker_messages';
  info: {
    description: 'Scrolling salmonOrange ticker strip with repeating text';
    displayName: 'Ticker Message';
    icon: 'arrow-right';
  };
  attributes: {
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    message: Attribute.String;
  };
}

export interface BlocksUrgentAppeals extends Schema.Component {
  collectionName: 'components_blocks_urgent_appeals';
  info: {
    description: 'Section heading with slider nav and a grid of campaign cards';
    displayName: 'Urgent Appeals';
    icon: 'bell';
  };
  attributes: {
    campaigns: Attribute.JSON;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    exploreAllLabel: Attribute.String;
    heading: Attribute.String;
  };
}

export interface BlocksWhatsNew extends Schema.Component {
  collectionName: 'components_blocks_whats_news';
  info: {
    description: 'Label, split heading, slider nav, and 3 article cards';
    displayName: 'Whats New';
    icon: 'newspaper';
  };
  attributes: {
    articles: Attribute.JSON;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    exploreAllLabel: Attribute.String;
    headingLine1: Attribute.String;
    headingLine2: Attribute.String;
    label: Attribute.String;
  };
}

export interface BlocksWhyJood extends Schema.Component {
  collectionName: 'components_blocks_why_joods';
  info: {
    description: 'Eyebrow + heading with 4 category cards and a progress bar slider';
    displayName: 'Why Jood';
    icon: 'heart';
  };
  attributes: {
    categories: Attribute.JSON;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    eyebrow: Attribute.String;
    heading: Attribute.String;
  };
}

export interface ElementsBreadcrumb extends Schema.Component {
  collectionName: 'components_elements_breadcrumbs';
  info: {
    description: '';
    displayName: 'breadcrumb';
  };
  attributes: {
    BreadcrumbPage: Attribute.Relation<
      'elements.breadcrumb',
      'oneToOne',
      'api::sitemap.sitemap'
    >;
  };
}

export interface ElementsTest extends Schema.Component {
  collectionName: 'components_elements_tests';
  info: {
    displayName: 'test';
  };
  attributes: {
    article_category: Attribute.Relation<
      'elements.test',
      'oneToOne',
      'api::article-category.article-category'
    >;
    asd: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Attribute.String;
  };
}

export interface FormFormBlock extends Schema.Component {
  collectionName: 'components_form_form_blocks';
  info: {
    displayName: 'Form Block';
    icon: 'message';
  };
  attributes: {
    formType: Attribute.Relation<
      'form.form-block',
      'oneToOne',
      'plugin::strapi-v4-form-builder.form-type'
    >;
  };
}

export interface FormFormFields extends Schema.Component {
  collectionName: 'components_form_form_fields';
  info: {
    displayName: 'Form Fields';
    icon: 'bulletList';
  };
  attributes: {
    customErrorMessage: Attribute.String;
    fieldType: Attribute.Enumeration<
      [
        'text',
        'number',
        'email',
        'textarea',
        'select',
        'upload',
        'date',
        'datetime',
        'time',
        'checkbox',
        'radio',
        'hidden',
        'phone',
        'rating',
        'multiselect',
        'country',
        'region',
        'terms'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'text'>;
    formOrder: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    hideField: Attribute.Boolean & Attribute.DefaultTo<false>;
    hideLabel: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    initailValue: Attribute.String;
    label: Attribute.String;
    max: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    maxFiles: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    min: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    parentSubmissionKey: Attribute.String;
    placeholder: Attribute.String;
    prefill: Attribute.String;
    relatedModel: Attribute.String;
    required: Attribute.Boolean & Attribute.DefaultTo<false>;
    selectOptions: Attribute.Component<'form.select-options', true>;
    sendInAdminEmail: Attribute.Boolean & Attribute.DefaultTo<false>;
    submissionKey: Attribute.String;
    width: Attribute.Enumeration<['w-100%', 'w-50%', 'w-25%']> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<'w-100%'>;
  };
}

export interface FormFormFieldsSubmission extends Schema.Component {
  collectionName: 'components_form_form_fields_submissions';
  info: {
    displayName: 'Form Fields Submission';
    icon: 'check';
  };
  attributes: {
    fieldType: Attribute.String;
    files: Attribute.Media<'images' | 'files', true>;
    key: Attribute.String;
    value: Attribute.Text;
  };
}

export interface FormRedirectButtons extends Schema.Component {
  collectionName: 'components_form_redirect_buttons';
  info: {
    displayName: 'Redirect Buttons';
    icon: 'bulletList';
  };
  attributes: {
    buttonExternalUrl: Attribute.String;
    buttonRoute: Attribute.String;
    buttonText: Attribute.String;
    icon: Attribute.Media<'images' | 'files'>;
    iframe: Attribute.Text;
    placeholder: Attribute.String;
  };
}

export interface FormSelectOptions extends Schema.Component {
  collectionName: 'components_form_select_options';
  info: {
    displayName: 'Select Options';
    icon: 'apps';
  };
  attributes: {
    emailToOverride: Attribute.String;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    isLoggedIn: Attribute.Boolean & Attribute.DefaultTo<false>;
    label: Attribute.String & Attribute.Required;
    value: Attribute.String;
  };
}

export interface GlobalSearchGlobalSearchModels extends Schema.Component {
  collectionName: 'components_global_search_global_search_models';
  info: {
    displayName: 'Global Search Models';
    icon: 'earth';
  };
  attributes: {
    modelQuery: Attribute.JSON;
    modelTitle: Attribute.String;
    modelUid: Attribute.String;
  };
}

export interface HeaderExploreHeaderBlock extends Schema.Component {
  collectionName: 'components_header_explore_header_blocks';
  info: {
    description: '';
    displayName: 'Explore Header Blocks';
  };
  attributes: {
    ActionType: Attribute.Enumeration<['navigation', 'web_link']>;
    BlockIdentifier: Attribute.String;
    ButtonText: Attribute.String;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    ImgUrl: Attribute.Media<'images'>;
    Link: Attribute.String;
    MediaType: Attribute.Enumeration<['image', 'video']> &
      Attribute.DefaultTo<'image'>;
    Route: Attribute.String;
    Title: Attribute.String;
    VideoUrl: Attribute.Media<'videos'>;
  };
}

export interface HeaderHeader extends Schema.Component {
  collectionName: 'components_header_headers';
  info: {
    description: '';
    displayName: 'Banner';
  };
  attributes: {
    Banner: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    Subtitle: Attribute.String;
    Title: Attribute.String;
  };
}

export interface SharedCommon extends Schema.Component {
  collectionName: 'components_shared_commons';
  info: {
    displayName: 'Common';
    icon: 'bulletList';
  };
  attributes: {
    BlockID: Attribute.String;
    HideBlock: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Attribute.String;
    keywords: Attribute.Text;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Attribute.String;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Attribute.String;
    structuredData: Attribute.JSON;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.content': BlocksContent;
      'blocks.google-map': BlocksGoogleMap;
      'blocks.hero-section': BlocksHeroSection;
      'blocks.key-features': BlocksKeyFeatures;
      'blocks.let-us-help-you': BlocksLetUsHelpYou;
      'blocks.meet-leaders': BlocksMeetLeaders;
      'blocks.news-listing': BlocksNewsListing;
      'blocks.start-fundraise': BlocksStartFundraise;
      'blocks.success-numbers': BlocksSuccessNumbers;
      'blocks.ticker-message': BlocksTickerMessage;
      'blocks.urgent-appeals': BlocksUrgentAppeals;
      'blocks.whats-new': BlocksWhatsNew;
      'blocks.why-jood': BlocksWhyJood;
      'elements.breadcrumb': ElementsBreadcrumb;
      'elements.test': ElementsTest;
      'form.form-block': FormFormBlock;
      'form.form-fields': FormFormFields;
      'form.form-fields-submission': FormFormFieldsSubmission;
      'form.redirect-buttons': FormRedirectButtons;
      'form.select-options': FormSelectOptions;
      'global-search.global-search-models': GlobalSearchGlobalSearchModels;
      'header.explore-header-block': HeaderExploreHeaderBlock;
      'header.header': HeaderHeader;
      'shared.common': SharedCommon;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
