package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.NotificationResponseDTO;
import com.mohcine.banqueApp.entity.Notification;
import org.springframework.stereotype.Component;

/**
 * @author USER
 **/
@Component
public class NotificationMapper {

    public NotificationResponseDTO toDTO(Notification notification) {
        return new NotificationResponseDTO(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
