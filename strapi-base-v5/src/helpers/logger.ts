import fs from "fs";
import path from "path";
import util from "util";

const currentYear = new Date().getFullYear();
const logDirectory = path.join("public", "logs", `strapi_${currentYear}`);

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const getLogFilePath = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  return path.join(logDirectory, `strapi_log_${yyyy}.${mm}.${dd}.log`);
};

const write = (level: string, args: unknown[]) => {
  const timestamp = new Date().toISOString();
  const message = args
    .map((item) =>
      typeof item === "string"
        ? item
        : util.inspect(item, { depth: 8, colors: false, breakLength: 120 })
    )
    .join(" ");

  fs.appendFileSync(getLogFilePath(), `[${timestamp}] ${level.toUpperCase()} ${message}\n`, "utf8");
};

const logger = {
  info: (...args: unknown[]) => write("info", args),
  warn: (...args: unknown[]) => write("warn", args),
  error: (...args: unknown[]) => write("error", args),
  debug: (...args: unknown[]) => write("debug", args),
};

export default logger;
export { logger };
