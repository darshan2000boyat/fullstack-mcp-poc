const axios = require("axios").default;
const { errors } = require("@strapi/utils");
const { PolicyError } = errors;
module.exports = async (ctx, next) => {
  // ctx.request.body = JSON.parse(ctx.request.body);
  const captcha_key = ctx.request.header["x-captcha"];
  const recaptchaSecret = strapi.config.get("constants.RECAPTCHA_SECRET") || "";
  const param = new URLSearchParams({
    // @ts-ignore
    secret: encodeURIComponent(recaptchaSecret),
    response: encodeURIComponent(captcha_key),
  });
  const url = `${strapi.config.get("constants.RECAPTCH_BASE_URL")}?${param}`;

  try {
    const googleResponse = await axios.post(url);

    if (googleResponse.data && googleResponse.data.success) {
      delete ctx.request.body.captcha_key;
      return true;
    }
    throw new PolicyError("Captcha Error");
  } catch (error) {
    throw new PolicyError("Invalid Captcha");
  }
};
