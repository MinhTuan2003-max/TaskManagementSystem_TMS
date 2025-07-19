package com.luv2code.springboot.demo.tsm.repository;

import com.luv2code.springboot.demo.tsm.entity.Notification;
import com.luv2code.springboot.demo.tsm.entity.enumerator.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Tìm notifications theo recipient với phân trang
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);

    // Tìm notifications chưa đọc
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);

    // Đếm số notifications chưa đọc
    Long countByRecipientIdAndIsReadFalse(Long recipientId);

    // Tìm notifications với thông tin actor
    @Query("SELECT n FROM Notification n LEFT JOIN FETCH n.actor WHERE n.recipientId = :recipientId ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdWithActorOrderByCreatedAtDesc(@Param("recipientId") Long recipientId, Pageable pageable);

    // Tìm notifications theo type
    List<Notification> findByRecipientIdAndTypeOrderByCreatedAtDesc(Long recipientId, NotificationType type);

    // Tìm notifications theo entity
    List<Notification> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);

    // Đánh dấu tất cả là đã đọc
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.updatedAt = CURRENT_TIMESTAMP WHERE n.recipientId = :recipientId AND n.isRead = false")
    int markAllAsReadByRecipientId(@Param("recipientId") Long recipientId);

    // Đánh dấu một notification là đã đọc
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.updatedAt = CURRENT_TIMESTAMP WHERE n.id = :notificationId AND n.recipientId = :recipientId")
    int markAsReadById(@Param("notificationId") Long notificationId, @Param("recipientId") Long recipientId);

    // Xóa notifications cũ (để tránh database quá tải)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :cutoffDate")
    void deleteOldNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Tìm notifications theo khoảng thời gian
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId AND n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientIdAndDateRange(@Param("recipientId") Long recipientId,
                                                     @Param("startDate") LocalDateTime startDate,
                                                     @Param("endDate") LocalDateTime endDate);

    // Đếm notifications theo type
    Long countByRecipientIdAndType(Long recipientId, NotificationType type);
}
