module.exports = () => {
  return async (ctx, next) => {
    let locale = ctx.query.locale ? ctx.query.locale : "en";
    locale = strapi.config.get("constants.LANGUAGES")[locale];
    ctx.locale = locale;
    await next();
  };
};
