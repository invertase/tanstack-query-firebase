import fs from "node:fs";
import path from "node:path";

/**
 * Reads the Firebase emulator debug log and extracts a specific code from the logs.
 * @param email The email address for which the code was requested.
 * @param logPattern A regular expression pattern to match the log entry.
 * @param extractCodeFn A function to extract the code from the relevant log line.
 * @returns The extracted code or null if not found.
 */
async function getCodeFromLogs(
  _email: string,
  logPattern: RegExp,
  extractCodeFn: (line: string) => string | null,
): Promise<string | null> {
  try {
    // Read the firebase-debug.log file
    const logPath = path.join(process.cwd(), "../../firebase-debug.log");
    const logContent = await fs.promises.readFile(logPath, "utf8");

    // Reverse lines to start with the most recent logs
    const lines = logContent.split("\n").reverse();

    for (const line of lines) {
      if (logPattern.test(line)) {
        const code = extractCodeFn(line);
        if (code) {
          return code;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error reading Firebase debug log:", error);
    return null;
  }
}

/**
 * Waits for a specific code to appear in the logs.
 * @param email The email address for which the code was requested.
 * @param logPattern A regular expression pattern to match the log entry.
 * @param extractCodeFn A function to extract the code from the relevant log line.
 * @param timeout Maximum time to wait in milliseconds.
 * @param interval Interval between checks in milliseconds.
 * @returns The extracted code or null if timeout is reached.
 */
async function waitForCode(
  email: string,
  logPattern: RegExp,
  extractCodeFn: (line: string) => string | null,
  timeout = 5000,
  interval = 100,
): Promise<string | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const code = await getCodeFromLogs(email, logPattern, extractCodeFn);
    if (code) {
      return code;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return null;
}

/**
 * Extracts the oobCode from a log line.
 * @param line The log line containing the oobCode link.
 * @returns The oobCode or null if not found.
 */
function extractOobCode(line: string): string | null {
  const url = line.match(
    /http:\/\/127\.0\.0\.1:9099\/emulator\/action\?.*?$/,
  )?.[0];
  return url ? new URL(url).searchParams.get("oobCode") : null;
}

export async function waitForPasswordResetCode(
  email: string,
  timeout = 5000,
  interval = 100,
): Promise<string | null> {
  const logPattern = new RegExp(
    `To reset the password for ${email.replace(
      ".",
      "\\.",
    )}.*?http://127\\.0\\.0\\.1:9099.*`,
    "i",
  );
  return waitForCode(email, logPattern, extractOobCode, timeout, interval);
}

export async function waitForVerificationCode(
  email: string,
  timeout = 5000,
  interval = 100,
): Promise<string | null> {
  const logPattern = new RegExp(
    `To verify the email address ${email.replace(
      ".",
      "\\.",
    )}.*?http://127\\.0\\.0\\.1:9099.*`,
    "i",
  );
  return waitForCode(email, logPattern, extractOobCode, timeout, interval);
}
