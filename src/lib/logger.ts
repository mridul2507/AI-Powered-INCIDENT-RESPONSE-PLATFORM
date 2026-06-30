import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs", "app.log");

export async function writeLog(
  level: string,
  message: string,
  metadata?: unknown
) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    metadata,
  });

  fs.appendFileSync(logFile, line + "\n");
}