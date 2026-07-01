import fs from "fs";
import path from "path";
import pino from "pino";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const destination = pino.destination({
  dest: path.join(logDir, "app.log"),
  sync: false,
});

export const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  destination
);