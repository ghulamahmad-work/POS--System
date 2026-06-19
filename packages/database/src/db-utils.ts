import path from "path";

/**
 * Dynamically resolves relative SQLite file connection URLs to absolute paths.
 * Resolves paths relative to process.cwd() at runtime.
 */
export function getAbsoluteDatabaseUrl(envVarName: string, defaultRelativePath: string): string {
  const envUrl = process.env[envVarName];
  const targetUrl = envUrl || `file:${defaultRelativePath}`;

  if (targetUrl.startsWith("file:")) {
    let rawPath = targetUrl.substring(5);
    let isDoubleSlash = false;

    if (rawPath.startsWith("//")) {
      rawPath = rawPath.substring(2);
      isDoubleSlash = true;
      // Strip leading slash for Windows drive letters like /D:/code
      if (/^\/[a-zA-Z]:/.test(rawPath)) {
        rawPath = rawPath.substring(1);
      }
    }

    if (path.isAbsolute(rawPath)) {
      return targetUrl;
    }

    const resolvedPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), rawPath);
    const normalized = resolvedPath.replace(/\\/g, "/");
    return isDoubleSlash ? `file://${normalized}` : `file:${normalized}`;
  }

  return targetUrl;
}
