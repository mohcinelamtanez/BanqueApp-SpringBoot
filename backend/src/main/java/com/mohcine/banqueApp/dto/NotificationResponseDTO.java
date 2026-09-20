package com.mohcine.banqueApp.dto;

import com.mohcine.banqueApp.enums.NotificationType;

import java.time.LocalDateTime;

/**
 * Never carries the recipient — a notification is only ever returned to its
 * own owner, so exposing user ids/emails here would add nothing but leakage.
 *
 * @author USER
 **/
public record NotificationResponseDTO(
        Integer id,
        NotificationType type,
        String message,
        boolean read,
        LocalDateTime createdAt
) {
}
