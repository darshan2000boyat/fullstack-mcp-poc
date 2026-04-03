module.exports = ({ env }) => ({
  LANGUAGES: {
    en: "en",
    ar: "ar",
  },
  SEND_CUSTOM_MAIL: env("SEND_CUSTOM_MAIL", false),
});
