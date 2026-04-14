const fs = require("fs");
const path = require("path");
require("dotenv").config();

const outputDir = path.resolve(
  __dirname,
  "src",
  "app",
  "locales",
  "translations",
);
const outputFileEnglish = path.join(outputDir, "en.ts");
const outputFileArabic = path.join(outputDir, "ar.ts");

// Create directories if they don't exist
fs.mkdirSync(outputDir, { recursive: true });

fetch(process.env.TRANSLATIONS_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data?.data) {
      const englishTranslations = data.data.reduce(
        (acc, item) => ({
          ...acc,
          [item.TranslationKey]: item.TranslationEnglish,
        }),
        {},
      );

      const arabicTranslations = data.data.reduce(
        (acc, item) => ({
          ...acc,
          [item.TranslationKey]: item.TranslationArabic,
        }),
        {},
      );

      fs.writeFileSync(
        outputFileEnglish,
        `export default ${JSON.stringify(
          englishTranslations,
          null,
          2,
        )} as const;\n`,
      );
      fs.writeFileSync(
        outputFileArabic,
        `export default ${JSON.stringify(
          arabicTranslations,
          null,
          2,
        )} as const;\n`,
      );

      console.log(
        "English and Arabic translations have been successfully written.",
      );
    } else {
      console.error("No data found in the API response.");
    }
  })
  .catch((error) => {
    console.error("Failed to fetch data:", error);
    process.exit(1);
  });
