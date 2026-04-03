/* eslint-disable no-unused-vars */

module.exports = {
  prependUrlImage(value, imageType) {
    if (value !== null && value !== undefined) {
      let returnURL = "";
      let updatedAt = value?.updatedAt;
      const prependHost =
        value?.provider !== "local"
          ? ""
          : strapi.config.get("constants.BACKEND_URL");
      if (typeof value !== "string") {
        if (value.formats) {
          if (imageType === "thumbnail" && value?.formats?.thumbnail?.url) {
            returnURL = prependHost + value.formats.thumbnail.url;
          } else if (imageType === "medium" && value?.formats?.medium?.url) {
            returnURL = prependHost + value.formats.medium.url;
          } else if (imageType === "url" && value?.url) {
            returnURL = prependHost + value.url;
          } else if (value?.formats?.small?.url) {
            returnURL = prependHost + value.formats.small.url;
          }
        } else {
          returnURL = prependHost + value.url;
        }
      } else {
        returnURL = value;
      }
      returnURL = returnURL + (updatedAt ? `?updatedAt:${updatedAt}` : "");
      return returnURL;
    } else {
      return "";
    }
  },
  arrayPrependUrlImage(value, imageType) {
    if (value !== null) {
      let returnURL = "";
      let updatedAt = value?.updatedAt;
      let prependHost =
        value?.provider !== "local"
          ? ""
          : strapi.config.get("constants.BACKEND_URL");
      if (typeof value !== "string") {
        if (Array.isArray(value)) value = value[0];
        prependHost =
          value?.provider !== "local"
            ? ""
            : strapi.config.get("constants.BACKEND_URL");
        updatedAt = value?.updatedAt;
        if (value.formats) {
          if (imageType === "thumbnail" && value?.formats?.thumbnail?.url) {
            returnURL = prependHost + value.formats.thumbnail.url;
          } else if (imageType === "medium" && value?.formats?.medium?.url) {
            returnURL = prependHost + value.formats.medium.url;
          } else if (imageType === "url" && value?.url) {
            returnURL = prependHost + value.url;
          } else if (value?.formats?.small?.url) {
            returnURL = prependHost + value.formats.small.url;
          }
        } else {
          returnURL = prependHost + value.url;
        }
      } else {
        returnURL = value;
      }
      returnURL = returnURL + (updatedAt ? `?updatedAt:${updatedAt}` : "");
      return returnURL;
    } else {
      return "";
    }
  },
  inputType(value) {
    switch (value) {
      case "select_options_with_text_area":
        return "text";
        break;
      case "select_options":
        return "text";
        break;
      case "text_area":
        return "text";
        break;
    }
  },
};
