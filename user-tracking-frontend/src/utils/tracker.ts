
export enum EventType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  SUBCATEGORY_VIEW = "SUBCATEGORY_VIEW",
  CONTENT_OPENED = "CONTENT_OPENED",
  TIME_SPENT_ON_SUBCATEGORY = "TIME_SPENT_ON_SUBCATEGORY",
  SESSION_DURATION = "SESSION_DURATION",
  CATEGORY_VIEW = "CATEGORY_VIEW", // ✅ newly added
  LOGOUT = "LOGOUT", // ✅ newly added
}
export const trackEvent = async (
  eventType: EventType,
  data: Record<string, any> = {}
) => {
  const payload = {
    eventType,
    sessionId: localStorage.getItem("sessionId") || "",
    timestamp: new Date().toISOString(),
    deviceinfo: `${navigator.platform} - ${navigator.userAgent}`,
    ...data,
  };

  try {
    console.log("Tracking event:", JSON.stringify(payload, null, 2));

    await fetch("http://localhost:8080/api/activity/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Failed to track event", eventType, error);
  }
};
