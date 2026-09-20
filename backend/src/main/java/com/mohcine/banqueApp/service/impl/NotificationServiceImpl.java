package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.entity.Notification;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.enums.NotificationType;
import com.mohcine.banqueApp.exception.NotificationNotFoundException;
import com.mohcine.banqueApp.repository.NotificationRepository;
import com.mohcine.banqueApp.repository.UserRepository;
import com.mohcine.banqueApp.service.interfaces.NotificationService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author USER
 **/
@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    static final String MSG_NEW_APPLICATION =
            "A new loan application has been submitted and needs your attention.";
    static final String MSG_APPLICATION_APPROVED =
            "Your loan application has been approved.";

    private static final List<String> BACK_OFFICE_AUTHORITIES =
            List.of("ROLE_ADMIN", "ROLE_BANK_AGENT");

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void notifyBackOfficeOfNewApplication(Application application) {
        List<User> recipients =
                userRepository.findDistinctByEnabledTrueAndAuthorities_AuthorityIn(BACK_OFFICE_AUTHORITIES);
        for (User recipient : recipients) {
            create(recipient, NotificationType.NEW_LOAN_APPLICATION, MSG_NEW_APPLICATION);
        }
        log.info("Notification {} created for {} back-office user(s) (application id {})",
                NotificationType.NEW_LOAN_APPLICATION, recipients.size(), application.getId());
    }

    @Override
    @Transactional
    public void notifyClientOfApplicationApproved(Application application) {
        User recipient = userRepository.findByClient_Id(application.getClient().getId());
        if (recipient == null) {
            log.info("No login account linked to client id {} — approval notification skipped (application id {})",
                    application.getClient().getId(), application.getId());
            return;
        }
        create(recipient, NotificationType.LOAN_APPROVED, MSG_APPLICATION_APPROVED);
        log.info("Notification {} created for user id {} (application id {})",
                NotificationType.LOAN_APPROVED, recipient.getId(), application.getId());
    }

    @Override
    public List<Notification> getMyNotifications(Integer userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    @Override
    public long countUnread(Integer userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Override
    @Transactional
    public Notification markAsRead(Integer userId, Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .filter(n -> n.getUser() != null && n.getUser().getId().equals(userId))
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    private void create(User recipient, NotificationType type, String message) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}
