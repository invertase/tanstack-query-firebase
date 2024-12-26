import fs from "node:fs";
import path from "node:path";

/**
 * Reads the Firebase emulator debug log and extracts the password reset code
 * @param email The email address for which the password reset was requested
 * @returns The password reset code (oobCode) or null if not found
 */
async function getPasswordResetCodeFromLogs(
  email: string,
): Promise<string | null> {
  try {
    // Read the firebase-debug.log file
    const logPath = path.join(process.cwd(), "firebase-debug.log");
    const logContent = await fs.promises.readFile(logPath, "utf8");

    // Find the most recent password reset link for the given email
    const lines = logContent.split("\n").reverse();
    const resetLinkPattern = new RegExp(
      `To reset the password for ${email.replace(
        ".",
        "\\.",
      )}.*?http://127\\.0\\.0\\.1:9099.*`,
      "i",
    );

    for (const line of lines) {
      const match = line.match(resetLinkPattern);
      if (match) {
        // Extract oobCode from the reset link
        const url = match[0].match(/http:\/\/127\.0\.0\.1:9099\/.*?$/)?.[0];
        if (url) {
          const oobCode = new URL(url).searchParams.get("oobCode");
          return oobCode;
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
 * Waits for the password reset code to appear in the logs
 * @param email The email address for which the password reset was requested
 * @param timeout Maximum time to wait in milliseconds
 * @param interval Interval between checks in milliseconds
 * @returns The password reset code or null if timeout is reached
 */
async function waitForPasswordResetCode(
  email: string,
  timeout = 5000,
  interval = 100,
): Promise<string | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const code = await getPasswordResetCodeFromLogs(email);
    if (code) {
      return code;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return null;
}

export { getPasswordResetCodeFromLogs, waitForPasswordResetCode };
