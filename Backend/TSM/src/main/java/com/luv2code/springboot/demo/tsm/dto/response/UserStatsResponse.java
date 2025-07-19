package com.luv2code.springboot.demo.tsm.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long newUsersThisMonth;

    public UserStatsResponse(long totalUsers, long activeUsers, long newUsersThisMonth) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.newUsersThisMonth = newUsersThisMonth;
    }

}