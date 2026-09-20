package com.mohcine.banqueApp.exception;

/**
 * Raised both when a notification does not exist and when it belongs to
 * another user — deliberately indistinguishable, so a caller can never probe
 * for the existence of someone else's notification.
 *
 * @author USER
 **/
public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(Integer notificationId) {
        super("Notification not found with id " + notificationId);
    }
}
