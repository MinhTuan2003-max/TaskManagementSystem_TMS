package com.luv2code.springboot.demo.tsm.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdminUserStatsResponse {
    // Getters and Setters
    private long totalUsers;
    private long activeUsers;
    private long lockedUsers;
    private long newUsersThisMonth;
    private UsersByRole usersByRole;

    public AdminUserStatsResponse() {
        this.usersByRole = new UsersByRole();
    }

    public AdminUserStatsResponse(long totalUsers, long activeUsers, long lockedUsers, long newUsersThisMonth) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.lockedUsers = lockedUsers;
        this.newUsersThisMonth = newUsersThisMonth;
        this.usersByRole = new UsersByRole();
    }

    @Setter
    @Getter
    public static class UsersByRole {
        private long admin = 0;
        private long manager = 0;
        private long user = 0;

    }
}
