function normalizeErrorMessage(e: unknown): string {
  let message = "";
  if (e instanceof Error || e instanceof TypeError) {
    message = e.message;
  } else if (e && typeof e === "object" && "message" in e) {
    message = String(e.message).trim();
  } else if (typeof e === "string") {
    message = e;
  } else {
    message = "unknown error captured";
  }
  return message;
}
export default normalizeErrorMessage;
