import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiArticleCategoryArticleCategory
  extends Schema.CollectionType {
  collectionName: 'article_categories';
  info: {
    description: '';
    displayName: '2.0.1 - Article Category';
    pluralName: 'article-categories';
    singularName: 'article-category';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    _softDeletedAt: Attribute.DateTime & Attribute.Private;
    _softDeletedById: Attribute.Integer & Attribute.Private;
    _softDeletedByType: Attribute.String & Attribute.Private;
    Articles: Attribute.Relation<
      'api::article-category.article-category',
      'oneToMany',
      'api::article.article'
    >;
    CategoryImage: Attribute.Media<'images'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    CategorySlug: Attribute.String &
      Attribute.CustomField<
        'plugin::ab-custom-slug.ab-custom-slug',
        {
          targetField: 'CategoryTitle';
        }
      > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    CategoryTitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article-category.article-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::article-category.article-category',
      'oneToMany',
      'api::article-category.article-category'
    >;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::article-category.article-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    description: '';
    displayName: '2.0.0 - Article';
    pluralName: 'articles';
    singularName: 'article';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    _softDeletedAt: Attribute.DateTime & Attribute.Private;
    _softDeletedById: Attribute.Integer & Attribute.Private;
    _softDeletedByType: Attribute.String & Attribute.Private;
    ArticleCategory: Attribute.Relation<
      'api::article.article',
      'manyToOne',
      'api::article-category.article-category'
    >;
    Components: Attribute.DynamicZone<
      [
        'blocks.content',
        'blocks.news-listing',
        'header.explore-header-block',
        'header.header'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Image: Attribute.Media<'images'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::article.article',
      'oneToMany',
      'api::article.article'
    >;
    PageDescription: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
    PageSlug: Attribute.String &
      Attribute.CustomField<
        'plugin::ab-custom-slug.ab-custom-slug',
        {
          targetField: 'PageTitle';
        }
      > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    PageTitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Attribute.DateTime;
    PublishedDate: Attribute.DateTime &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiConfigConfig extends Schema.CollectionType {
  collectionName: 'configs';
  info: {
    displayName: 'Config';
    pluralName: 'configs';
    singularName: 'config';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::config.config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Key: Attribute.String;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::config.config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Value: Attribute.String;
  };
}

export interface ApiRedirectRedirect extends Schema.CollectionType {
  collectionName: 'redirects';
  info: {
    displayName: 'Redirects';
    pluralName: 'redirects';
    singularName: 'redirect';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::redirect.redirect',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    destinationPath: Attribute.String & Attribute.Required;
    permanent: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    sourcePath: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::redirect.redirect',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRemoteConfigRemoteConfig extends Schema.SingleType {
  collectionName: 'remote_configs';
  info: {
    displayName: 'Remote Config';
    pluralName: 'remote-configs';
    singularName: 'remote-config';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::remote-config.remote-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    FooterTrackingCodes: Attribute.Text;
    GTMCode: Attribute.String;
    HeaderTrackingCodes: Attribute.Text;
    publishedAt: Attribute.DateTime;
    RouteModels: Attribute.JSON;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::remote-config.remote-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSearchSearch extends Schema.SingleType {
  collectionName: 'searches';
  info: {
    displayName: 'Search';
    pluralName: 'searches';
    singularName: 'search';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::search.search',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    globalSearchModels: Attribute.Component<
      'global-search.global-search-models',
      true
    >;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::search.search',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSitemapSitemap extends Schema.CollectionType {
  collectionName: 'sitemaps';
  info: {
    description: '';
    displayName: '1.0.0 - Sitemap';
    pluralName: 'sitemaps';
    singularName: 'sitemap';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
    webtools: {
      enabled: true;
    };
  };
  attributes: {
    _softDeletedAt: Attribute.DateTime & Attribute.Private;
    _softDeletedById: Attribute.Integer & Attribute.Private;
    _softDeletedByType: Attribute.String & Attribute.Private;
    Breadcrumb: Attribute.Component<'elements.breadcrumb', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    components: Attribute.DynamicZone<
      [
        'header.header',
        'blocks.content',
        'blocks.news-listing',
        'blocks.google-map',
        'blocks.hero-section',
        'blocks.why-jood',
        'blocks.let-us-help-you',
        'blocks.urgent-appeals',
        'blocks.key-features',
        'blocks.success-numbers',
        'blocks.start-fundraise',
        'blocks.whats-new',
        'blocks.meet-leaders',
        'blocks.ticker-message'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sitemap.sitemap',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    Disabled: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    ExcludeFromSitemap: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    HidePageTitle: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    Icon: Attribute.Media<'images'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::sitemap.sitemap',
      'oneToMany',
      'api::sitemap.sitemap'
    >;
    PageBreadcrumbTitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    PageDescription: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    PageSlug: Attribute.String &
      Attribute.CustomField<
        'plugin::ab-custom-slug.ab-custom-slug',
        {
          targetField: 'PageTitle';
        }
      > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    PageSubtitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    PageTitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    PageUid: Attribute.UID<'api::sitemap.sitemap', 'PageTitle'>;
    ParentPage: Attribute.Relation<
      'api::sitemap.sitemap',
      'oneToOne',
      'api::sitemap.sitemap'
    >;
    publishedAt: Attribute.DateTime;
    RequireAuth: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    Seo: Attribute.Component<'shared.seo'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::sitemap.sitemap',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTrackingCodeTrackingCode extends Schema.SingleType {
  collectionName: 'tracking_codes';
  info: {
    displayName: 'Tracking Codes';
    pluralName: 'tracking-codes';
    singularName: 'tracking-code';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tracking-code.tracking-code',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    FooterTrackingCodes: Attribute.Text;
    HeaderTrackingCodes: Attribute.Text;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::tracking-code.tracking-code',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTranslationTranslation extends Schema.CollectionType {
  collectionName: 'translations';
  info: {
    displayName: 'Translations';
    pluralName: 'translations';
    singularName: 'translation';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::translation.translation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    translationArabic: Attribute.String;
    translationEnglish: Attribute.String;
    translationKey: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::translation.translation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginCalendarEvent extends Schema.CollectionType {
  collectionName: 'events';
  info: {
    description: '';
    displayName: 'Events';
    pluralName: 'events';
    singularName: 'event';
  };
  options: {
    draftAndPublish: true;
    eventCalendarConfig: true;
  };
  attributes: {
    allow_registration: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    banner_image: Attribute.Media<'images', true>;
    calendar_event_submission: Attribute.Relation<
      'plugin::calendar.event',
      'oneToOne',
      'plugin::calendar.event-submission'
    >;
    consumed_capacity: Attribute.Integer;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::calendar.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.RichText;
    end_date: Attribute.DateTime;
    event_category: Attribute.Relation<
      'plugin::calendar.event',
      'oneToMany',
      'plugin::calendar.event-category'
    >;
    event_sessions: Attribute.Relation<
      'plugin::calendar.event',
      'oneToMany',
      'plugin::calendar.event-session'
    >;
    event_type: Attribute.Relation<
      'plugin::calendar.event',
      'oneToOne',
      'plugin::calendar.event-type'
    >;
    has_sessions: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    location: Attribute.String;
    name: Attribute.String;
    open_event: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    original_capacity: Attribute.Integer;
    publishedAt: Attribute.DateTime;
    start_date: Attribute.DateTime;
    thumbnail_image: Attribute.Media<'images'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::calendar.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    video_link: Attribute.Text;
  };
}

export interface PluginCalendarEventCategory extends Schema.CollectionType {
  collectionName: 'event_category';
  info: {
    displayName: 'Event Category';
    pluralName: 'event-categories';
    singularName: 'event-category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::calendar.event-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    publishedAt: Attribute.DateTime;
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::calendar.event-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginCalendarEventSession extends Schema.CollectionType {
  collectionName: 'event_sessions';
  info: {
    description: '';
    displayName: 'Event Sessions';
    pluralName: 'event-sessions';
    singularName: 'event-session';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    calendar_event_submission: Attribute.Relation<
      'plugin::calendar.event-session',
      'oneToOne',
      'plugin::calendar.event-submission'
    >;
    capacity: Attribute.Integer;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::calendar.event-session',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    end_date: Attribute.DateTime;
    name: Attribute.String;
    open_session: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    publishedAt: Attribute.DateTime;
    start_date: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::calendar.event-session',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginCalendarEventSubmission extends Schema.CollectionType {
  collectionName: 'event_submissions';
  info: {
    description: '';
    displayName: 'Event Submissions';
    pluralName: 'event-submissions';
    singularName: 'event-submission';
  };
  options: {
    draftAndPublish: true;
    eventCalendarConfig: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::calendar.event-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    event: Attribute.Relation<
      'plugin::calendar.event-submission',
      'oneToOne',
      'plugin::calendar.event'
    >;
    event_session: Attribute.Relation<
      'plugin::calendar.event-submission',
      'oneToOne',
      'plugin::calendar.event-session'
    >;
    open_submission: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    publishedAt: Attribute.DateTime;
    submission_date: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::calendar.event-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    user_id: Attribute.String;
  };
}

export interface PluginCalendarEventType extends Schema.CollectionType {
  collectionName: 'event_types';
  info: {
    displayName: 'Event Types';
    pluralName: 'event-types';
    singularName: 'event-type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::calendar.event-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    publishedAt: Attribute.DateTime;
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::calendar.event-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginCommentsComment extends Schema.CollectionType {
  collectionName: 'comments_comment';
  info: {
    description: 'Comment content type';
    displayName: 'Comment';
    kind: 'collectionType';
    pluralName: 'comments';
    singularName: 'comment';
    tableName: 'plugin-comments-comments';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    approvalStatus: Attribute.String;
    authorAvatar: Attribute.String;
    authorEmail: Attribute.Email;
    authorId: Attribute.String;
    authorName: Attribute.String;
    authorUser: Attribute.Relation<
      'plugin::comments.comment',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    blockedThread: Attribute.Boolean & Attribute.DefaultTo<false>;
    blockReason: Attribute.String;
    content: Attribute.Text & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::comments.comment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    isAdminComment: Attribute.Boolean;
    related: Attribute.String;
    removed: Attribute.Boolean;
    reports: Attribute.Relation<
      'plugin::comments.comment',
      'oneToMany',
      'plugin::comments.comment-report'
    >;
    threadOf: Attribute.Relation<
      'plugin::comments.comment',
      'oneToOne',
      'plugin::comments.comment'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::comments.comment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginCommentsCommentReport extends Schema.CollectionType {
  collectionName: 'comments_comment-report';
  info: {
    description: 'Reports content type';
    displayName: 'Reports';
    kind: 'collectionType';
    pluralName: 'comment-reports';
    singularName: 'comment-report';
    tableName: 'plugin-comments-reports';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    content: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::comments.comment-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    reason: Attribute.Enumeration<['BAD_LANGUAGE', 'DISCRIMINATION', 'OTHER']> &
      Attribute.Required &
      Attribute.DefaultTo<'OTHER'>;
    related: Attribute.Relation<
      'plugin::comments.comment-report',
      'manyToOne',
      'plugin::comments.comment'
    >;
    resolved: Attribute.Boolean & Attribute.DefaultTo<false>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::comments.comment-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginElasticsearchIndexingLog extends Schema.CollectionType {
  collectionName: 'indexing-log';
  info: {
    description: 'Logged runs of the indexing cron job';
    displayName: 'Indexing Logs';
    pluralName: 'indexing-logs';
    singularName: 'indexing-log';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::elasticsearch.indexing-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    details: Attribute.Text;
    status: Attribute.Enumeration<['pass', 'fail']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::elasticsearch.indexing-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginElasticsearchTask extends Schema.CollectionType {
  collectionName: 'task';
  info: {
    description: 'Search indexing tasks';
    displayName: 'Task';
    pluralName: 'tasks';
    singularName: 'task';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    collection_name: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::elasticsearch.task',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    full_site_indexing: Attribute.Boolean;
    indexing_status: Attribute.Enumeration<['to-be-done', 'done']> &
      Attribute.Required &
      Attribute.DefaultTo<'to-be-done'>;
    indexing_type: Attribute.Enumeration<
      ['add-to-index', 'remove-from-index']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'add-to-index'>;
    item_id: Attribute.Integer;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::elasticsearch.task',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginEmailDesignerEmailTemplate
  extends Schema.CollectionType {
  collectionName: 'email_templates';
  info: {
    displayName: 'Email-template';
    name: 'email-template';
    pluralName: 'email-templates';
    singularName: 'email-template';
  };
  options: {
    comment: '';
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    bodyHtml: Attribute.Text;
    bodyText: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::email-designer.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    design: Attribute.JSON;
    enabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    name: Attribute.String;
    subject: Attribute.String;
    tags: Attribute.JSON;
    templateReferenceId: Attribute.Integer & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::email-designer.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginNavigationAudience extends Schema.CollectionType {
  collectionName: 'audience';
  info: {
    displayName: 'Audience';
    name: 'audience';
    pluralName: 'audiences';
    singularName: 'audience';
  };
  options: {
    comment: 'Audience';
    increments: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.audience',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    key: Attribute.UID<'plugin::navigation.audience', 'name'>;
    name: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.audience',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginNavigationNavigation extends Schema.CollectionType {
  collectionName: 'navigations';
  info: {
    displayName: 'Navigation';
    name: 'navigation';
    pluralName: 'navigations';
    singularName: 'navigation';
  };
  options: {
    comment: '';
    increments: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    items: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToMany',
      'plugin::navigation.navigation-item'
    >;
    localeCode: Attribute.String;
    localizations: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToMany',
      'plugin::navigation.navigation'
    >;
    name: Attribute.Text & Attribute.Required;
    slug: Attribute.UID & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.navigation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    visible: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface PluginNavigationNavigationItem extends Schema.CollectionType {
  collectionName: 'navigations_items';
  info: {
    displayName: 'Navigation Item';
    name: 'navigation-item';
    pluralName: 'navigation-items';
    singularName: 'navigation-item';
  };
  options: {
    comment: 'Navigation Item';
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    additionalFields: Attribute.JSON & Attribute.DefaultTo<{}>;
    audience: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToMany',
      'plugin::navigation.audience'
    >;
    autoSync: Attribute.Boolean & Attribute.DefaultTo<true>;
    collapsed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    externalPath: Attribute.Text;
    master: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'manyToOne',
      'plugin::navigation.navigation'
    >;
    menuAttached: Attribute.Boolean & Attribute.DefaultTo<false>;
    order: Attribute.Integer & Attribute.DefaultTo<0>;
    parent: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'plugin::navigation.navigation-item'
    >;
    path: Attribute.Text;
    related: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'plugin::navigation.navigations-items-related'
    >;
    title: Attribute.Text &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    type: Attribute.Enumeration<['INTERNAL', 'EXTERNAL', 'WRAPPER']> &
      Attribute.DefaultTo<'INTERNAL'>;
    uiRouterKey: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.navigation-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginNavigationNavigationsItemsRelated
  extends Schema.CollectionType {
  collectionName: 'navigations_items_related';
  info: {
    displayName: 'Navigations Items Related';
    name: 'navigations_items_related';
    pluralName: 'navigations-items-relateds';
    singularName: 'navigations-items-related';
  };
  options: {
    increments: true;
    populateCreatorFields: false;
    timestamps: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::navigation.navigations-items-related',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    field: Attribute.String & Attribute.Required;
    master: Attribute.String & Attribute.Required;
    order: Attribute.Integer & Attribute.Required;
    related_id: Attribute.String & Attribute.Required;
    related_type: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::navigation.navigations-items-related',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginSimpleAuthAuth extends Schema.CollectionType {
  collectionName: 'auths';
  info: {
    displayName: 'Auth';
    pluralName: 'auths';
    singularName: 'auth';
  };
  options: {
    comment: '';
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::simple-auth.auth',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::simple-auth.auth',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginSimpleAuthClientCredential
  extends Schema.CollectionType {
  collectionName: 'client_credentials';
  info: {
    displayName: 'Client Credential';
    pluralName: 'client-credentials';
    singularName: 'client-credential';
  };
  options: {
    comment: '';
    draftAndPublish: true;
  };
  attributes: {
    allowed_methods: Attribute.JSON;
    client_id: Attribute.String;
    client_name: Attribute.String;
    client_secret: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::simple-auth.client-credential',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    grants: Attribute.JSON;
    publishedAt: Attribute.DateTime;
    redirectUris: Attribute.JSON;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::simple-auth.client-credential',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginSimpleAuthTokenStore extends Schema.CollectionType {
  collectionName: 'token_stores';
  info: {
    displayName: 'Token Store';
    pluralName: 'token-stores';
    singularName: 'token-store';
  };
  options: {
    comment: '';
    draftAndPublish: false;
  };
  attributes: {
    access_token: Attribute.String;
    access_token_expires_at: Attribute.DateTime;
    client: Attribute.JSON;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::simple-auth.token-store',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    guest_id: Attribute.String;
    refresh_token: Attribute.String;
    refresh_token_expires_at: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::simple-auth.token-store',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    user: Attribute.JSON;
  };
}

export interface PluginStrapiAdsAd extends Schema.CollectionType {
  collectionName: 'ads';
  info: {
    displayName: 'Ad';
    pluralName: 'ads';
    singularName: 'ad';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ad_cta_name: Attribute.String;
    ad_description: Attribute.Text;
    ad_destination_models: Attribute.Enumeration<['general', 'news']>;
    ad_destination_page: Attribute.String;
    ad_end_date: Attribute.Date;
    ad_external_url: Attribute.Text;
    ad_headline: Attribute.String;
    ad_id: Attribute.UID<'plugin::strapi-ads.ad', 'ad_name'>;
    ad_image: Attribute.Media<'images'>;
    ad_name: Attribute.String;
    ad_screens: Attribute.Relation<
      'plugin::strapi-ads.ad',
      'oneToMany',
      'plugin::strapi-ads.ad-screen'
    >;
    ad_spot: Attribute.Relation<
      'plugin::strapi-ads.ad',
      'oneToOne',
      'plugin::strapi-ads.ad-spot'
    >;
    ad_start_date: Attribute.Date & Attribute.Required;
    ad_status: Attribute.Enumeration<
      ['draft', 'live', 'inactive', 'expired', 'archived']
    > &
      Attribute.DefaultTo<'draft'>;
    ad_type: Attribute.Relation<
      'plugin::strapi-ads.ad',
      'oneToOne',
      'plugin::strapi-ads.ad-type'
    >;
    ad_video_url: Attribute.String;
    campaign: Attribute.Relation<
      'plugin::strapi-ads.ad',
      'manyToOne',
      'plugin::strapi-ads.campaign'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.ad',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ctr: Attribute.Decimal & Attribute.DefaultTo<0>;
    publishedAt: Attribute.DateTime;
    selected: Attribute.Boolean & Attribute.DefaultTo<false>;
    total_clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    total_impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.ad',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsAdScreen extends Schema.CollectionType {
  collectionName: 'ad_screens';
  info: {
    displayName: 'Ad Screen';
    pluralName: 'ad-screens';
    singularName: 'ad-screen';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ad_screen_id: Attribute.UID<
      'plugin::strapi-ads.ad-screen',
      'ad_screen_title'
    >;
    ad_screen_title: Attribute.String;
    ad_spot: Attribute.Relation<
      'plugin::strapi-ads.ad-screen',
      'manyToMany',
      'plugin::strapi-ads.ad-spot'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.ad-screen',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.ad-screen',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsAdSpot extends Schema.CollectionType {
  collectionName: 'ad_spots';
  info: {
    description: '';
    displayName: 'Ad Spot';
    pluralName: 'ad-spots';
    singularName: 'ad-spot';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ad_screens: Attribute.Relation<
      'plugin::strapi-ads.ad-spot',
      'manyToMany',
      'plugin::strapi-ads.ad-screen'
    >;
    ad_spot_display_text: Attribute.String;
    ad_spot_id: Attribute.UID<'plugin::strapi-ads.ad-spot', 'ad_spot_title'>;
    ad_spot_title: Attribute.String;
    ad_types: Attribute.Relation<
      'plugin::strapi-ads.ad-spot',
      'manyToMany',
      'plugin::strapi-ads.ad-type'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.ad-spot',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.ad-spot',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsAdStat extends Schema.CollectionType {
  collectionName: 'ad_stats';
  info: {
    description: '';
    displayName: 'Ad Stat';
    pluralName: 'ad-stats';
    singularName: 'ad-stat';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ad_id: Attribute.String;
    clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.ad-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    stat_date: Attribute.Date;
    total_clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    total_impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.ad-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsAdType extends Schema.CollectionType {
  collectionName: 'ad_types';
  info: {
    description: '';
    displayName: 'Ad Type';
    pluralName: 'ad-types';
    singularName: 'ad-type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ad_spots: Attribute.Relation<
      'plugin::strapi-ads.ad-type',
      'manyToMany',
      'plugin::strapi-ads.ad-spot'
    >;
    ad_type_id: Attribute.UID<'plugin::strapi-ads.ad-type', 'title'>;
    allow_video: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.ad-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Text;
    image_size: Attribute.JSON;
    publishedAt: Attribute.DateTime;
    thumbnail: Attribute.Media<'images', true>;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.ad-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsAdsConfig extends Schema.SingleType {
  collectionName: 'ads_config';
  info: {
    description: '';
    displayName: 'Ads Config';
    pluralName: 'ads-configs';
    singularName: 'ads-config';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.ads-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    stat_sync_in_progress: Attribute.Boolean & Attribute.DefaultTo<false>;
    stat_sync_last_run: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.ads-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsCampaign extends Schema.CollectionType {
  collectionName: 'campaigns';
  info: {
    description: '';
    displayName: 'Campaign';
    pluralName: 'campaigns';
    singularName: 'campaign';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads: Attribute.Relation<
      'plugin::strapi-ads.campaign',
      'oneToMany',
      'plugin::strapi-ads.ad'
    >;
    campaign_entity_license_number: Attribute.String;
    campaign_entity_name: Attribute.String;
    campaign_entity_type: Attribute.Enumeration<
      ['adgm_entity', 'external_entity']
    >;
    campaign_id: Attribute.UID<'plugin::strapi-ads.campaign', 'campaign_name'>;
    campaign_name: Attribute.String;
    campaign_status: Attribute.Enumeration<
      ['draft', 'active', 'inactive', 'expired', 'archived']
    > &
      Attribute.DefaultTo<'draft'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.campaign',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ctr: Attribute.Decimal & Attribute.DefaultTo<0>;
    max_date: Attribute.Date;
    min_date: Attribute.Date;
    publishedAt: Attribute.DateTime;
    total_clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    total_impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.campaign',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsCampaignStat extends Schema.CollectionType {
  collectionName: 'campaign_stats';
  info: {
    description: '';
    displayName: 'Campaign Stat';
    pluralName: 'campaign-stats';
    singularName: 'campaign-stat';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    campaign_id: Attribute.String;
    clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.campaign-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    stat_date: Attribute.Date;
    total_clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    total_impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.campaign-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiAdsDailySystemStat extends Schema.CollectionType {
  collectionName: 'daily_system_stats';
  info: {
    description: '';
    displayName: 'Daily System Stat';
    pluralName: 'daily-system-stats';
    singularName: 'daily-system-stat';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active_ads: Attribute.BigInteger & Attribute.DefaultTo<0>;
    active_campaigns: Attribute.BigInteger & Attribute.DefaultTo<0>;
    clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-ads.daily-system-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    stat_date: Attribute.Date;
    total_clicks: Attribute.BigInteger & Attribute.DefaultTo<0>;
    total_impressions: Attribute.BigInteger & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-ads.daily-system-stat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiV4FormBuilderFormEmailTemplate
  extends Schema.CollectionType {
  collectionName: 'form_email_templates';
  info: {
    displayName: 'Form Email Template';
    pluralName: 'form-email-templates';
    singularName: 'form-email-template';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    enableEmail: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<false>;
    formTypes: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-email-template',
      'manyToMany',
      'plugin::strapi-v4-form-builder.form-type'
    >;
    isAdmin: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<false>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-email-template',
      'oneToMany',
      'plugin::strapi-v4-form-builder.form-email-template'
    >;
    name: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Attribute.DateTime;
    recipientEmail: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    senderEmail: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subject: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiV4FormBuilderFormRedirect
  extends Schema.CollectionType {
  collectionName: 'form_redirects';
  info: {
    displayName: 'Form Redirects';
    pluralName: 'form-redirects';
    singularName: 'form-redirect';
  };
  options: {
    comment: '';
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    buttons: Attribute.Component<'form.redirect-buttons', true>;
    content: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-redirect',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    formType: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-redirect',
      'oneToOne',
      'plugin::strapi-v4-form-builder.form-type'
    >;
    iframe: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Attribute.Media<'images' | 'files'>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-redirect',
      'oneToMany',
      'plugin::strapi-v4-form-builder.form-redirect'
    >;
    publishedAt: Attribute.DateTime;
    route: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subtitle: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    type: Attribute.Enumeration<['alert', 'popup', 'bottomsheet', 'page']> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<'alert'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-redirect',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiV4FormBuilderFormSubmission
  extends Schema.CollectionType {
  collectionName: 'form_submissions';
  info: {
    description: '';
    displayName: 'Form Submission';
    pluralName: 'form-submissions';
    singularName: 'form-submission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    formType: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-submission',
      'manyToOne',
      'plugin::strapi-v4-form-builder.form-type'
    >;
    jsonSubmission: Attribute.JSON &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-submission',
      'oneToMany',
      'plugin::strapi-v4-form-builder.form-submission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiV4FormBuilderFormType
  extends Schema.CollectionType {
  collectionName: 'form_types';
  info: {
    description: '';
    displayName: 'Form Type';
    pluralName: 'form-types';
    singularName: 'form-type';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    emailTemplates: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-type',
      'manyToMany',
      'plugin::strapi-v4-form-builder.form-email-template'
    >;
    formCSFRTokenExpiry: Attribute.Integer;
    formDescription: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formFields: Attribute.Component<'form.form-fields', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formID: Attribute.String &
      Attribute.CustomField<'plugin::ab-custom-slug.ab-custom-slug'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formName: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formRedirect: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-type',
      'oneToOne',
      'plugin::strapi-v4-form-builder.form-redirect'
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formSubmissions: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-type',
      'oneToMany',
      'plugin::strapi-v4-form-builder.form-submission'
    >;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-type',
      'oneToMany',
      'plugin::strapi-v4-form-builder.form-type'
    >;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::strapi-v4-form-builder.form-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    useCaptcha: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<true>;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::article-category.article-category': ApiArticleCategoryArticleCategory;
      'api::article.article': ApiArticleArticle;
      'api::config.config': ApiConfigConfig;
      'api::redirect.redirect': ApiRedirectRedirect;
      'api::remote-config.remote-config': ApiRemoteConfigRemoteConfig;
      'api::search.search': ApiSearchSearch;
      'api::sitemap.sitemap': ApiSitemapSitemap;
      'api::tracking-code.tracking-code': ApiTrackingCodeTrackingCode;
      'api::translation.translation': ApiTranslationTranslation;
      'plugin::calendar.event': PluginCalendarEvent;
      'plugin::calendar.event-category': PluginCalendarEventCategory;
      'plugin::calendar.event-session': PluginCalendarEventSession;
      'plugin::calendar.event-submission': PluginCalendarEventSubmission;
      'plugin::calendar.event-type': PluginCalendarEventType;
      'plugin::comments.comment': PluginCommentsComment;
      'plugin::comments.comment-report': PluginCommentsCommentReport;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::elasticsearch.indexing-log': PluginElasticsearchIndexingLog;
      'plugin::elasticsearch.task': PluginElasticsearchTask;
      'plugin::email-designer.email-template': PluginEmailDesignerEmailTemplate;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::navigation.audience': PluginNavigationAudience;
      'plugin::navigation.navigation': PluginNavigationNavigation;
      'plugin::navigation.navigation-item': PluginNavigationNavigationItem;
      'plugin::navigation.navigations-items-related': PluginNavigationNavigationsItemsRelated;
      'plugin::simple-auth.auth': PluginSimpleAuthAuth;
      'plugin::simple-auth.client-credential': PluginSimpleAuthClientCredential;
      'plugin::simple-auth.token-store': PluginSimpleAuthTokenStore;
      'plugin::strapi-ads.ad': PluginStrapiAdsAd;
      'plugin::strapi-ads.ad-screen': PluginStrapiAdsAdScreen;
      'plugin::strapi-ads.ad-spot': PluginStrapiAdsAdSpot;
      'plugin::strapi-ads.ad-stat': PluginStrapiAdsAdStat;
      'plugin::strapi-ads.ad-type': PluginStrapiAdsAdType;
      'plugin::strapi-ads.ads-config': PluginStrapiAdsAdsConfig;
      'plugin::strapi-ads.campaign': PluginStrapiAdsCampaign;
      'plugin::strapi-ads.campaign-stat': PluginStrapiAdsCampaignStat;
      'plugin::strapi-ads.daily-system-stat': PluginStrapiAdsDailySystemStat;
      'plugin::strapi-v4-form-builder.form-email-template': PluginStrapiV4FormBuilderFormEmailTemplate;
      'plugin::strapi-v4-form-builder.form-redirect': PluginStrapiV4FormBuilderFormRedirect;
      'plugin::strapi-v4-form-builder.form-submission': PluginStrapiV4FormBuilderFormSubmission;
      'plugin::strapi-v4-form-builder.form-type': PluginStrapiV4FormBuilderFormType;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
