module.exports = [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'", "data:", "blob:", "https:", "http:"],
          "script-src": [
            "'self'",
            "'unsafe-inline'",
            "https://editor.unlayer.com",
            "https://cdn.ckeditor.com",
          ],
          "style-src": ["'self'", "'unsafe-inline'", "https:", "http:"],
          "img-src": ["'self'", "data:", "blob:", "https:", "http:"],
          "media-src": ["'self'", "data:", "blob:", "https:", "http:"],
          "connect-src": [
            "'self'",
            "data:",
            "blob:",
            "https:",
            "http:",
            "wss:",
            "https://proxy-event.ckeditor.com",
          ],
          "font-src": ["'self'", "https:", "data:"],
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "global::locale-check",
  "global::api-validation",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  "global::upload-check",
];
