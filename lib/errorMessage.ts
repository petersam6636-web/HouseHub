function getText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") {
    return getText(error) ?? fallback;
  }

  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const message = "message" in error ? getText(error.message) : null;
  const details = "details" in error ? getText(error.details) : null;
  const hint = "hint" in error ? getText(error.hint) : null;
  const code = "code" in error ? getText(error.code) : null;
  const statusCode = "statusCode" in error ? getText(error.statusCode) : null;

  const diagnostic = [
    message,
    code ? `Code: ${code}` : null,
    statusCode ? `Status: ${statusCode}` : null,
    details ? `Details: ${details}` : null,
    hint ? `Hint: ${hint}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return diagnostic || fallback;
}
