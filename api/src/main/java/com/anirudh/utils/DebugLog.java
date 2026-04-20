package com.anirudh.utils;

// #region agent log
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

public final class DebugLog {
    private static final String SESSION_ID = "f3855b";
    private static final Path LOG_PATH = Path.of(
            "/Users/anirudhmathur/Desktop/User-Insight-Tracker/.cursor/debug-f3855b.log");
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private DebugLog() {}

    public static void log(String hypothesisId, String location, String message, Map<String, Object> data) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sessionId", SESSION_ID);
            payload.put("hypothesisId", hypothesisId);
            payload.put("location", location);
            payload.put("message", message);
            payload.put("data", data == null ? Map.of() : data);
            payload.put("timestamp", System.currentTimeMillis());
            String line = MAPPER.writeValueAsString(payload) + "\n";
            Files.writeString(LOG_PATH, line, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
        }
    }
}
// #endregion
