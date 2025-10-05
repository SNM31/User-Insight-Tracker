package com.anirudh.utils;

import java.util.UUID;

public final class TokenGenerator {
    private TokenGenerator() {
        // This constructor is intentionally left empty.
    }

    /**
     * Generates a new, cryptographically strong, unique token using UUID.
     * This is the recommended method for creating secure identifiers for things
     * like invitation tokens or session IDs.
     *
     * @return A unique String token (e.g., "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d").
     */
    public static String generateUniqueToken() {
        return UUID.randomUUID().toString();
    }

   }
