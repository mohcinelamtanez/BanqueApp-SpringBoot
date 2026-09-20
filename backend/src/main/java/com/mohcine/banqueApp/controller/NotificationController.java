package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.NotificationResponseDTO;
import com.mohcine.banqueApp.dto.UnreadCountResponseDTO;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.mapper.NotificationMapper;
import com.mohcine.banqueApp.service.interfaces.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Every endpoint here is scoped to the authenticated user, derived from the
 * JWT principal — there is deliberately no endpoint returning other users'
 * notifications, and none takes a user id.
 *
 * @author USER
 **/
@Tag(name = "this endpoint gives the authenticated user access to their own notifications")
@RestController
@RequestMapping("api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    public NotificationController(NotificationService notificationService,
                                  NotificationMapper notificationMapper) {
        this.notificationService = notificationService;
        this.notificationMapper = notificationMapper;
    }

    @Operation(summary = "returns the authenticated user's own notifications, newest first")
    @GetMapping("/me")
    public List<NotificationResponseDTO> getMyNotifications(Authentication authentication) {
        return notificationService.getMyNotifications(currentUserId(authentication)).stream()
                .map(notificationMapper::toDTO)
                .toList();
    }

    @Operation(summary = "returns how many of the authenticated user's notifications are unread")
    @GetMapping("/me/unread-count")
    public UnreadCountResponseDTO getMyUnreadCount(Authentication authentication) {
        return new UnreadCountResponseDTO(notificationService.countUnread(currentUserId(authentication)));
    }

    @Operation(summary = "marks one of the authenticated user's own notifications as read")
    @PatchMapping("/{id}/read")
    public NotificationResponseDTO markAsRead(@PathVariable Integer id, Authentication authentication) {
        return notificationMapper.toDTO(
                notificationService.markAsRead(currentUserId(authentication), id));
    }

    private Integer currentUserId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
