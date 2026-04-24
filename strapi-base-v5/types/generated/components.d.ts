import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAboutWithStats extends Struct.ComponentSchema {
  collectionName: 'components_blocks_about_with_stats';
  info: {
    displayName: 'About With Stats';
    icon: 'chartCircle';
  };
  attributes: {
    Common: Schema.Attribute.Component<'elements.common', false>;
    Description: Schema.Attribute.Text;
    Eyebrow: Schema.Attribute.String;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Link: Schema.Attribute.Component<'elements.link', false>;
    Stats: Schema.Attribute.Component<'elements.stat-item', true>;
  };
}

export interface BlocksContactUs extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_us';
  info: {
    description: 'Contact Us hero block with heading, contact info grid, social links, address card, and map panel.';
    displayName: 'Contact Us';
    icon: 'envelop';
  };
  attributes: {
    AddressCTA: Schema.Attribute.Component<'elements.link', false>;
    AddressImage: Schema.Attribute.Component<
      'elements.image-video-item',
      false
    >;
    AddressLocationLabel: Schema.Attribute.String;
    AddressText: Schema.Attribute.Text;
    Common: Schema.Attribute.Component<'elements.common', false>;
    ContactItems: Schema.Attribute.Component<
      'elements.contact-info-item',
      true
    >;
    DecorativeImage: Schema.Attribute.Component<
      'elements.image-video-item',
      false
    >;
    FollowUsLabel: Schema.Attribute.String;
    Heading: Schema.Attribute.String;
    MapImage: Schema.Attribute.Component<'elements.image-video-item', false>;
    MapLink: Schema.Attribute.Component<'elements.link', false>;
    SocialLinks: Schema.Attribute.Component<'elements.link', true>;
  };
}

export interface BlocksDivisions extends Struct.ComponentSchema {
  collectionName: 'components_blocks_divisions';
  info: {
    description: 'Division showcase block with a large image, dark gradient overlay card, and sibling-division tab navigation';
    displayName: 'Divisions';
  };
  attributes: {
    Common: Schema.Attribute.Component<'elements.common', false>;
    Description: Schema.Attribute.Text;
    IndexText: Schema.Attribute.String;
    Media: Schema.Attribute.Component<'elements.image-video-item', false>;
    Tabs: Schema.Attribute.Component<'elements.division-tab', true>;
    Title: Schema.Attribute.String;
  };
}

export interface BlocksFootprintMap extends Struct.ComponentSchema {
  collectionName: 'components_blocks_footprint_maps';
  info: {
    description: 'Regional footprint block with a dotted world-map base and highlighted country overlay, plus a list of country chips.';
    displayName: 'Footprint Map';
    icon: 'earth';
  };
  attributes: {
    Common: Schema.Attribute.Component<'elements.common', false>;
    Countries: Schema.Attribute.Component<'elements.division-tab', true>;
    Subtitle: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface BlocksGlobalArea extends Struct.ComponentSchema {
  collectionName: 'components_blocks_global_areas';
  info: {
    displayName: 'Global Area';
    icon: 'cog';
  };
  attributes: {
    Common: Schema.Attribute.Component<'elements.common', false>;
    Stacks: Schema.Attribute.Relation<
      'oneToOne',
      'api::stacks-and-global-area.stacks-and-global-area'
    >;
  };
}

export interface BlocksLetUsHelpYou extends Struct.ComponentSchema {
  collectionName: 'components_blocks_let_us_help_you';
  info: {
    description: 'Teal visit-planner banner with eyebrow, three inline dropdown selectors (group, duration, date), explore CTA, background image and decorative peacock.';
    displayName: 'Let Us Help You';
    icon: 'filter';
  };
  attributes: {
    BackgroundImage: Schema.Attribute.Component<
      'elements.image-video-item',
      false
    >;
    Common: Schema.Attribute.Component<'elements.common', false>;
    Connector1: Schema.Attribute.String;
    Connector2: Schema.Attribute.String;
    CTA: Schema.Attribute.Component<'elements.link', false>;
    DateSelector: Schema.Attribute.Component<'elements.visit-selector', false>;
    DecorativeImage: Schema.Attribute.Component<
      'elements.image-video-item',
      false
    >;
    DurationSelector: Schema.Attribute.Component<
      'elements.visit-selector',
      false
    >;
    Eyebrow: Schema.Attribute.String;
    GroupSelector: Schema.Attribute.Component<'elements.visit-selector', false>;
    HeadingPrefix: Schema.Attribute.String;
  };
}

export interface BlocksTestBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_test_blocks';
  info: {
    displayName: 'Test Block';
    icon: 'landscape';
    thumbnail: '/components/test.jpg';
  };
  attributes: {
    Common: Schema.Attribute.Component<'elements.common', false>;
    Media: Schema.Attribute.Component<'elements.image-video-item', false>;
    Title: Schema.Attribute.String;
  };
}

export interface ElementsCommon extends Struct.ComponentSchema {
  collectionName: 'components_elements_commons';
  info: {
    displayName: 'Common';
    icon: 'cog';
  };
  attributes: {
    BlockID: Schema.Attribute.String;
    HideBlock: Schema.Attribute.Boolean;
    NoBottomSpace: Schema.Attribute.Boolean;
  };
}

export interface ElementsContactInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_contact_info_items';
  info: {
    displayName: 'Contact Info Item';
    icon: 'phone';
  };
  attributes: {
    IconType: Schema.Attribute.Enumeration<
      ['email', 'phone', 'timings', 'location']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'email'>;
    Label: Schema.Attribute.String;
    Underline: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Url: Schema.Attribute.String;
    Value: Schema.Attribute.String;
  };
}

export interface ElementsDivisionTab extends Struct.ComponentSchema {
  collectionName: 'components_elements_division_tabs';
  info: {
    displayName: 'Division Tab';
    icon: 'bulletList';
  };
  attributes: {
    IsActive: Schema.Attribute.Boolean;
    Label: Schema.Attribute.String;
  };
}

export interface ElementsImageVideoItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_image_video_items';
  info: {
    displayName: 'Image-Video Item';
    icon: 'bulletList';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    MobileImage: Schema.Attribute.Media<'images'>;
    MobileVideoURL: Schema.Attribute.String;
    VideoUrl: Schema.Attribute.String;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    Title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['internal', 'external']>;
    url: Schema.Attribute.String;
  };
}

export interface ElementsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_stat_items';
  info: {
    displayName: 'Stat Item';
    icon: 'chartBubble';
  };
  attributes: {
    Label: Schema.Attribute.String;
    Number: Schema.Attribute.String;
  };
}

export interface ElementsStickyCardsItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_sticky_cards_items';
  info: {
    displayName: 'Card Item';
    icon: 'bulletList';
  };
  attributes: {
    Color: Schema.Attribute.Enumeration<
      ['RoseGold', 'Blue', 'DarkBlue', 'Orange']
    > &
      Schema.Attribute.DefaultTo<'RoseGold'>;
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Text: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface ElementsTeamItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_team_items';
  info: {
    displayName: 'Team Item';
    icon: 'user';
  };
  attributes: {
    CalendarCode: Schema.Attribute.Text;
    Designation: Schema.Attribute.String;
    Email: Schema.Attribute.Email;
    Name: Schema.Attribute.String;
    PhoneNumber: Schema.Attribute.String;
    Profile: Schema.Attribute.Media<'images'>;
  };
}

export interface ElementsVisitOption extends Struct.ComponentSchema {
  collectionName: 'components_elements_visit_options';
  info: {
    displayName: 'Visit Option';
    icon: 'bulletList';
  };
  attributes: {
    Label: Schema.Attribute.String & Schema.Attribute.Required;
    Value: Schema.Attribute.String;
  };
}

export interface ElementsVisitSelector extends Struct.ComponentSchema {
  collectionName: 'components_elements_visit_selectors';
  info: {
    description: 'Inline dropdown selector used inside the Let Us Help You heading.';
    displayName: 'Visit Selector';
    icon: 'filter';
  };
  attributes: {
    Options: Schema.Attribute.Component<'elements.visit-option', true>;
    Placeholder: Schema.Attribute.String;
    Variant: Schema.Attribute.Enumeration<['primary', 'accent']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface FooterLinksGroup extends Struct.ComponentSchema {
  collectionName: 'components_footer_links_groups';
  info: {
    displayName: 'Links group';
    icon: 'bulletList';
  };
  attributes: {
    HiddenOnMobile: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    Items: Schema.Attribute.Component<'elements.link', true>;
    link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface FooterSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    displayName: 'Social Links';
    icon: 'twitter';
  };
  attributes: {
    SocialLinks: Schema.Attribute.Relation<
      'oneToMany',
      'api::social-link.social-link'
    >;
    Title: Schema.Attribute.String;
  };
}

export interface FormDependency extends Struct.ComponentSchema {
  collectionName: 'components_form_dependencies';
  info: {
    displayName: 'Dependency';
    icon: 'connector';
  };
  attributes: {
    action: Schema.Attribute.Enumeration<['show', 'hide']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'show'>;
    form_field: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::strapi-formidable.form-field'
    >;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FormOptions extends Struct.ComponentSchema {
  collectionName: 'components_form_options';
  info: {
    displayName: 'Options';
    icon: 'bulletList';
  };
  attributes: {
    form_emails: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::strapi-formidable.form-email'
    >;
    is_default: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GlobalConfig extends Struct.ComponentSchema {
  collectionName: 'components_global_configs';
  info: {
    displayName: 'Config';
    icon: 'lock';
  };
  attributes: {
    ConfigKey: Schema.Attribute.String;
    ConfigValue: Schema.Attribute.Text;
  };
}

export interface GlobalFormAfterSubmission extends Struct.ComponentSchema {
  collectionName: 'components_global_form_after_submissions';
  info: {
    displayName: 'Form After Submission';
    icon: 'link';
  };
  attributes: {
    Link: Schema.Attribute.String;
    Message: Schema.Attribute.Text;
    Type: Schema.Attribute.Enumeration<['message', 'link']>;
  };
}

export interface GlobalFormEmailTemplates extends Struct.ComponentSchema {
  collectionName: 'components_global_form_email_templates';
  info: {
    displayName: 'Form Email Templates';
    icon: 'envelop';
  };
  attributes: {
    EmailSubject: Schema.Attribute.String;
    Enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    RecipientEmail: Schema.Attribute.String;
    SenderEmail: Schema.Attribute.String;
  };
}

export interface GlobalFormFields extends Struct.ComponentSchema {
  collectionName: 'components_global_form_fields';
  info: {
    description: '';
    displayName: 'Form Fields';
    icon: 'bulletList';
  };
  attributes: {
    Label: Schema.Attribute.String;
    Mandatory: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    Placeholder: Schema.Attribute.String;
    SelectOptions: Schema.Attribute.Component<
      'global.form-select-options',
      true
    >;
    SubmissionKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    Type: Schema.Attribute.Enumeration<
      [
        'text',
        'number',
        'email',
        'textarea',
        'select',
        'upload',
        'checkbox',
        'radio',
        'hidden',
        'phone',
        'country',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
    Validations: Schema.Attribute.Component<'global.form-validations', false>;
  };
}

export interface GlobalFormSelectOptions extends Struct.ComponentSchema {
  collectionName: 'components_global_form_select_options';
  info: {
    displayName: 'Form Select Options';
    icon: 'bulletList';
  };
  attributes: {
    Label: Schema.Attribute.String & Schema.Attribute.Required;
    SendToEmail: Schema.Attribute.String;
    Value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GlobalFormSubmissions extends Struct.ComponentSchema {
  collectionName: 'components_global_form_submissions';
  info: {
    description: '';
    displayName: 'Form Submissions';
    icon: 'information';
  };
  attributes: {
    Label: Schema.Attribute.String;
    SubmissionKey: Schema.Attribute.String;
    Type: Schema.Attribute.String;
    Value: Schema.Attribute.String;
  };
}

export interface GlobalFormValidations extends Struct.ComponentSchema {
  collectionName: 'components_global_form_validations';
  info: {
    displayName: 'Form Validations';
    icon: 'cursor';
  };
  attributes: {
    ErrorMessage: Schema.Attribute.String;
    MaxFiles: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface GlobalSeo extends Struct.ComponentSchema {
  collectionName: 'components_global_seos';
  info: {
    description: '';
    displayName: 'SEO';
    icon: 'dashboard';
  };
  attributes: {
    MetaDescription: Schema.Attribute.Text;
    MetaImage: Schema.Attribute.Media<'images'>;
    MetaRobots: Schema.Attribute.String;
    MetaTitle: Schema.Attribute.String;
    StructuredData: Schema.Attribute.JSON;
  };
}

export interface HomeHomePageConfig extends Struct.ComponentSchema {
  collectionName: 'components_home_home_page_configs';
  info: {
    displayName: 'Home Page Config';
    icon: 'apps';
  };
  attributes: {
    AboutBannerSubtitle: Schema.Attribute.Text;
    AboutBannerTitle: Schema.Attribute.Text;
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.about-with-stats': BlocksAboutWithStats;
      'blocks.contact-us': BlocksContactUs;
      'blocks.divisions': BlocksDivisions;
      'blocks.footprint-map': BlocksFootprintMap;
      'blocks.global-area': BlocksGlobalArea;
      'blocks.let-us-help-you': BlocksLetUsHelpYou;
      'blocks.test-block': BlocksTestBlock;
      'elements.common': ElementsCommon;
      'elements.contact-info-item': ElementsContactInfoItem;
      'elements.division-tab': ElementsDivisionTab;
      'elements.image-video-item': ElementsImageVideoItem;
      'elements.link': ElementsLink;
      'elements.stat-item': ElementsStatItem;
      'elements.sticky-cards-item': ElementsStickyCardsItem;
      'elements.team-item': ElementsTeamItem;
      'elements.visit-option': ElementsVisitOption;
      'elements.visit-selector': ElementsVisitSelector;
      'footer.links-group': FooterLinksGroup;
      'footer.social-links': FooterSocialLinks;
      'form.dependency': FormDependency;
      'form.options': FormOptions;
      'global.config': GlobalConfig;
      'global.form-after-submission': GlobalFormAfterSubmission;
      'global.form-email-templates': GlobalFormEmailTemplates;
      'global.form-fields': GlobalFormFields;
      'global.form-select-options': GlobalFormSelectOptions;
      'global.form-submissions': GlobalFormSubmissions;
      'global.form-validations': GlobalFormValidations;
      'global.seo': GlobalSeo;
      'home.home-page-config': HomeHomePageConfig;
    }
  }
}
