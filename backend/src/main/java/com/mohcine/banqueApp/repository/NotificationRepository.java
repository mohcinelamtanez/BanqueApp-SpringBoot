package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author USER
 **/
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

}
