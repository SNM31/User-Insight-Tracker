# Backend Changes Required

These changes are needed to support the new frontend event tracking (scroll depth, content clicks, page views) and to prepare data for future dashboard enhancements.

---

## 1. `EventType.java` — Add 3 New Enum Values

**File:** `api/src/main/java/com/anirudh/model/EventType.java`

Add the three new event types the frontend now fires:

```java
public enum EventType {
    LOGIN_SUCCESS,
    CATEGORY_VIEW,
    SUBCATEGORY_VIEW,
    CONTENT_OPENED,
    TIME_SPENT_ON_SUBCATEGORY,
    SESSION_DURATION,
    LOGOUT,
    PAGE_VIEW,       // fired on every route change
    SCROLL_DEPTH,    // fired at 25%, 50%, 75%, 100% scroll
    CONTENT_CLICK    // fired when user clicks an article card
}
```

---

## 2. `UserActivity.java` — Add `metadata` Column

**File:** `api/src/main/java/com/anirudh/model/UserActivity.java`

Add a flexible `metadata` text column. This avoids creating new columns for every future event-specific payload. `SCROLL_DEPTH` stores the depth percentage, `CONTENT_CLICK` stores the article title and ID — all as a JSON string.

```java
@Column(columnDefinition = "TEXT")
private String metadata;
```

Final entity should look like:

```java
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_activity")
public class UserActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;
    private String sessionId;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    private String category;
    private String subcategory;
    public Integer duration;
    private LocalDateTime timestamp;

    @Column(name = "ip_address")
    private String ipAddress;
    private String country;
    private String city;

    @Column(name = "device_type")
    private String deviceType;

    @Column(columnDefinition = "TEXT")
    private String metadata;   // <-- add this
}
```

---

## 3. `UserActivityDto.java` — Add `metadata` Field

**File:** `api/src/main/java/com/anirudh/dto/UserActivityDto.java`

Add the matching field so the controller can receive and pass it through:

```java
@Data
public class UserActivityDto {
    private String eventType;
    private String sessionId;
    private String category;
    private String subcategory;
    private Integer duration;
    private LocalDateTime timestamp;
    private String deviceinfo;
    private String metadata;   // <-- add this
}
```

---

## 4. `ActivityController.java` — Wire `metadata` + Allow New Event Types

**File:** `api/src/main/java/com/anirudh/controller/ActivityController.java`

Two small changes needed:

### 4a. Pass `metadata` into the `UserActivity` builder

In the `getUserActivity()` method, add `.metadata(userActivityDto.getMetadata())` to the builder:

```java
UserActivity userActivity = UserActivity.builder()
    .userId(user.getId())
    .sessionId(userActivityDto.getSessionId())
    .eventType(EventType.valueOf(userActivityDto.getEventType().toUpperCase()))
    .category(userActivityDto.getCategory())
    .subcategory(userActivityDto.getSubcategory())
    .duration(userActivityDto.getDuration())
    .timestamp(userActivityDto.getTimestamp())
    .ipAddress(clientIp)
    .country(geoData != null ? geoData.getCountryName() : "Unknown")
    .city(geoData != null ? geoData.getCity() : "Unknown")
    .deviceType(userActivityDto.getDeviceinfo())
    .metadata(userActivityDto.getMetadata())   // <-- add this
    .build();
```

### 4b. New event types must not fail the duration validation

The current guard rejects events without a `duration` for `SESSION_DURATION` and `TIME_SPENT_ON_SUBCATEGORY`. The three new event types don't send a duration — that's fine, no change needed there since the condition already only checks those two types. Just make sure no new blanket duration check is added.

The existing check is already correct and safe:

```java
if (userActivity.getEventType() == EventType.SESSION_DURATION
        || userActivity.getEventType() == EventType.TIME_SPENT_ON_SUBCATEGORY) {
    if (userActivity.getDuration() == null || userActivity.getDuration() <= 0) {
        return ResponseEntity.badRequest().body("Duration must be provided for ...");
    }
}
```

`PAGE_VIEW`, `SCROLL_DEPTH`, and `CONTENT_CLICK` will pass straight through this guard — no changes needed here.

---

## 5. What Each New Event Sends (for reference)

| Event | Frontend trigger | Extra fields in payload |
|-------|-----------------|------------------------|
| `PAGE_VIEW` | Every route navigation | `category` (optional), `subcategory` (optional) |
| `SCROLL_DEPTH` | At 25%, 50%, 75%, 100% scroll on listing page | `category`, `subcategory`, `depth` (int, stored in `metadata`) |
| `CONTENT_CLICK` | User clicks an article card | `category`, `subcategory`, `contentId`, `contentTitle` (stored in `metadata`) |

> **Note:** `depth`, `contentId`, and `contentTitle` are sent as top-level JSON keys from the frontend. The frontend currently sends them as separate fields — you can either store them individually or serialise them into the `metadata` column as a JSON string (e.g., `{"depth": 75}` or `{"contentId": "m-b-1", "contentTitle": "Pathaan 2..."}`). The simplest approach is to serialise in the controller using Jackson's `ObjectMapper`.

---

## Summary Checklist

- [ ] Add `PAGE_VIEW`, `SCROLL_DEPTH`, `CONTENT_CLICK` to `EventType.java`
- [ ] Add `metadata TEXT` column to `UserActivity.java`
- [ ] Add `private String metadata` to `UserActivityDto.java`
- [ ] Add `.metadata(...)` to the builder in `ActivityController.java`
- [ ] (Optional) Serialise `depth` / `contentId` / `contentTitle` fields into `metadata` JSON in the controller
