const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // Get BUILD_ID from env or git
  let buildId = process.env.BUILD_ID;

  if (!buildId) {
    try {
      buildId = execSync("git rev-parse HEAD").toString().trim();
    } catch (error) {
      console.log("Not a git repository, using timestamp as BUILD_ID");
    }
  }

  console.log("Using BUILD_ID:", buildId);

  // Define path to BUILD_ID file (in project root)
  const buildIdPath = path.join(process.cwd(), "BUILD_ID");

  // Write or overwrite the BUILD_ID file
  fs.writeFileSync(buildIdPath, buildId + "\n");
  console.log("BUILD_ID written to:", buildIdPath);
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
