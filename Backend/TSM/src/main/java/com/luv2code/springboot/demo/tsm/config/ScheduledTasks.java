package com.luv2code.springboot.demo.tsm.config;

import com.luv2code.springboot.demo.tsm.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    @Autowired
    private NotificationService notificationService;

    // Chạy cleanup mỗi ngày lúc 2:00 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        notificationService.cleanupOldNotifications();
    }
}
