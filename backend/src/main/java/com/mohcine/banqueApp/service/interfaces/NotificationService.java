package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.entity.Notification;

import java.util.List;

/**
 * @author USER
 **/
public interface NotificationService {

    // One notification per enabled ADMIN / BANK_AGENT account. Called from
    // inside ApplicationService.submitApplication's transaction, after the
    // Application was saved.
    void notifyBackOfficeOfNewApplication(Application application);

    // One notification for the login account linked to the application's
    // Client (nobody else). No-op if that Client has no login account.
    void notifyClientOfApplicationApproved(Application application);

    List<Notification> getMyNotifications(Integer userId);

    long countUnread(Integer userId);

    // Only ever touches a notification owned by userId — anything else
    // (missing or someone else's) is a NotificationNotFoundException.
    Notification markAsRead(Integer userId, Integer notificationId);
}
