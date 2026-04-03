module.exports = ({ env }) => ({
  // ...
  "strapi-v4-form-builder": {
    enabled: true,
  },
  "import-export-entries-js": {
    enabled: true,
  },
  upload: getUploadConfig(env),
  email: getEmailConfig(env),
  "strapi-ads": {
    enabled: true,
    resolve: "./src/plugins/strapi-ads",
    config: {
      destinationModelConfig: {
        sitemap: {
          label: "Sitemap",
          model: "api::sitemap.sitemap",
          fields: ["page_label", "page_title"],
          sort: { page_label: "ASC" },
        },
        article: {
          label: "Articles",
          model: "api::article.article",
          fields: ["page_label", "page_title"],
          sort: { page_label: "ASC" },
        },
      },
      apiRules: [
        // Article Listing Ads
        {
          apis: ["api/articles"],
          ad_type: "sticky-ad",
          ad_spot: "articles-listing",
          ad_screen: "article",
        },
      ],
    },
  },
  // ...
});

const getUploadConfig = (env) => {
  let config = {
    config: {
      provider: "local",
    },
  };
  if (env("AWS_PROVIDER") == "true") {
    config = {
      config: {
        provider: "aws-s3",
        providerOptions: {
          baseUrl: env("CDN_URL"),
          rootPath: env("CDN_ROOT_PATH"),
          s3Options: {
            credentials: {
              accessKeyId: env("AWS_ACCESS_KEY_ID"),
              secretAccessKey: env("AWS_ACCESS_SECRET"),
            },
            region: env("AWS_REGION"),
            params: {
              ACL: env("AWS_ACL", "public-read"),
              signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
              Bucket: env("AWS_BUCKET"),
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    };
  }
  return config;
};

const getEmailConfig = (env) => {
  let config = {
    config: {
      provider: "sendmail",
      providerOptions: {},
    },
  };
  if (env("EMAIL_PROVIDER") == "nodemailer") {
    config = {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host: env("SMTP_HOST", "smtp.example.com"),
          port: env("SMTP_PORT", 587),
          auth: {
            user: env("SMTP_USERNAME"),
            pass: env("SMTP_PASSWORD"),
          },
          tls: {
            rejectUnauthorized: false,
          },
          // ... any custom nodemailer options
        },
      },
    };
  } else if (env("EMAIL_PROVIDER") == "sendgrid") {
    config = {
      config: {
        provider: "sendgrid",
        providerOptions: { apiKey: env("SENDGRID_API_KEY") },
      },
    };
  }
  config.config.settings = {
    defaultFrom: env("EMAIL_DEFAULT_FROM"),
    defaultReplyTo: env("EMAIL_DEFAULT_TO"),
    testAddress: env("EMAIL_DEFAULT_TO"),
  };

  return config;
};
