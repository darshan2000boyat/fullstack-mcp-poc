const { errors } = require("@strapi/utils");
const { ForbiddenError } = errors;
const CryptoJS = require("crypto-js");
module.exports = () => {
  return async (ctx, next) => {
    const token = ctx?.request?.headers?.authorization?.split(" ")[1]; // Bearer token sent from web
    const enabled = strapi.config.get("server.xapiEnabled");
    if (enabled && !token && ctx.originalUrl.startsWith("/api")) {
      const apiKey = ctx.request.header["x-api-key"];
      if (!validateApiToken(apiKey)) {
        throw new ForbiddenError();
      }
    }
    await next();
  };
};

const validateApiToken = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      token,
      strapi.config.get("server.apiTokenSecret", "defaultValueIfUndefined")
    );
    const apiToken = bytes.toString(CryptoJS.enc.Utf8);
    const res = apiToken.split(
      strapi.config.get("server.apiTokenValue", "defaultValueIfUndefined")
    );
    return res?.length > 0;
  } catch (error) {
    return false;
  }
};
