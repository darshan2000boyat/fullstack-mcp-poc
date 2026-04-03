module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  apiTokenSecret: env("API_SECRET_VALUE", ""),
  apiTokenValue: env("API_SECRET_KEY", ""),
  xapiEnabled: env("ENABLE_X_API_KEY",false)
});
