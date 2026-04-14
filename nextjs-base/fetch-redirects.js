const fs = require("fs");
const path = require("path");
require("dotenv").config();

const outputDir = path.resolve(__dirname);
const outputFileName = path.join(outputDir, "next.rewrites.mjs");

// Create directories if they don't exist
fs.mkdirSync(outputDir, { recursive: true });

console.log("Creating redirects...");
fetch(process.env.REDIRECTS_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data?.data) {
      let redirectsArray = [];
      data?.data?.map((item) => {
        redirectsArray = [
          ...redirectsArray,
          {
            source: item?.Source,
            destination: item?.Destination,
            permanent: item?.Permanent,
          },
        ];
      });

      fs.writeFileSync(
        outputFileName,
        `export default ${JSON.stringify(redirectsArray, null, 2)} `,
      );

      console.log("redirects have been successfully written.");
    } else {
      console.error("No data found in the API response.");
    }
  })
  .catch((error) => {
    console.error("Failed to fetch data:", error);
    process.exit(1);
  });
