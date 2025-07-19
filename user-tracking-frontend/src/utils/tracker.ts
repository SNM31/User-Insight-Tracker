// export enum EventType {
//   SUBCATEGORY_VIEW = "SUBCATEGORY_VIEW",
//   CONTENT_OPENED = "CONTENT_OPENED",
//   TIME_SPENT_ON_SUBCATEGORY = "TIME_SPENT_ON_SUBCATEGORY",
//   SESSION_DURATION = "SESSION_DURATION",
// }
export enum EventType {
  SUBCATEGORY_VIEW = "SUBCATEGORY_VIEW",
  CONTENT_OPENED = "CONTENT_OPENED",
  TIME_SPENT_ON_SUBCATEGORY = "TIME_SPENT_ON_SUBCATEGORY",
  SESSION_DURATION = "SESSION_DURATION",
  CATEGORY_VIEW = "CATEGORY_VIEW", // ✅ newly added
}


// export const trackEvent = (eventType: EventType, data: Record<string, any>) => {
//   console.log("Tracked:", eventType, data);
//   // Future: Replace with actual POST request to backend API
// };
export const trackEvent = (eventType: EventType, data: Record<string, any> = {}) => {
  console.log("Tracked:", eventType, data);
  // TODO: send to backend when ready
};