package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @author USER
 **/
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // Always scoped to one recipient — there is intentionally no "find all"
    // style query exposed for the API layer.
    List<Notification> findByUser_IdOrderByCreatedAtDesc(Integer userId);

    @Query("select count(n) from Notification n where n.user.id = :userId and n.isRead = false")
    long countUnreadByUserId(@Param("userId") Integer userId);
}
