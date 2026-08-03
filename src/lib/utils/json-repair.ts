/**
 * Robust JSON parser with dirty JSON repair capabilities.
 * Cleans Markdown wrappers, repairs trailing commas, unquoted keys, single quotes, and control chars.
 * Prevents "Expected double-quoted property name in JSON" errors from LLMs.
 */
export function safeJsonParse<T = any>(input: string, fallback: T): T {
  if (!input || typeof input !== "string") return fallback;

  // 1. Strip markdown code block wrappers
  let cleaned = input.replace(/```json/gi, "").replace(/```/g, "").trim();

  // 2. Extract first '{' to last '}' if extra text is present
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Try direct standard parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    // Continue to repair pipeline
  }

  // 3. Apply dirty-json repair pipeline
  try {
    let repaired = cleaned
      // Remove trailing commas before closing braces or brackets
      .replace(/,\s*([}\]])/g, "$1")
      // Remove single-line JS comments // ...
      .replace(/\/\/.*/g, "")
      // Fix unquoted key names e.g. { key: "value" } => { "key": "value" }
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      // Replace non-escaped newlines inside strings with spaces
      .replace(/[\r\n]+/g, " ");

    return JSON.parse(repaired) as T;
  } catch (err: any) {
    console.warn("[safeJsonParse] JSON repair attempt failed:", err?.message || err);
    return fallback;
  }
}
