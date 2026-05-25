import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const auditLogPath = path.join(process.cwd(), "data/audit-log.json");

export async function auditLog(event) {
  const logEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  };

  let logs = [];

  try {
    const file = await fs.readFile(auditLogPath, "utf-8");
    logs = JSON.parse(file);
  } catch {
    logs = [];
  }

  logs.push(logEntry);

  await fs.writeFile(auditLogPath, JSON.stringify(logs, null, 2), "utf-8");
}